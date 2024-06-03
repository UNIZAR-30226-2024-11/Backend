/**
 * @file Configuración de las rutas HTTP orfecidas por el servidor
 * @author Dorian Wozniak <817570@unizar.es>
 */

import { Router } from "express";

import { loginController, registerController} from "../auth";
import { userDataController } from "../auth/userdata";
import { updateCoinsController } from "../auth/updatecoins";

export const router = Router();

router.route("/login").post(loginController);

router.route("/register").post(registerController);

router.route("/userdata/:id").get(userDataController);

router.route("/userdata/:id/updatecoins").put(updateCoinsController);

// TODO: Añadir rutas usuario
