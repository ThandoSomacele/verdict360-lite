import { json } from "@sveltejs/kit";
import { A as AIService } from "../../../../../chunks/aiService.js";
const aiService = new AIService();
const GET = async ({ locals }) => {
  try {
    const welcomeResponse = await aiService.generateWelcomeMessage(locals.tenantId);
    return json(welcomeResponse);
  } catch (error) {
    console.error("Welcome message error:", error);
    return json({
      response: "Good day! I'm your AI legal assistant, here to help with South African legal enquiries. How may I assist you today?",
      metadata: {
        intent: "greeting",
        shouldOfferConsultation: false,
        isDataCollection: false,
        tenantId: locals.tenantId
      }
    });
  }
};
export {
  GET
};
