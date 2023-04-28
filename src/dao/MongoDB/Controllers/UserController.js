import { getUsersManager } from "../../daoManager.js";
import { getCartsManager } from "../../daoManager.js";

const data = await getUsersManager();
export const userManager = new data.UserManagerMongoDB();
let cartManager;

const initializeCartManager = async () => {
  const CartManagerClass = (await getCartsManager()).CartManagerMongoDB;
  cartManager = new CartManagerClass();
};

initializeCartManager();

export const addUser = async (req, res) => {
    try {
      // Crear un carrito vacío y asignarlo al nuevo usuario
      const newCart = await cartManager.createEmptyCart(req.body.email);
      const newUser = await userManager.addElements([{ ...req.body, cartId: newCart._id }]);
  
      res.status(201).send({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "An error occurred while creating the user" });
    }
};

export const createUser = async (req, res) => {
    res.send({status: "succes", message: "User Created"})
};

export const getUserById = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userManager.getElementById(id)
        if (user) {
            return res.status(200).json({
                message: user
            })
        }
        return res.status(404).json({
            message: "User not found"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const getUserByEmail = async (email) => {
    try {
        const user = await userManager.getElementByEmail(email)
        if (user) {
            return user
        }
        return "Usuario no encontrado"

    } catch (error) {
        return error
    }
}