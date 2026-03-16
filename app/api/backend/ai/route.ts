/**
 * Proxy explícito para o chat da IA no backend.
 * Garante que o stream de resposta seja repassado corretamente (rewrites podem falhar com stream).
 */
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8081";

export const maxDuration = 60;

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const contentType = request.headers.get("content-type") ?? "";

  const res = await fetch(`${BACKEND_URL}/ai`, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
      cookie,
    },
    body: request.body,
    duplex: "half",
  } as RequestInit);

  if (!res.body) {
    return new Response(
      JSON.stringify({ error: "Resposta vazia do backend" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  const headers = new Headers();
  res.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "transfer-encoding") headers.set(key, value);
  });

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}
