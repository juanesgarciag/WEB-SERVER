import { Router } from "express";
import { SignJWT, jwtVerify } from "jose";
import { USER_BBDD } from "../bbdd.js";
import authByEmailPwd from "../helpers/auth-by-email-pwd.js";

const authTokenRouter = Router();

authTokenRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.sendStatus(400);

  try {
    const { guid } = authByEmailPwd(email, password);

    //Generar token y devolverlo
    const jwtConstructor = new SignJWT({ guid });
    const encoder = new TextEncoder();
    const jwt = await jwtConstructor
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(encoder.encode(process.env.JWT_PRIVATE_KEY));

    return res.send(jwt);
  } catch (err) {
    return res.sendStatus(401);
  }
});

//Solicitud autenticada con token para obetner el perfil de usuario
authTokenRouter.get("/profile", async (req, res) => {
    const { authorization } = req.headers;

    if(!authorization) return res.sendStatus(401);

    try{
        const encoder = new TextEncoder();
        const { payload } = await jwtVerify(authorization, encoder.encode(process.env.JWT_PRIVATE_KEY));

        const user = USER_BBDD.find((user) => user.guid === payload.guid);

        if (!user) return res.sendStatus(401);
      
        delete user.password;
      
        return res.send(user);

    }catch(err){

    }

  //Obtener token de cabecera y comprobar su atuenticidad y caducidad

 
});

export default authTokenRouter;
