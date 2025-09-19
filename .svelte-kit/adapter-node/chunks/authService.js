import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { d as db } from "./database.js";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-change-in-production";
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
class AuthService {
  /**
   * Hash a password using bcrypt
   */
  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
  /**
   * Compare password with hash
   */
  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
  /**
   * Generate access token
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY
    });
  }
  /**
   * Generate refresh token
   */
  generateRefreshToken(payload) {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY
    });
  }
  /**
   * Verify access token
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
  /**
   * Verify refresh token
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  }
  /**
   * Register new user
   */
  async register(data) {
    try {
      const existingUser = await db("users").where("email", data.email).where("tenant_id", data.tenantId).first();
      if (existingUser) {
        throw new Error("User already exists");
      }
      const hashedPassword = await this.hashPassword(data.password);
      const [user] = await db("users").insert({
        email: data.email,
        password_hash: hashedPassword,
        name: data.name,
        tenant_id: data.tenantId,
        role: data.role || "user",
        status: "active",
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date()
      }).returning("*");
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        tenantId: user.tenant_id,
        role: user.role
      };
      const accessToken = this.generateAccessToken(tokenPayload);
      const refreshToken = this.generateRefreshToken(tokenPayload);
      await db("refresh_tokens").insert({
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3),
        // 7 days
        created_at: /* @__PURE__ */ new Date()
      });
      delete user.password_hash;
      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }
  /**
   * Login user
   */
  async login(data) {
    try {
      const user = await db("users").where("email", data.email).where("tenant_id", data.tenantId).where("status", "active").first();
      if (!user) {
        throw new Error("Invalid credentials");
      }
      const isValidPassword = await this.verifyPassword(data.password, user.password_hash);
      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }
      await db("users").where("id", user.id).update({
        last_login_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date()
      });
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        tenantId: user.tenant_id,
        role: user.role
      };
      const accessToken = this.generateAccessToken(tokenPayload);
      const refreshToken = this.generateRefreshToken(tokenPayload);
      await db("refresh_tokens").insert({
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3),
        created_at: /* @__PURE__ */ new Date()
      });
      delete user.password_hash;
      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
  /**
   * Logout user (invalidate refresh token)
   */
  async logout(refreshToken) {
    try {
      await db("refresh_tokens").where("token", refreshToken).delete();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const payload = this.verifyRefreshToken(refreshToken);
      if (!payload) {
        throw new Error("Invalid refresh token");
      }
      const storedToken = await db("refresh_tokens").where("token", refreshToken).where("expires_at", ">", /* @__PURE__ */ new Date()).first();
      if (!storedToken) {
        throw new Error("Refresh token not found or expired");
      }
      const newAccessToken = this.generateAccessToken({
        userId: payload.userId,
        email: payload.email,
        tenantId: payload.tenantId,
        role: payload.role
      });
      return { accessToken: newAccessToken };
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  }
  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      const user = await db("users").where("id", userId).first();
      if (user) {
        delete user.password_hash;
      }
      return user;
    } catch (error) {
      console.error("Get user error:", error);
      return null;
    }
  }
  /**
   * Update user password
   */
  async updatePassword(userId, oldPassword, newPassword) {
    try {
      const user = await db("users").where("id", userId).first();
      if (!user) {
        throw new Error("User not found");
      }
      const isValid = await this.verifyPassword(oldPassword, user.password_hash);
      if (!isValid) {
        throw new Error("Invalid current password");
      }
      const hashedPassword = await this.hashPassword(newPassword);
      await db("users").where("id", userId).update({
        password_hash: hashedPassword,
        updated_at: /* @__PURE__ */ new Date()
      });
    } catch (error) {
      console.error("Password update error:", error);
      throw error;
    }
  }
}
const authService = new AuthService();
export {
  authService as a
};
