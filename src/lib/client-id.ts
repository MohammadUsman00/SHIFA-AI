const KEY = "shifa-client-id";

export function getClientId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = `c_${crypto.randomUUID().slice(0, 12)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}
