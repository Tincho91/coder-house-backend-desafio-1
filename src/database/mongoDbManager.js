import mongoose from "mongoose";

export class mongoDbManager {
  #url;
  #connection;
  constructor(url, collection, schema) {
    this.#url = url;
    this.collection = collection;
    this.schema = schema;
    this.model = mongoose.model(this.collection, this.schema);
  }

  async #connect() {
    if (!this.#connection) {
      try {
        this.#connection = await mongoose.createConnection(this.#url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("Conectado a MongoDB");
      } catch (error) {
        console.log("Error en la conexion con MongoDB", error);
      }
    }
    return this.#connection;
  }

  async getElements(query = {}, options = {}) {
    try {
      await this.#connect();
      const elements = await this.model.find(query, null, options);
      return elements;
    } catch (error) {
      console.log("Error en la consulta de elementos con MongoDB", error);
    }
  }

  async getElementById(id) {
    try {
      await this.#connect();
      const element = await this.model.findById(id);
      return element;
    } catch (error) {
      console.log("Error en la consulta de elemento con MongoDB", error);
    }
  }

  async countElements(query) {
    try {
      await this.#connect();
      const count = await this.model.countDocuments(query);
      return count;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while counting elements");
    }
  }

  async addElements(elements) {
    //Agrega uno o varios elementos
    try {
      await this.#connect();
      const message = await this.model.insertMany(elements);
      return message;
    } catch (error) {
      console.log("Error al agregar elemento/s con MongoDB", error);
    }
  }

  async updateElement(id, info) {
    try {
      await this.#connect();
      const message = await this.model.findByIdAndUpdate(id, info);
      return message;
    } catch (error) {
      console.log("Error en la actualizacion de elemento con MongoDB", error);
    }
  }

  async removeElement(id) {
    try {
      await this.#connect();
      const response = await this.model.findByIdAndRemove(id);
      return response;
    } catch (error) {
      console.log("Error al borrar elemento con MongoDB", error);
    }
  }
}