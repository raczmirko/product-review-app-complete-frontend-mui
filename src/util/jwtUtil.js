import { jwtDecode } from "jwt-decode";

export const getUserRoles = () => {
    const token = localStorage.getItem("token");
    if (!token) return []; // Return an empty array if no token is found
  
    try {
      const decoded = jwtDecode(token);
      return decoded.roles || []; // Ensure it always returns an array
    } catch (error) {
      console.error("Invalid token:", error);
      return []; // Return empty array if token is invalid
    }
};
