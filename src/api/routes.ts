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

router.route("/userdata").post(userDataController);

router.route("/userdata/:id/updatecoins").get(updateCoinsController);

// TODO: Añadir rutas usuario
