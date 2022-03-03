import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password']);

    const token = await auth.attempt(email, password, {
      expiresIn: "1 hour",
    });

    return token;
  }

  public async logout({ auth }: HttpContextContract) {
    return await auth.logout();
  }
}
