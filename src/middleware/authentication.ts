import * as express from "express";
import { AuthService } from "../service/authService";

/**
 * This function is used by TSOA for authentication.
 * It maps the 'Officer' and 'Admin' security tags to their respective JWT authentication requirements.
 */
export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    return new Promise((resolve, reject) => {
      // Get the JWT token from the Authorization header
      const token = request.headers.authorization?.split(" ")[1];

      if (!token) {
        reject(new Error("No token provided"));
        return;
      }

      // Verify the token
      const user = AuthService.verifyToken(token);

      if (!user) {
        reject(new Error("Invalid token"));
        return;
      }

      // Check if the user has the required roles (from Tags)
      if (scopes && scopes.length > 0) {
        // Convert roles from Tags to role names
        const requiredRoles = scopes.map((scope) => scope);

        if (!AuthService.hasRole(user.role, requiredRoles)) {
          reject(
            new Error(
              `User does not have required role: ${requiredRoles.join(", ")}`
            )
          );
          return;
        }
      }

      // Authentication successful
      resolve(user);
    });
  }

  // If security name is not 'jwt', return error
  return Promise.reject(new Error("Unknown security name"));
}
