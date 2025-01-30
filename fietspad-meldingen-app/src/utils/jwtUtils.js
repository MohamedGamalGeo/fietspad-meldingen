import { jwtDecode } from "jwt-decode";

export const getUsernameFromToken = (token) => {
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.username || null;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
