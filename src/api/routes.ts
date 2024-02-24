import { mainPageController, testController } from "../controller"
import { Router } from "express"

const router = Router()

router.route("/").get(mainPageController)

router.route("/test").get(testController)

export default router
