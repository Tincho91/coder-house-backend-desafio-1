import { mongoDbManager } from "../../../database/mongoDbManager.js";
import { Schema } from "mongoose";


const schema = new Schema ({
    name: {type: String, require: true, max:50},
    userEmal: {type: String, require: true, max:50},
    message: {type: String, require: true, max:200}
})

export class MessageManagerMongoDB extends mongoDbManager {
    constructor() {
        super(process.env.MONGODBURL, 'messages', schema)
        //Atributos propios
    }
    //Metodos Propios
}