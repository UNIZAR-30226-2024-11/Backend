import { mainPageController, testController } from "../controller"
import express from "express"

const router = express.Router()

router.route("/").get(mainPageController)

router.route("/test").get(testController)

export default router
