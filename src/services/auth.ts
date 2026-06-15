export interface AuthResponse {
  token: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json();
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    }
  );

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  return res.json();
}
