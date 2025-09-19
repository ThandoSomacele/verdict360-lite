import { json } from "@sveltejs/kit";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pkg from "knex";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = {
  development: {
    client: "postgresql",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || "verdict360_dev",
      user: process.env.DB_USER || "verdict360_user",
      password: process.env.DB_PASSWORD || "password123"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, "../database/migrations"),
      tableName: "knex_migrations"
    },
    seeds: {
      directory: path.join(__dirname, "../database/seeds")
    }
  },
  test: {
    client: "postgresql",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME_TEST || "verdict360_test",
      user: process.env.DB_USER || "verdict360_user",
      password: process.env.DB_PASSWORD || "password123"
    },
    pool: {
      min: 1,
      max: 2
    },
    migrations: {
      directory: path.join(__dirname, "../database/migrations"),
      tableName: "knex_migrations"
    },
    seeds: {
      directory: path.join(__dirname, "../database/seeds")
    }
  },
  production: {
    client: "postgresql",
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
    },
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      directory: path.join(__dirname, "../database/migrations"),
      tableName: "knex_migrations"
    },
    seeds: {
      directory: path.join(__dirname, "../database/seeds")
    }
  }
};
let db = null;
async function getDb() {
  if (db) return db;
  const environment = process.env.NODE_ENV || "development";
  const dbConfig = config[environment];
  try {
    db = pkg(dbConfig);
    await db.raw("SELECT 1");
    console.log("Database connected successfully");
    return db;
  } catch (error) {
    console.error("Database connection failed:", error);
    if (process.env.DEMO_MODE === "true") {
      console.log("Running in DEMO mode - using mock database");
      return getMockDb();
    }
    throw error;
  }
}
function getMockDb() {
  const mockData = {
    users: [
      {
        id: "demo-user-1",
        email: "demo@verdict360.com",
        password: "$2b$10$YourHashedPasswordHere",
        first_name: "Demo",
        last_name: "User",
        role: "user",
        tenant_id: "demo-tenant"
      }
    ],
    tenants: [
      {
        id: "demo-tenant",
        name: "Demo Law Firm",
        subdomain: "demo",
        settings: JSON.stringify({
          primaryColor: "#16a34a",
          logo: null
        })
      }
    ]
  };
  const mockDb = (tableName) => ({
    where: (conditions) => ({
      first: async () => {
        if (tableName === "users" && conditions.email) {
          return mockData.users.find((u) => u.email === conditions.email);
        }
        return null;
      }
    }),
    insert: async (data) => ({
      returning: () => [{ ...data, id: `demo-${Date.now()}` }]
    }),
    select: async () => mockData[tableName] || [],
    first: async () => mockData[tableName]?.[0] || null
  });
  mockDb.raw = async (query) => {
    if (query === "SELECT 1") return { rows: [{ "?column?": 1 }] };
    return { rows: [] };
  };
  mockDb.destroy = async () => {
    console.log("Closing mock database connection");
  };
  return mockDb;
}
const JWT_SECRET = process.env.JWT_SECRET || "development-secret-key";
const POST = async ({ request, cookies }) => {
  try {
    const { email, password, firstName, lastName, companyName } = await request.json();
    if (!email || !password || !firstName || !lastName) {
      return json({
        success: false,
        error: "All fields are required"
      }, { status: 400 });
    }
    const db2 = await getDb();
    const existingUser = await db2("users").where({ email }).first();
    if (existingUser) {
      return json({
        success: false,
        error: "Email already registered"
      }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let tenantId = 1;
    if (companyName) {
      const [tenant] = await db2("tenants").insert({
        name: companyName,
        subdomain: companyName.toLowerCase().replace(/\s+/g, "-"),
        settings: JSON.stringify({
          primaryColor: "#16a34a",
          logo: null
        }),
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date()
      }).returning("*");
      tenantId = tenant.id;
    }
    const [user] = await db2("users").insert({
      tenant_id: tenantId,
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role: "user",
      created_at: /* @__PURE__ */ new Date(),
      updated_at: /* @__PURE__ */ new Date()
    }).returning("*");
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        tenant_id: user.tenant_id,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    cookies.set("token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24
    });
    return json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (process.env.DEMO_MODE === "true") {
      const demoUser = {
        id: "demo-user-new",
        email: request.json().then((data) => data.email),
        first_name: "Demo",
        last_name: "User",
        role: "user"
      };
      const token = jwt.sign(demoUser, JWT_SECRET, { expiresIn: "24h" });
      cookies.set("token", token, {
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 60 * 60 * 24
      });
      return json({
        success: true,
        user: demoUser,
        token,
        message: "Demo account created"
      });
    }
    return json({
      success: false,
      error: "Signup failed"
    }, { status: 500 });
  }
};
export {
  POST
};
