/**
 * @file Configuración de las rutas HTTP orfecidas por el servidor
 * @author Dorian Wozniak <817570@unizar.es>
 */

import { Router } from "express";

import { loginController, registerController } from "../auth";

export const router = Router();

router.route("/login").post(loginController);

router.route("/register").post(registerController);

// TODO: Añadir rutas usuario
