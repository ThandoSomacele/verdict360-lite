import { json } from "@sveltejs/kit";
const GET = async () => {
  return json({
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "2.0.0-sveltekit"
  });
};
export {
  GET
};
