import { json } from "@sveltejs/kit";
import { d as db } from "../../../../../chunks/database.js";
const GET = async ({ url }) => {
  try {
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    let tenants = [];
    try {
      tenants = await db("tenants").select("*").orderBy("created_at", "desc").limit(limit).offset(offset);
    } catch (dbError) {
      console.warn("Database tenant query failed, using demo data:", dbError);
      tenants = [
        {
          id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
          name: "Demo Law Firm",
          subdomain: "demo",
          email: "demo@verdict360.com",
          phone: "+27 11 123 4567",
          status: "active",
          created_at: /* @__PURE__ */ new Date("2024-01-15"),
          updated_at: /* @__PURE__ */ new Date("2024-01-15")
        },
        {
          id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
          name: "Cape Town Legal",
          subdomain: "capetown",
          email: "info@capetownlegal.co.za",
          phone: "+27 21 987 6543",
          status: "active",
          created_at: /* @__PURE__ */ new Date("2024-02-01"),
          updated_at: /* @__PURE__ */ new Date("2024-02-01")
        },
        {
          id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
          name: "Johannesburg Associates",
          subdomain: "jburg",
          email: "contact@jburglaw.co.za",
          phone: "+27 11 555 0123",
          status: "inactive",
          created_at: /* @__PURE__ */ new Date("2024-02-15"),
          updated_at: /* @__PURE__ */ new Date("view-02-15")
        }
      ].slice(0, limit);
    }
    return json({
      tenants,
      total: tenants.length,
      limit,
      offset
    });
  } catch (error) {
    console.error("Failed to fetch tenants:", error);
    return json({
      tenants: [],
      total: 0,
      limit: 10,
      offset: 0
    }, { status: 500 });
  }
};
export {
  GET
};
