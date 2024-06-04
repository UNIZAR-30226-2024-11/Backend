import { Request, Response } from "express";
import { findUserDataById, addUserFriend, User } from "../model";

type AddFriendRequest = Request<{}, {}, { userId: string; friendId: string }>;
type AddFriendResponse = Response<{ message: string }>;

export const addFriend = async (
    req: AddFriendRequest,
    res: AddFriendResponse,
) => {
    try {
        const { userId, friendId } = req.body;

        // Comprobar que existen los usuarios
        const user = await findUserDataById(userId);
        const friend = await findUserDataById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: 'Usuario o amigo no encontrados' });
        }

        await addUserFriend(userId, friendId);

        res.status(200).json({ message: 'Friend added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};