const { getDatabase } = require('../config/db');
const { hashPassword } = require('../utils/auth');
const logger = require('../utils/logger');

class User {
  static async findById(id) {
    const db = getDatabase();
    return db('users')
      .where({ id })
      .select(['id', 'tenant_id', 'email', 'first_name', 'last_name', 'role', 'status', 'avatar_url', 'preferences', 'last_login_at', 'email_verified_at', 'created_at', 'updated_at'])
      .first();
  }

  static async findByEmail(email, tenantId) {
    const db = getDatabase();
    return db('users')
      .where({ email, tenant_id: tenantId })
      .first();
  }

  static async findByEmailWithPassword(email, tenantId) {
    const db = getDatabase();
    return db('users')
      .where({ email, tenant_id: tenantId })
      .first();
  }

  static async create(userData) {
    const db = getDatabase();
    const {
      tenantId,
      email,
      password,
      firstName,
      lastName,
      role = 'staff',
      status = 'active'
    } = userData;

    // Check if user already exists
    const existingUser = await this.findByEmail(email, tenantId);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    const [user] = await db('users')
      .insert({
        tenant_id: tenantId,
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role,
        status
      })
      .returning(['id', 'tenant_id', 'email', 'first_name', 'last_name', 'role', 'status', 'created_at']);

    logger.info(`User created: ${email} (${role}) for tenant ${tenantId}`);
    return user;
  }

  static async update(id, updateData) {
    const db = getDatabase();
    const user = await this.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    const allowedFields = [
      'first_name', 'last_name', 'role', 'status', 'avatar_url', 'preferences'
    ];

    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        if (key === 'preferences') {
          filteredData[key] = JSON.stringify(updateData[key]);
        } else {
          filteredData[key] = updateData[key];
        }
      }
    });

    if (Object.keys(filteredData).length === 0) {
      throw new Error('No valid fields to update');
    }

    filteredData.updated_at = db.fn.now();

    const [updatedUser] = await db('users')
      .where({ id })
      .update(filteredData)
      .returning(['id', 'tenant_id', 'email', 'first_name', 'last_name', 'role', 'status', 'avatar_url', 'preferences', 'updated_at']);

    logger.info(`User updated: ${user.email}`);
    return updatedUser;
  }

  static async updatePassword(id, newPassword) {
    const db = getDatabase();
    const user = await this.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    const passwordHash = await hashPassword(newPassword);

    await db('users')
      .where({ id })
      .update({
        password_hash: passwordHash,
        updated_at: db.fn.now()
      });

    logger.info(`Password updated for user: ${user.email}`);
    return true;
  }

  static async updateLastLogin(id) {
    const db = getDatabase();
    
    await db('users')
      .where({ id })
      .update({
        last_login_at: db.fn.now(),
        updated_at: db.fn.now()
      });

    return true;
  }

  static async verifyEmail(id) {
    const db = getDatabase();
    const user = await this.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    await db('users')
      .where({ id })
      .update({
        email_verified_at: db.fn.now(),
        email_verification_token: null,
        updated_at: db.fn.now()
      });

    logger.info(`Email verified for user: ${user.email}`);
    return true;
  }

  static async getByTenant(tenantId, filters = {}) {
    const db = getDatabase();
    let query = db('users')
      .where({ tenant_id: tenantId })
      .select(['id', 'email', 'first_name', 'last_name', 'role', 'status', 'last_login_at', 'email_verified_at', 'created_at']);

    if (filters.role) {
      query = query.where('role', filters.role);
    }

    if (filters.status) {
      query = query.where('status', filters.status);
    }

    if (filters.search) {
      query = query.where(function() {
        this.where('first_name', 'ilike', `%${filters.search}%`)
          .orWhere('last_name', 'ilike', `%${filters.search}%`)
          .orWhere('email', 'ilike', `%${filters.search}%`);
      });
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      query.clone()
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),
      query.clone().count('* as count').first()
    ]);

    return {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.count),
        pages: Math.ceil(parseInt(totalCount.count) / limit)
      }
    };
  }

  static async getAttorneysByTenant(tenantId) {
    const db = getDatabase();
    
    return db('users')
      .where({ tenant_id: tenantId, role: 'attorney', status: 'active' })
      .select(['id', 'email', 'first_name', 'last_name'])
      .orderBy('first_name');
  }

  static async getTenantStats(tenantId) {
    const db = getDatabase();

    const stats = await db('users')
      .where({ tenant_id: tenantId })
      .select(
        db.raw('COUNT(*) as total'),
        db.raw('COUNT(*) FILTER (WHERE role = ?) as admins', ['admin']),
        db.raw('COUNT(*) FILTER (WHERE role = ?) as attorneys', ['attorney']),
        db.raw('COUNT(*) FILTER (WHERE role = ?) as staff', ['staff']),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as active', ['active']),
        db.raw('COUNT(*) FILTER (WHERE email_verified_at IS NOT NULL) as verified')
      )
      .first();

    return {
      total: parseInt(stats.total) || 0,
      admins: parseInt(stats.admins) || 0,
      attorneys: parseInt(stats.attorneys) || 0,
      staff: parseInt(stats.staff) || 0,
      active: parseInt(stats.active) || 0,
      verified: parseInt(stats.verified) || 0
    };
  }

  static async delete(id) {
    const db = getDatabase();
    const user = await this.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Soft delete by updating status
    const [deletedUser] = await db('users')
      .where({ id })
      .update({
        status: 'inactive',
        updated_at: db.fn.now()
      })
      .returning(['id', 'email', 'status']);

    logger.info(`User deactivated: ${user.email}`);
    return deletedUser;
  }

  static async hardDelete(id) {
    const db = getDatabase();
    const user = await this.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user has assigned leads
    const assignedLeads = await db('leads')
      .where({ assigned_attorney_id: id })
      .count('* as count')
      .first();

    if (parseInt(assignedLeads.count) > 0) {
      throw new Error('Cannot delete user with assigned leads. Reassign leads first.');
    }

    await db('users').where({ id }).del();

    logger.info(`User permanently deleted: ${user.email}`);
    return true;
  }
}

module.exports = User;