import { json } from "@sveltejs/kit";
import { d as db } from "../../../../../chunks/database.js";
const GET = async () => {
  try {
    const stats = {
      totalTenants: 3,
      activeConversations: 12,
      messagesThisMonth: 2847,
      totalUsers: 156
    };
    try {
      const [
        tenantCount
        // Add more queries here when tables are ready
      ] = await Promise.all([
        db("tenants").count("id as count").first()
      ]);
      if (tenantCount) {
        stats.totalTenants = parseInt(tenantCount.count) || 3;
      }
    } catch (dbError) {
      console.warn("Database stats query failed, using demo data:", dbError);
    }
    return json(stats);
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return json({
      totalTenants: 0,
      activeConversations: 0,
      messagesThisMonth: 0,
      totalUsers: 0
    }, { status: 500 });
  }
};
export {
  GET
};
