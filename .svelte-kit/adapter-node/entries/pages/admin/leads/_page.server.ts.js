import { d as db } from "../../../../chunks/database.js";
import { fail } from "@sveltejs/kit";
const load = async ({ parent, url }) => {
  const { tenantId } = await parent();
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "all";
  try {
    let query = db("chat_leads").where("tenant_id", tenantId);
    if (search) {
      query = query.where(function() {
        this.where("name", "ilike", `%${search}%`).orWhere("email", "ilike", `%${search}%`).orWhere("phone", "ilike", `%${search}%`).orWhere("enquiry_details", "ilike", `%${search}%`);
      });
    }
    if (status !== "all") {
      query = query.where("status", status);
    }
    const [{ count }] = await query.clone().count("* as count");
    const leads = await query.select("*").orderBy("created_at", "desc").limit(limit).offset(offset);
    const stats = await db("chat_leads").where("tenant_id", tenantId).select(
      db.raw("COUNT(*) as total"),
      db.raw("COUNT(CASE WHEN status = 'new' THEN 1 END) as new"),
      db.raw("COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted"),
      db.raw("COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified"),
      db.raw("COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted")
    ).first();
    return {
      leads,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit)
      },
      filters: {
        search,
        status
      },
      stats
    };
  } catch (error) {
    console.error("Error loading leads:", error);
    return {
      leads: [],
      pagination: {
        page: 1,
        limit,
        total: 0,
        totalPages: 0
      },
      filters: {
        search: "",
        status: "all"
      },
      stats: {
        total: 0,
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0
      }
    };
  }
};
const actions = {
  updateStatus: async ({ request, locals }) => {
    const data = await request.formData();
    const leadId = data.get("leadId");
    const status = data.get("status");
    if (!leadId || !status) {
      return fail(400, { error: "Missing required fields" });
    }
    try {
      await db("chat_leads").where("id", leadId).where("tenant_id", locals.tenantId).update({
        status,
        updated_at: /* @__PURE__ */ new Date()
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating lead status:", error);
      return fail(500, { error: "Failed to update lead status" });
    }
  },
  updateAssignment: async ({ request, locals }) => {
    const data = await request.formData();
    const leadId = data.get("leadId");
    const assignedTo = data.get("assignedTo");
    if (!leadId) {
      return fail(400, { error: "Missing lead ID" });
    }
    try {
      await db("chat_leads").where("id", leadId).where("tenant_id", locals.tenantId).update({
        assigned_to: assignedTo || null,
        updated_at: /* @__PURE__ */ new Date()
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating lead assignment:", error);
      return fail(500, { error: "Failed to update lead assignment" });
    }
  },
  addNote: async ({ request, locals }) => {
    const data = await request.formData();
    const leadId = data.get("leadId");
    const note = data.get("note");
    if (!leadId || !note) {
      return fail(400, { error: "Missing required fields" });
    }
    try {
      const lead = await db("chat_leads").where("id", leadId).where("tenant_id", locals.tenantId).first();
      if (!lead) {
        return fail(404, { error: "Lead not found" });
      }
      const currentNotes = lead.internal_notes || "";
      const newNote = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${note}`;
      const updatedNotes = currentNotes ? `${currentNotes}
${newNote}` : newNote;
      await db("chat_leads").where("id", leadId).update({
        internal_notes: updatedNotes,
        updated_at: /* @__PURE__ */ new Date()
      });
      return { success: true };
    } catch (error) {
      console.error("Error adding note:", error);
      return fail(500, { error: "Failed to add note" });
    }
  },
  deleteLead: async ({ request, locals }) => {
    const data = await request.formData();
    const leadId = data.get("leadId");
    if (!leadId) {
      return fail(400, { error: "Missing lead ID" });
    }
    try {
      await db("chat_leads").where("id", leadId).where("tenant_id", locals.tenantId).delete();
      return { success: true };
    } catch (error) {
      console.error("Error deleting lead:", error);
      return fail(500, { error: "Failed to delete lead" });
    }
  }
};
export {
  actions,
  load
};
