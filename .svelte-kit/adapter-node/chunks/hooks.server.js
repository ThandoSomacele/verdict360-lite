const handle = async ({ event, resolve }) => {
  const hostname = event.url.hostname;
  const subdomain = hostname.split(".")[0];
  let tenantId = "11111111-1111-1111-1111-111111111111";
  if (hostname.includes("localhost")) {
    if (subdomain && subdomain !== "localhost" && subdomain !== "www") {
      tenantId = subdomain;
    }
    const headerTenant = event.request.headers.get("X-Tenant-Id");
    if (headerTenant) {
      tenantId = headerTenant;
    }
  } else if (subdomain && subdomain !== "www" && subdomain !== "api") {
    tenantId = subdomain;
  }
  event.locals.tenantId = tenantId;
  if (event.url.pathname.startsWith("/api/")) {
    const origin = event.request.headers.get("origin");
    if (event.request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": origin || "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Tenant-Id",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400"
        }
      });
    }
  }
  const response = await resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range";
    }
  });
  if (event.url.pathname.startsWith("/api/")) {
    const origin = event.request.headers.get("origin");
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }
  return response;
};
export {
  handle
};
