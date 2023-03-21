import { mongoDbManager } from "../../../database/mongoDbManager.js";
import { Schema } from "mongoose";


export const productSchema = new Schema ({
    title: {
      type: String,
      unique: true,
      require: true, 
      max:50
    },
    price: 
    {
      type: Number, 
      default: 0
    },
    stock: 
    {
      type: Number, 
      default: 0
    },
    description: {
      type: String,
      require: true,
    },
    code: {
      type: String,
      unique: true,
      require: true,
    },
    status:
    {
      type: Boolean, 
      default: true
    }
})

export class ProductManagerMongoDB extends mongoDbManager {
    constructor() {
        super(process.env.MONGODBURL, "products", productSchema)
        //Atributos propios
    }
    //Metodos Propios
}