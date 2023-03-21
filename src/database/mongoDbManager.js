import mongoose from "mongoose";

export class mongoDbManager {
    #url
    constructor(url, colection, schema) {
        this.#url = url //deberia ser privado
        this.colection = colection
        this.schema = schema
        this.model = mongoose.model(this.colection, this.schema)
    }

    async #setConection() {
        try {
            await mongoose.connect(this.#url)
            console.log('Conectado a MongoDB');
        }
        catch(error) {
            console.log('Error en la conexion con MongoDB', error);
        }
    };

    async getElements() {
        this.#setConection()
        try {
            const elements = await this.model.find()
            return elements;
        }
        catch(error) {
            console.log('Error en la consulta de elementos con MongoDB', error);
        }
    };

    async getElementById(id) {
        this.#setConection()
        try {
            const element = await this.model.findById(id)
            return element;
        }
        catch(error) {
            console.log('Error en la consulta de elemento con MongoDB', error);
        }
    }

    async addElements(elements) { //Agrega uno o varios elementos
        this.#setConection()
        try {
            const message = await this.model.insertMany(elements)
            return message;
        }
        catch(error) {
            console.log('Error al agregar elemento/s con MongoDB', error);
        }
    }

    async updateElement(id, info) {
        this.#setConection()
        try {
            const message = await this.model.findByIdAndUpdate(id, info)
            return message;
        }
        catch(error) {
            console.log('Error en la actualizacion de elemento con MongoDB', error);
        }
    }

    async removeElement(id) {
        this.#setConection()
        try {
            const response = await this.model.findByIdAndRemove(id, info)
            return response;
        }
        catch(error) {
            console.log('Error al borrar elemento con MongoDB', error);
        }
    }
};