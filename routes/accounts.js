import {Router} from "express";
import { USER_BBDD } from "../bbdd.js";

const accountRouter = Router();

accountRouter.use((req, res, next) => {
    console.log(req.ip);

    next();
});

//Obtener los deatlles de una cuenta a partir del guid
accountRouter.get("/:guid", (req, res) => {
  const { guid } = req.params;
  const user = USER_BBDD.find((user) => user.guid === guid);
  if (!user) return res.status(404).send();
  return res.send(user);
});
//Crear una cuenta
accountRouter.post("/", (req, res) => {
  const { guid, name } = req.body;
  if (!guid || !name) return res.status(400).send();
  const user = USER_BBDD.find((user) => user.guid === guid);
  if (user) return res.status(409).send();
  USER_BBDD.push({
    guid,
    name,
  });
  return res.send();
});
//Actualizar una cuenta
accountRouter.patch("/:guid", (req, res) => {
  const { guid } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).send();
  const user = USER_BBDD.find((user) => user.guid === guid);
  if (!user) return res.status(404).send();
  user.name = name;
  return res.send(user);
});
//Eliminar una cuenta
accountRouter.delete("/:guid", (req, res) => {
  const { guid } = req.params;
  const userIndex = USER_BBDD.findIndex((user) => user.guid === guid);
  if (userIndex === -1) return res.status(404).send();
  USER_BBDD.splice(userIndex, 1);
  return res.send();
});

export default accountRouter;
