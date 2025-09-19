import { json } from "@sveltejs/kit";
const POST = async ({ cookies }) => {
  cookies.delete("token", { path: "/" });
  return json({
    success: true,
    message: "Logged out successfully"
  });
};
export {
  POST
};
