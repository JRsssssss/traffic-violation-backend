import { Controller, Get, Route, Post, Body } from "tsoa";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Route("User")
export class UserController extends Controller {
    @Get("/allusers")
    public async getAllUsers(){
        return await prisma.user.findMany();
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
    }


}


