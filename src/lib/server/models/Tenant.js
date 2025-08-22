const { getDatabase } = require('../config/db');
const { clearTenantCache } = require('../middleware/tenant');
const logger = require('../utils/logger');

class Tenant {
  static async findById(id) {
    const db = getDatabase();
    return db('tenants').where({ id }).first();
  }

  static async findBySubdomain(subdomain) {
    const db = getDatabase();
    return db('tenants').where({ subdomain }).first();
  }

  static async findByCustomDomain(customDomain) {
    const db = getDatabase();
    return db('tenants').where({ custom_domain: customDomain }).first();
  }

  static async create(tenantData) {
    const db = getDatabase();
    const {
      name,
      subdomain,
      email,
      phone,
      address,
      branding = {},
      settings = {}
    } = tenantData;

    // Check if subdomain already exists
    const existingTenant = await this.findBySubdomain(subdomain);
    if (existingTenant) {
      throw new Error('Subdomain already exists');
    }

    const [tenant] = await db('tenants')
      .insert({
        name,
        subdomain,
        email,
        phone,
        address,
        branding: JSON.stringify(branding),
        settings: JSON.stringify(settings),
        status: 'active',
        subscription_status: 'trial',
        trial_ends_at: db.raw("NOW() + INTERVAL '14 days'")
      })
      .returning('*');

    logger.info(`Tenant created: ${subdomain}`);
    return tenant;
  }

  static async update(id, updateData) {
    const db = getDatabase();
    const tenant = await this.findById(id);
    
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const allowedFields = [
      'name', 'email', 'phone', 'address', 'custom_domain',
      'branding', 'settings', 'status', 'subscription_status'
    ];

    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        if (key === 'branding' || key === 'settings') {
          filteredData[key] = JSON.stringify(updateData[key]);
        } else {
          filteredData[key] = updateData[key];
        }
      }
    });

    filteredData.updated_at = db.fn.now();

    const [updatedTenant] = await db('tenants')
      .where({ id })
      .update(filteredData)
      .returning('*');

    // Clear cache
    await clearTenantCache(tenant.subdomain);
    if (tenant.custom_domain) {
      await clearTenantCache(tenant.custom_domain);
    }

    logger.info(`Tenant updated: ${tenant.subdomain}`);
    return updatedTenant;
  }

  static async updateSubscription(id, subscriptionData) {
    const db = getDatabase();
    const {
      subscriptionStatus,
      stripeCustomerId,
      stripeSubscriptionId,
      trialEndsAt
    } = subscriptionData;

    const updateData = {
      updated_at: db.fn.now()
    };

    if (subscriptionStatus) updateData.subscription_status = subscriptionStatus;
    if (stripeCustomerId) updateData.stripe_customer_id = stripeCustomerId;
    if (stripeSubscriptionId) updateData.stripe_subscription_id = stripeSubscriptionId;
    if (trialEndsAt) updateData.trial_ends_at = trialEndsAt;

    const [updatedTenant] = await db('tenants')
      .where({ id })
      .update(updateData)
      .returning('*');

    const tenant = await this.findById(id);
    await clearTenantCache(tenant.subdomain);
    if (tenant.custom_domain) {
      await clearTenantCache(tenant.custom_domain);
    }

    logger.info(`Tenant subscription updated: ${tenant.subdomain} -> ${subscriptionStatus}`);
    return updatedTenant;
  }

  static async getAll(filters = {}) {
    const db = getDatabase();
    let query = db('tenants');

    if (filters.status) {
      query = query.where('status', filters.status);
    }

    if (filters.subscriptionStatus) {
      query = query.where('subscription_status', filters.subscriptionStatus);
    }

    if (filters.search) {
      query = query.where(function() {
        this.where('name', 'ilike', `%${filters.search}%`)
          .orWhere('subdomain', 'ilike', `%${filters.search}%`)
          .orWhere('email', 'ilike', `%${filters.search}%`);
      });
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const [tenants, totalCount] = await Promise.all([
      query.clone()
        .select('*')
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),
      query.clone().count('* as count').first()
    ]);

    return {
      tenants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.count),
        pages: Math.ceil(parseInt(totalCount.count) / limit)
      }
    };
  }

  static async getStats() {
    const db = getDatabase();

    const stats = await db('tenants')
      .select(
        db.raw('COUNT(*) as total'),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as active', ['active']),
        db.raw('COUNT(*) FILTER (WHERE subscription_status = ?) as trial', ['trial']),
        db.raw('COUNT(*) FILTER (WHERE subscription_status = ?) as subscribed', ['active']),
        db.raw('COUNT(*) FILTER (WHERE subscription_status = ?) as canceled', ['canceled'])
      )
      .first();

    return {
      total: parseInt(stats.total) || 0,
      active: parseInt(stats.active) || 0,
      trial: parseInt(stats.trial) || 0,
      subscribed: parseInt(stats.subscribed) || 0,
      canceled: parseInt(stats.canceled) || 0
    };
  }

  static async delete(id) {
    const db = getDatabase();
    const tenant = await this.findById(id);
    
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Soft delete by updating status
    const [deletedTenant] = await db('tenants')
      .where({ id })
      .update({
        status: 'inactive',
        updated_at: db.fn.now()
      })
      .returning('*');

    await clearTenantCache(tenant.subdomain);
    if (tenant.custom_domain) {
      await clearTenantCache(tenant.custom_domain);
    }

    logger.info(`Tenant deactivated: ${tenant.subdomain}`);
    return deletedTenant;
  }
}

module.exports = Tenant;