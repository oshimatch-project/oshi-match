
export async function onRequest(context) {
  const expectedPassword = context.env.SITE_PASSWORD;

  if (!expectedPassword) {
    return new Response("Authentication is not configured.", {
      status: 503,
    });
  }

  const authorization =
    context.request.headers.get("Authorization") || "";

  if (authorization.startsWith("Basic ")) {
    try {
      const decoded = atob(authorization.slice(6));

      if (decoded === `oshi:${expectedPassword}`) {
        return context.next();
      }
    } catch {}
  }

  return new Response("パスワードを入力してください。", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Oshi Match"',
      "Cache-Control": "no-store",
    },
  });
}
