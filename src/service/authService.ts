import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const TOKEN_EXPIRY = "24h";

export interface UserPayload {
  id: number;
  username: string;
  role: string;
}

export class AuthService {
  /**
   * Generate JWT token for authenticated user
   */
  public static generateToken(user: UserPayload): string {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );
  }

  /**
   * Verify JWT token and return decoded user info
   */
  public static verifyToken(token: string): UserPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Authenticate user by username and password
   */
  public static async authenticateUser(
    username: string,
    password: string
  ): Promise<{ user: UserPayload; token: string } | null> {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || !(await argon2.verify(user.password, password))) {
      return null;
    }

    const userPayload: UserPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      user: userPayload,
      token: this.generateToken(userPayload),
    };
  }

  /**
   * Check if a user has the required role
   */
  public static hasRole(userRoles: string, requiredRoles: string[]): boolean {
    return requiredRoles.includes(userRoles);
  }
}
