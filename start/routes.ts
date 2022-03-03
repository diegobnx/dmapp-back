import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.group(() => {
    Route.post("/register", "UsersController.register");
    Route.delete("/deluser", "UsersController.deleteUser").middleware("auth");
    Route.get("/listallusers", "UsersController.listAll").middleware("auth");
    Route.put(
      "/updateusername/:id",
      "UsersController.updateNameUser"
    ).middleware("auth");
    Route.get("/verifyemail", "UsersController.verifyEmail").middleware("auth");
    Route.get("/confirmverify", "UsersController.confirmVerify").middleware(
      "auth"
    );
  }).prefix("/user/");

  Route.group(() => {
    Route.post("/login", "AuthController.login");
    Route.post("/logout", "AuthController.logout").middleware("auth");
  }).prefix("/auth/");

  Route.group(() => {
    Route.post("/create", "CompanysController.create").middleware("auth");
    Route.get("/getallbyuser", "CompanysController.getAllByUser").middleware("auth");
    Route.get("/getallbyadmin", "CompanysController.getAllByAdmin").middleware("auth");
    Route.get("/getall", "CompanysController.getAll");
    Route.put("/update/:id", "CompanysController.update").middleware("auth");
    Route.delete("/delete/:id", "CompanysController.delete").middleware("auth");
  }).prefix("/company/");
}).prefix("/api");
