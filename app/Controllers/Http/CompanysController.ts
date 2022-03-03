import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Company from "../../Models/Company";
import User from "../../Models/User";

export default class CompanysController {
  public async create({ request, response, auth }: HttpContextContract) {
    const { name, cnpj, logo, address, whatsapp, instagram } = request.only([
      "name",
      "cnpj",
      "logo",
      "address",
      "whatsapp",
      "instagram",
    ]);

    if (name && cnpj && address && whatsapp) {
      if (auth.user) {
        const hasUser = await User.findBy("email", auth.user.email);
        if (hasUser) {
          const newCompany = await Company.create({
            id_user: hasUser.id,
            name,
            cnpj,
            logo,
            address,
            whatsapp,
            instagram,
          });

          return response.status(201).json({
            message: `Empresa ${newCompany.name} criada com sucesso!`,
          });
        } else {
          return { error: "Usuário não encontrado!" };
        }
      } else {
        return { error: "Você precisa estar logado para isso!" };
      }
    } else {
      return { error: "Alguns campos são obrigatórios!" };
    }
  }

  public async getAllByUser({ response, auth }: HttpContextContract) {
    if (auth.user) {
      const hasUser = await User.findBy("email", auth.user.email);
      if (hasUser) {
        const companies = await Company.query().where("id_user", auth.user.id);

        if (companies.length === 0) {
          response.json({
            error: "Não existem empresas cadastradas por este usuário.",
          });
        }

        return companies;
      }
    }
  }

  public async getAll({ response }: HttpContextContract) {
    const hasCompanies = await Company.all();

    let showComp = hasCompanies.filter((companies) => {
      if (Number(companies.published) === 1) {
        return companies;
      }
    });

    if (showComp.length === 0) {
      response.json({
        error: "Não existem empresas publicadas.",
      });
    }
    return showComp;
  }

  public async getAllByAdmin({ auth }: HttpContextContract) {
    if (auth.user) {
      if (
        Number(auth.user.is_admin) === 1 &&
        Number(auth.user.verified) === 1
      ) {
        const hasCompanies = await Company.all();

        if (hasCompanies.length !== 0) {
          return hasCompanies;
        } else {
          return { error: "Não existem empresas publicadas." };
        }
      } else {
        return { error: "Você não tem permissão para isso!" };
      }
    }
  }

  public async update({ request, auth }: HttpContextContract) {
    const { name, cnpj, logo, address, whatsapp, instagram } = request.only([
      "name",
      "cnpj",
      "logo",
      "address",
      "whatsapp",
      "instagram",
    ]);
    const { id } = request.params();

    if (name && cnpj && address && whatsapp) {
      if (auth.user) {
        const hasCompany = await Company.findBy("id", id);

        if (hasCompany) {
          if (auth.user.id === hasCompany.id_user) {
            hasCompany.name = name;
            hasCompany.cnpj = cnpj;
            hasCompany.logo = logo;
            hasCompany.address = address;
            hasCompany.whatsapp = whatsapp;
            hasCompany.instagram = instagram;

            hasCompany.published = false;

            await hasCompany.save();

            return hasCompany;
          } else {
            return { error: "Você não tem permissão para fazer isso!" };
          }
        } else {
          return { error: "Empresa não encontrada!" };
        }
      } else {
        return { error: "Você precisa estar logado!" };
      }
    } else {
      return { error: "Alguns campos são obrigatórios!" };
    }
  }

  public async delete({ request, auth }: HttpContextContract) {
    const { id } = request.params();
    const hasCompany = await Company.findBy("id", id);

    if (auth.user && hasCompany) {
      if (
        Number(auth.user.is_admin) === 1 ||
        hasCompany.id_user === auth.user.id
      ) {
        hasCompany.delete();
        return { message: "Empresa removida com sucesso!" };
      } else {
        return {
          error: "Você precisa ser admin ou proprietário do anúncio para isso!",
        };
      }
    } else {
      return { error: "Você precisa estar logado!" };
    }
  }
}
