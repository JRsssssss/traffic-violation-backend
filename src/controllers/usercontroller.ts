import {
  Controller,
  Get,
  Route,
  Post,
  Body,
  Delete,
  Put,
  Tags,
  Security,
} from "tsoa";
import { UserService } from "../service/userService";

const userService = new UserService();

@Route("User")
export class UserController extends Controller {
  @Get("/allusers")
  @Tags("Administrator")
  @Security("jwt", ["Administrator"])
  public async getAllUsers() {
    return await userService.getAllUsers();
  }

  @Post("/userById")
  @Tags("Administrator")
  @Security("jwt", ["Administrator"])
  public async getUserById(@Body() request: { id: number }): Promise<
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
    const { id } = request;
    const result = await userService.getUserById(id);

    if ("error" in result) {
      this.setStatus(404);
    }

    return result;
  }

  @Post("/login")
  @Tags("Officer", "Administrator")
  public async login(
    @Body() request: { username: string; password: string }
  ): Promise<
    | {
        user: { id: number; name: string; username: string; role: string };
        token: string;
      }
    | { error: string }
  > {
    const { username, password } = request;
    const result = await userService.login(username, password);

    if ("error" in result) {
      this.setStatus(
        result.error === "Invalid username or password" ? 401 : 500
      );
    }

    return result;
  }

  @Post("/createUser")
  @Tags("Administrator")
  @Security("jwt", ["Administrator"])
  public async createUser(
    @Body()
    request: {
      name: string;
      username: string;
      password: string;
      role: string;
    }
  ): Promise<
    | { user: { id: number; name: string; username: string; role: string } }
    | { error: string }
  > {
    const { name, username, password, role } = request;
    const result = await userService.createUser(name, username, password, role);

    if ("error" in result) {
      this.setStatus(
        result.error === "All fields are required"
          ? 400
          : result.error === "Username already exists"
          ? 409
          : 500
      );
    }

    return result;
  }

  @Put("/updateUserById")
  @Tags("Administrator")
  @Security("jwt", ["Administrator"])
  public async updateUserById(
    @Body()
    request: {
      id: number;
      name?: string;
      username?: string;
      password?: string;
      role?: string;
    }
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
    const { id, name, username, password, role } = request;
    const result = await userService.updateUserById(
      id,
      name,
      username,
      password,
      role
    );

    if ("error" in result) {
      this.setStatus(result.error === "User not found" ? 404 : 500);
    }

    return result;
  }

  @Delete("/deleteUser")
  @Tags("Administrator")
  @Security("jwt", ["Administrator"])
  public async deleteUser(@Body() request: { userId: number }) {
    const { userId } = request;
    const result = await userService.deleteUser(userId);

    if ("error" in result) {
      this.setStatus(result.error === "User not found" ? 404 : 500);
    }

    return result;
  }
}
