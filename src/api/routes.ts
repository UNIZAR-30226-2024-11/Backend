/**
 * @file Configuración de las rutas HTTP orfecidas por el servidor
 * @author Dorian Wozniak <817570@unizar.es>
 */

import { Router } from "express";

import { loginController, registerController} from "../auth";
import { userDataController } from "../auth/userdata";
import { updateCoinsController } from "../auth/updatecoins";
import { searchPersonController } from "../auth/searchperson";
import { sendFriendRequestController } from "../auth/sendfriendrequest";

export const router = Router();

router.route("/login").post(loginController);

router.route("/register").post(registerController);

router.route("/userdata/:id").get(userDataController);

router.route("/userdata/:id/updatecoins").get(updateCoinsController);

router.route("/friends/search/:email").get(searchPersonController);

router.route("/friends/request").post(sendFriendRequestController);

// TODO: Añadir rutas usuario
