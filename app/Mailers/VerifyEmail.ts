import { BaseMailer, MessageContract } from "@ioc:Adonis/Addons/Mail";

export default class VerifyEmail extends BaseMailer {
  constructor(private user) {
    super();
  }

  public prepare(message: MessageContract) {
    message
      .subject("Verifique seu e-mail")
      .from("contato@dmnetwork.com.br", "Contato DM Network")
      .to(this.user.email)
      .html(`
        <p>Bem vindo, <strong>${this.user.name}</strong></p>
        <p>Acesse o link para verificar sua identidade!</p><a href="http://localhost:3333/api/user/confirmverify">Verificar E-Mail</a>
      `);
  }
}
