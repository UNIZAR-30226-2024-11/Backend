import { loginController } from "controller"
import { Request, Response } from "express"
import { User } from "model"

describe("loginController", () => {
  it("Datos de login correctos", async () => {
    const req = {
      body: {
        email: "john.doe@unizar.es",
        password: "my-secret-password",
      },
    } as Request

    const res = {} as Response

    const user = {
      id: 1,
      email: "john.doe@unizar.es",
      username: "john.doe",
      password: "my-secret-password",
    } as User

    // Mock findUserByEmail so that it alawys returns user
    const findUserByEmail = jest.fn().mockResolvedValue(user)

    await loginController(req, res)

    expect(loginController).toHaveBeenCalled()
    expect(findUserByEmail).toHaveBeenCalledWith("john.doe@unizar.es")
    expect(res.status).toBe(200)
    expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) })
  })

  it("Usuario no encontrado", async () => {})

  it("Contraseña incorrecta", async () => {})
})
