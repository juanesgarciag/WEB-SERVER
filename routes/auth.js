import { Router } from "express";
import authByEmailPwd from "../helpers/auth-by-email-pwd.js";

const authRouter = Router();

//Endpoint public (No autenticado y no autorizado)
authRouter.get("/publico", (req, res) => res.send("Endpoint público"));

//Endpoint autenticado
authRouter.post("/autenticado", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.sendStatus(400);

  try {
    const user = authByEmailPwd(email, password);

    return res.send(`Usuario ${user.name} esta autenticado`);
  } catch (err) {
    return res.send(401);
  }
});

//Endpoint autorizado a administradores
authRouter.post("/autorizado", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.sendStatus(400);

  try {
    const user = authByEmailPwd(email, password);

    if (user.role !== "admin") return res.sendStatus(403);

    return res.send(`Usuario administrdor ${user.name}`);
  } catch (err) {
    return res.sendStatus(401);
  }
});

export default authRouter;
