import { decode as atob } from "base-64";

export function decodeJWT(token) {
  const segments = token.split(".");
  if (segments.length !== 3) {
    throw new Error("Invalid JWT");
  }
  const payload = segments[1];
  const decodedPayload = atob(payload);
  return JSON.parse(decodedPayload);
}
