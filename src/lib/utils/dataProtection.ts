import crypto from 'crypto';
import type { Knex } from 'knex';

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypt sensitive data for storage
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypt sensitive data
 */
export function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString();
}

/**
 * Anonymize personal data for analytics
 */
export function anonymizeData(data: any): any {
  const anonymized = { ...data };
  
  // Remove or hash PII fields
  const piiFields = ['email', 'phone', 'address', 'id_number', 'ssn', 'passport'];
  
  for (const field of piiFields) {
    if (anonymized[field]) {
      anonymized[field] = hashData(anonymized[field]);
    }
  }
  
  // Mask names
  if (anonymized.name) {
    anonymized.name = maskName(anonymized.name);
  }
  if (anonymized.first_name) {
    anonymized.first_name = maskName(anonymized.first_name);
  }
  if (anonymized.last_name) {
    anonymized.last_name = maskName(anonymized.last_name);
  }
  
  return anonymized;
}

/**
 * Hash data for one-way anonymization
 */
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Mask names for privacy
 */
function maskName(name: string): string {
  if (name.length <= 2) return '***';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

/**
 * Generate audit log entry
 */
export interface AuditLogEntry {
  tenant_id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  created_at: Date;
}

export async function createAuditLog(
  db: Knex,
  entry: Omit<AuditLogEntry, 'created_at'>
): Promise<void> {
  try {
    await db('audit_logs').insert({
      ...entry,
      metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
      created_at: new Date()
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Data retention policy enforcement
 */
export interface RetentionPolicy {
  table: string;
  field: string;
  retentionDays: number;
  action: 'delete' | 'anonymize';
}

const RETENTION_POLICIES: RetentionPolicy[] = [
  { table: 'conversations', field: 'created_at', retentionDays: 30, action: 'anonymize' },
  { table: 'messages', field: 'created_at', retentionDays: 30, action: 'anonymize' },
  { table: 'audit_logs', field: 'created_at', retentionDays: 90, action: 'delete' },
  { table: 'email_logs', field: 'created_at', retentionDays: 180, action: 'delete' },
];

export async function enforceRetentionPolicies(db: Knex): Promise<void> {
  for (const policy of RETENTION_POLICIES) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - policy.retentionDays);
    
    try {
      if (policy.action === 'delete') {
        await db(policy.table)
          .where(policy.field, '<', cutoffDate)
          .delete();
      } else if (policy.action === 'anonymize') {
        // Anonymize old records
        const records = await db(policy.table)
          .where(policy.field, '<', cutoffDate)
          .select('*');
        
        for (const record of records) {
          const anonymized = anonymizeData(record);
          await db(policy.table)
            .where('id', record.id)
            .update(anonymized);
        }
      }
    } catch (error) {
      console.error(`Failed to enforce retention policy for ${policy.table}:`, error);
    }
  }
}

/**
 * Generate data export for POPIA data subject requests
 */
export async function exportUserData(
  db: Knex,
  tenantId: string,
  userId: string
): Promise<Record<string, any>> {
  const userData: Record<string, any> = {};
  
  // Collect user profile
  userData.profile = await db('users')
    .where({ tenant_id: tenantId, id: userId })
    .first();
  
  // Collect related data
  userData.conversations = await db('conversations')
    .where({ tenant_id: tenantId, lead_id: userId })
    .select('*');
  
  userData.messages = await db('messages')
    .whereIn('conversation_id', userData.conversations.map((c: any) => c.id))
    .select('*');
  
  userData.appointments = await db('appointments')
    .where({ tenant_id: tenantId, lead_id: userId })
    .select('*');
  
  return userData;
}

/**
 * Delete user data for POPIA compliance
 */
export async function deleteUserData(
  db: Knex,
  tenantId: string,
  userId: string
): Promise<void> {
  const trx = await db.transaction();
  
  try {
    // Get conversation IDs first
    const conversations = await trx('conversations')
      .where({ tenant_id: tenantId, lead_id: userId })
      .select('id');
    
    const conversationIds = conversations.map(c => c.id);
    
    // Delete messages
    if (conversationIds.length > 0) {
      await trx('messages')
        .whereIn('conversation_id', conversationIds)
        .delete();
    }
    
    // Delete conversations
    await trx('conversations')
      .where({ tenant_id: tenantId, lead_id: userId })
      .delete();
    
    // Delete appointments
    await trx('appointments')
      .where({ tenant_id: tenantId, lead_id: userId })
      .delete();
    
    // Delete or anonymize user record
    await trx('users')
      .where({ tenant_id: tenantId, id: userId })
      .update({
        email: `deleted_${userId}@anonymous.local`,
        name: 'Deleted User',
        phone: null,
        deleted_at: new Date()
      });
    
    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

/**
 * Check consent status
 */
export async function checkConsent(
  db: Knex,
  tenantId: string,
  userId: string,
  consentType: string
): Promise<boolean> {
  const consent = await db('user_consents')
    .where({
      tenant_id: tenantId,
      user_id: userId,
      consent_type: consentType,
      status: 'granted'
    })
    .first();
  
  return !!consent;
}

/**
 * Record consent
 */
export async function recordConsent(
  db: Knex,
  tenantId: string,
  userId: string,
  consentType: string,
  status: 'granted' | 'withdrawn',
  metadata?: Record<string, any>
): Promise<void> {
  await db('user_consents').insert({
    tenant_id: tenantId,
    user_id: userId,
    consent_type: consentType,
    status,
    metadata: metadata ? JSON.stringify(metadata) : null,
    created_at: new Date()
  });
}