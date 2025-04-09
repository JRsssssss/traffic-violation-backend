import { PrismaClient } from "@prisma/client";
import { AuthService } from "./authService";

const prisma = new PrismaClient();

export class UserService {
  public async getAllUsers() {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  public async getUserById(id: number): Promise<
    | {
        user: {
          id: number;
          name: string;
          username: string;
          password: string;
          role: string;
        };
      }
    | { error: string }
  > {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return { error: "User not found" };
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          password: user.password,
          role: user.role,
        },
      };
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return { error: "Internal server error" };
    }
  }

  public async login(
    username: string,
    password: string
  ): Promise<
    | {
        user: { id: number; name: string; username: string; role: string };
        token: string;
      }
    | { error: string }
  > {
    try {
      const authResult = await AuthService.authenticateUser(username, password);

      if (!authResult) {
        return { error: "Invalid username or password" };
      }

      // Get full user data to include name
      const user = await prisma.user.findUnique({
        where: { id: authResult.user.id },
      });

      if (!user) {
        return { error: "User data not found" };
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
        },
        token: authResult.token,
      };
    } catch (error) {
      console.error("Error during login:", error);
      return { error: "Internal server error" };
    }
  }

  public async createUser(
    name: string,
    username: string,
    password: string,
    role: string
  ): Promise<
    | { user: { id: number; name: string; username: string; role: string } }
    | { error: string }
  > {
    try {
      if (!name || !username || !password || !role) {
        return { error: "All fields are required" };
      }

      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        return { error: "Username already exists" };
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          username,
          password,
          role,
        },
      });

      return {
        user: {
          id: newUser.id,
          name: newUser.name,
          username: newUser.username,
          role: newUser.role,
        },
      };
    } catch (error) {
      console.error("Error creating user:", error);
      return { error: "Internal server error" };
    }
  }

  public async updateUserById(
    id: number,
    name?: string,
    username?: string,
    password?: string,
    role?: string
  ): Promise<
    | {
        user: {
          id: number;
          name: string;
          username: string;
          password: string;
          role: string;
        };
      }
    | { error: string }
  > {
    try {
      const existingUser = await prisma.user.findUnique({ where: { id } });

      if (!existingUser) {
        return { error: "User not found" };
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name: name ?? existingUser.name,
          username: username ?? existingUser.username,
          password: password ?? existingUser.password,
          role: role ?? existingUser.role,
        },
      });

      return {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          username: updatedUser.username,
          password: updatedUser.password,
          role: updatedUser.role,
        },
      };
    } catch (error) {
      console.error("Error updating user:", error);
      return { error: "An error occurred while updating the user" };
    }
  }

  public async deleteUser(
    userId: number
  ): Promise<{ message: string } | { error: string }> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return { error: "User not found" };
      }

      await prisma.user.delete({ where: { id: userId } });

      return { message: "User deleted successfully" };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { error: "An error occurred while deleting the user" };
    }
  }
}
