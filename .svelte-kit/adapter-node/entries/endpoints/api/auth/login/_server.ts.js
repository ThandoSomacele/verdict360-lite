import { json } from "@sveltejs/kit";
import { a as authService } from "../../../../../chunks/authService.js";
import { z } from "zod";
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  tenantId: z.string().uuid("Invalid tenant ID").optional()
});
const POST = async ({ request, cookies, locals }) => {
  try {
    const body = await request.json();
    if (!body.tenantId) {
      body.tenantId = locals.tenantId || "11111111-1111-1111-1111-111111111111";
    }
    const validatedData = loginSchema.parse(body);
    const { user, accessToken, refreshToken } = await authService.login(validatedData);
    cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      // 15 minutes
      path: "/"
    });
    cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      // 7 days
      path: "/"
    });
    return json({
      success: true,
      user,
      accessToken
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof z.ZodError) {
      return json(
        {
          success: false,
          error: "Validation error",
          details: error.errors
        },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message === "Invalid credentials") {
      return json(
        {
          success: false,
          error: "Invalid email or password"
        },
        { status: 401 }
      );
    }
    return json(
      {
        success: false,
        error: "Login failed"
      },
      { status: 500 }
    );
  }
};
export {
  POST
};
