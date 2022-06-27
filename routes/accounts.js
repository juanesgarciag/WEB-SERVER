import {Router} from "express";
import userModel from "../schemas/user-schemas.js";

const accountRouter = Router();

accountRouter.use((req, res, next) => {
    console.log(req.ip);

    next();
});

//Obtener los deatlles de una cuenta a partir del guid
accountRouter.get("/:guid", async (req, res) => {
  const { guid } = req.params;
  const user = await userModel.findById(guid).exec();
  if (!user) return res.status(404).send('Usuario ingresado no existe');
  return res.send(user);
});
//Crear una cuenta
accountRouter.post("/", async (req, res) => {
  const { guid, name } = req.body;
  if (!guid || !name) return res.status(400).send();
  const user = await userModel.findById(guid).exec();
  if (user) return res.status(409).send('El usuario ya se encuentra registrado');

  const newUser = new userModel({_id:guid, name});
  newUser.save();
  
  return res.send();
});
//Actualizar una cuenta
accountRouter.patch("/:guid", async (req, res) => {
  const { guid } = req.params;
  const { name } = req.body;

  if (!name) return res.status(400).send();

  const user = await userModel.findById(guid).exec();
  if (!user) return res.status(404).send();
  user.name = name;
  await user.save();

  return res.send(user);
});
//Eliminar una cuenta
accountRouter.delete("/:guid", async (req, res) => {
  const { guid } = req.params;
  const user = await userModel.findById(guid).exec();
  if (user) return res.status(404).send();
  await user.remove();
  return res.send();
});

export default accountRouter;
