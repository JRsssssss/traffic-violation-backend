import { Controller, Get, Route, Post, Body, Delete, Put } from "tsoa";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Route("User")
export class UserController extends Controller {
    @Get("/allusers")
    public async getAllUsers(){
        return await prisma.user.findMany();
    }

    @Post("/userById")
    public async getUserById(@Body() request: { id: number }): 
                              Promise<{ user: { id: number; name: string; username: string; password: string, role: string } } | { error: string }> {
        const { id } = request;

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            this.setStatus(404); // Not Found
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
    }

    @Post("/login")
    public async login(@Body() request: { username: string; password: string }): 
                        Promise<{ user: { id: number; name: string; username: string; role: string } } | { error: string }> {
        const { username, password } = request;

        const user = await prisma.user.findUnique({
                                                    where: { username },
        });

        if (!user) {
            this.setStatus(401);
            return { error: "Invalid username or password" };
        }

        if (user.password !== password) {
            this.setStatus(401);
            return { error: "Invalid username or password" };
        }

        return {
        user: {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
        },
        };

    }
    
    @Post("/createUser")
    public async createUser(@Body() request: { name: string; username: string; password: string; role: string }): 
                            Promise<{ user: { id: number; name: string; username: string; role: string } } | { error: string }> {
        const { name, username, password, role } = request;

        if (!name || !username || !password || !role) {
            this.setStatus(400);
            return { error: "All fields are required" };
        }

        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            this.setStatus(409);
            return { error: "Username already exists" };
        }

        try {
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
            this.setStatus(500);
            return { error: "Internal server error" };
        }
        
    }

    @Put("/updateUserById")
    public async updateUserById(@Body() request: { id: number; name?: string; username?: string; password?: string; role?: string }): 
                                Promise<{ user: { id: number; name: string; username: string; password: string; role: string } } | { error: string }> {
        const { id, name, username, password, role } = request;

        try {
            const existingUser = await prisma.user.findUnique({ where: { id } });

            if (!existingUser) {
            this.setStatus(404);
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
            this.setStatus(500);
            return { error: "An error occurred while updating the user" };
        }
    }

    @Delete("/deleteUser")
    public async deleteUser(@Body() request:{userId: number}){
        const {userId} = request;
        try {
            const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        
            if (!existingUser) {
              this.setStatus(404);
              return { error: "User not found" };
            }
        
            await prisma.user.delete({ where: { id: userId } });
        
            return { message: "User deleted successfully" };
          } catch (error) {
            this.setStatus(500);
            return { error: "An error occurred while deleting the user" };
          }

    }


}


