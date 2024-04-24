// Controlador de items
import { db } from "../config";
import { Item } from "../shop"; // Importa la interfaz Item definida anteriormente

const CREATE_ITEM_QUERY = `
  INSERT INTO items (name, price)
  VALUES ($1, $2)
`

export const createItem = async (name: string, price: number) => {
    return await db.query<Item>(CREATE_ITEM_QUERY, [name, price]);
}