import { json } from "@sveltejs/kit";
import { A as AIService } from "../../../../../chunks/aiService.js";
const aiService = new AIService();
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body;
    if (!message || typeof message !== "string") {
      return json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }
    let history = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      history = conversationHistory.slice(-10);
    }
    const aiResponse = await aiService.generateResponse(
      message.trim(),
      history,
      locals.tenantId
    );
    return json(aiResponse);
  } catch (error) {
    console.error("AI Chat error:", error);
    return json({
      response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
      metadata: {
        intent: "error",
        shouldOfferConsultation: false,
        isDataCollection: false,
        tenantId: locals.tenantId,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    }, { status: 500 });
  }
};
export {
  POST
};
