import { redirect } from "@sveltejs/kit";
import { a as authService } from "../../../chunks/authService.js";
const load = async ({ cookies, locals }) => {
  const accessToken = cookies.get("access_token");
  if (!accessToken) {
    throw redirect(303, "/login?redirect=/admin");
  }
  const payload = authService.verifyAccessToken(accessToken);
  if (!payload) {
    const refreshToken = cookies.get("refresh_token");
    if (!refreshToken) {
      throw redirect(303, "/login?redirect=/admin");
    }
    try {
      const { accessToken: newAccessToken } = await authService.refreshAccessToken(refreshToken);
      cookies.set("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 15,
        path: "/"
      });
      const newPayload = authService.verifyAccessToken(newAccessToken);
      if (!newPayload) {
        throw redirect(303, "/login?redirect=/admin");
      }
      if (newPayload.role !== "admin") {
        throw redirect(303, "/dashboard");
      }
      const user2 = await authService.getUserById(newPayload.userId);
      return {
        user: user2,
        tenantId: newPayload.tenantId
      };
    } catch (error) {
      throw redirect(303, "/login?redirect=/admin");
    }
  }
  if (payload.role !== "admin") {
    throw redirect(303, "/dashboard");
  }
  const user = await authService.getUserById(payload.userId);
  return {
    user,
    tenantId: payload.tenantId
  };
};
export {
  load
};
