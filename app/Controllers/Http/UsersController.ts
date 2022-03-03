import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import VerifyEmail from "App/Mailers/VerifyEmail";
import User from "../../Models/User";

export default class UsersController {
  public async register({ request, response }: HttpContextContract) {
    const { name, email, password } = request.only([
      "name",
      "email",
      "password",
    ]);

    const hasUser = await User.findBy("email", email);

    if (!hasUser) {
      let newUser = await User.create({ name, email, password });
      return response
        .status(201)
        .json({ message: `Usuário ${newUser.email} criado com sucesso!` });
    } else {
      return { error: "Usuário indisponível" };
    }
  }

  public async listAll({}: HttpContextContract) {
    const list = await User.all();

    const users = list.map((item) => {
      return {
        nome: item.name,
        email: item.email,
      };
    });

    return users;
  }

  public async updateNameUser({ request }: HttpContextContract) {
    const { id } = request.params();
    const { name } = request.only(["name"]);

    const user = await User.findBy("id", id);

    if (user) {
      if (name) {
        user.name = name;
        await user.save();

        return user;
      } else {
        return { error: "Todos os campos devem ser preenchidos!" };
      }
    } else {
      return { error: "Usuário não encontrado!" };
    }
  }

  public async deleteUser({ request, auth }: HttpContextContract) {
    const { email } = request.only(["email"]);

    const hasUser = await User.findBy("email", email);

    if (auth.user) {
      if (Number(auth.user.is_admin) === 1) {
        if (hasUser) {
          await hasUser.delete();
          return { message: "Usuário apagado com sucesso!" };
        } else {
          return { error: "Usuário não encontrado!" };
        }
      } else {
        return { error: "Você não tem permissão para isso!" };
      }
    }
  }

  public async verifyEmail({ auth }: HttpContextContract) {
    if (auth.user) {
      await new VerifyEmail(auth.user).sendLater();
    } else {
      return { error: "Você precisa estar logado para isso!" };
    }
  }

  public async confirmVerify({ auth, response }: HttpContextContract) {
    if (auth.user) {
      const hasUser = await User.findBy("email", auth.user.email);

      if (hasUser) {
        if (Number(hasUser.verified) === 1) {
          response.json({ message: "E-mail já verificado!" });
        } else {
          hasUser.verified = true;
          await hasUser.save();
          response.json({ message: "E-mail verificado com sucesso!" });
        }
      }
    } else {
      return { error: "Você precisa estar logado para isso!" };
    }
  }
}
