import { next } from "@vercel/functions";

function unauthorized() {
  return new Response("Accesso riservato", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Report clienti"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

function timingSafeEqual(left, right) {
  if (left.length !== right.length) return false;

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
}

function parseBasicAuth(header) {
  if (!header || !header.startsWith("Basic ")) return null;

  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(":");
    if (separator === -1) return null;

    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

export default function middleware(request) {
  const username = process.env.PANEL_USERNAME;
  const password = process.env.PANEL_PASSWORD;

  if (!username || !password) {
    return unauthorized();
  }

  const credentials = parseBasicAuth(request.headers.get("authorization"));

  if (
    !credentials ||
    !timingSafeEqual(credentials.username, username) ||
    !timingSafeEqual(credentials.password, password)
  ) {
    return unauthorized();
  }

  return next();
}

export const config = {
  matcher: ["/area_clienti_social/:path*", "/api/meta-insights"],
};
