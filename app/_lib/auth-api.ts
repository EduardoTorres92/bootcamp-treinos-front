const apiUrl =
  typeof window !== "undefined"
    ? ""
    : process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";
const apiBase =
  typeof window === "undefined"
    ? apiUrl
    : "/api/backend";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type Session = {
  user: AuthUser;
} | null;

export async function getSession(): Promise<{ data: Session }> {
  const { headers } = await import("next/headers");
  const h = await headers();
  const cookie = h.get("cookie") ?? "";

  const res = await fetch(`${apiBase}/api/auth/me`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!res.ok) return { data: null };
  const data = await res.json();
  return { data: data as { user: AuthUser } };
}

export async function login(
  email: string,
  password: string
): Promise<{ user: AuthUser } | { error: string }> {
  const res = await fetch(`${apiBase}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const json = await res.json();
  if (!res.ok) {
    return { error: (json as { error?: string }).error ?? "Erro ao entrar" };
  }
  return json as { user: AuthUser };
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ user: AuthUser } | { error: string }> {
  const res = await fetch(`${apiBase}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
    credentials: "include",
  });

  const json = await res.json();
  if (!res.ok) {
    return {
      error: (json as { error?: string }).error ?? "Erro ao cadastrar",
    };
  }
  return json as { user: AuthUser };
}

export async function logout(): Promise<void> {
  await fetch(`${apiBase}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
