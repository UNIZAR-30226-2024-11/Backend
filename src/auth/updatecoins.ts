import { Request, Response } from "express";
import { updateUserCoins} from "../model";
interface UpdateCoinsRequest extends Request {
    params: {
        id: string; // Los parámetros de la URL son cadenas por defecto
    };
    body: {
        coins: number; // El número de monedas a actualizar
    };
}
type UpdateCoinsResponse = Response<{ error: string } | any>;

export const updateCoinsController = async (
  req: UpdateCoinsRequest,
  res: UpdateCoinsResponse,
) => {
  const userId = parseInt(req.params.id, 10); // Convierte el ID a un número
  const { coins } = req.body; // Obtiene el número de monedas del cuerpo de la solicitud

  if (isNaN(userId) || isNaN(coins)) {
    res.status(400).json({ error: "ID de usuario o número de monedas no válido" });
    return;
  }

  try {
    const updatedUser = await updateUserCoins(userId, coins);
    if (!updatedUser) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(updatedUser); // Devuelve el objeto de usuario actualizado
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
};
