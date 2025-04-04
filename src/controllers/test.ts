import { Controller, Get, Route } from "tsoa";

@Route("hello")
export class TestController extends Controller {
  @Get("/")
  public async sayHello(): Promise<{ message: string }> {
    return { message: "Hello World" };
  }
}