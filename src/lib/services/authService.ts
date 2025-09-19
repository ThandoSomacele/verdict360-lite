import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '$lib/config/database';
import type { User } from '$lib/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

interface TokenPayload {
  userId: string;
  email: string;
  tenantId: string;
  role: string;
}

export class AuthService {
  /**
   * Hash a password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate access token
   */
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY
    });
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY
    });
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Register new user
   */
  async register(data: {
    email: string;
    password: string;
    name: string;
    tenantId: string;
    role?: string;
  }): Promise<{ user: Partial<User>; accessToken: string; refreshToken: string }> {
    try {
      // Check if user already exists
      const existingUser = await db('users')
        .where('email', data.email)
        .where('tenant_id', data.tenantId)
        .first();

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(data.password);

      // Create user
      const [user] = await db('users').insert({
        email: data.email,
        password_hash: hashedPassword,
        name: data.name,
        tenant_id: data.tenantId,
        role: data.role || 'user',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }).returning('*');

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        tenantId: user.tenant_id,
        role: user.role
      };

      const accessToken = this.generateAccessToken(tokenPayload);
      const refreshToken = this.generateRefreshToken(tokenPayload);

      // Store refresh token in database
      await db('refresh_tokens').insert({
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        created_at: new Date()
      });

      // Remove sensitive data
      delete user.password_hash;

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(data: {
    email: string;
    password: string;
    tenantId: string;
  }): Promise<{ user: Partial<User>; accessToken: string; refreshToken: string }> {
    try {
      // Find user
      const user = await db('users')
        .where('email', data.email)
        .where('tenant_id', data.tenantId)
        .where('status', 'active')
        .first();

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(data.password, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await db('users')
        .where('id', user.id)
        .update({
          last_login_at: new Date(),
          updated_at: new Date()
        });

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        tenantId: user.tenant_id,
        role: user.role
      };

      const accessToken = this.generateAccessToken(tokenPayload);
      const refreshToken = this.generateRefreshToken(tokenPayload);

      // Store refresh token
      await db('refresh_tokens').insert({
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        created_at: new Date()
      });

      // Remove sensitive data
      delete user.password_hash;

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      await db('refresh_tokens')
        .where('token', refreshToken)
        .delete();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const payload = this.verifyRefreshToken(refreshToken);
      if (!payload) {
        throw new Error('Invalid refresh token');
      }

      // Check if refresh token exists in database
      const storedToken = await db('refresh_tokens')
        .where('token', refreshToken)
        .where('expires_at', '>', new Date())
        .first();

      if (!storedToken) {
        throw new Error('Refresh token not found or expired');
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken({
        userId: payload.userId,
        email: payload.email,
        tenantId: payload.tenantId,
        role: payload.role
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<Partial<User> | null> {
    try {
      const user = await db('users')
        .where('id', userId)
        .first();

      if (user) {
        delete user.password_hash;
      }

      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await db('users')
        .where('id', userId)
        .first();

      if (!user) {
        throw new Error('User not found');
      }

      // Verify old password
      const isValid = await this.verifyPassword(oldPassword, user.password_hash);
      if (!isValid) {
        throw new Error('Invalid current password');
      }

      // Hash new password
      const hashedPassword = await this.hashPassword(newPassword);

      // Update password
      await db('users')
        .where('id', userId)
        .update({
          password_hash: hashedPassword,
          updated_at: new Date()
        });
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();