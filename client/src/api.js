export const API = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: options.body ? { "Content-Type": "application/json" } : {},
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // response was not JSON
  }

  if (!res.ok) {
    throw new Error((data && data.error) || "Something went wrong");
  }
  return data;
}