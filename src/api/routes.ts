import { loginController, registerController } from "../controller"
import Router from "express"

const router = Router()

router.route("/login").post(loginController)

router.route("/register").post(registerController)

export { router }
