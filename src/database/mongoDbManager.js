import mongoose from "mongoose";

export class mongoDbManager {
  #url;
  constructor(url, collection, schema) {
    this.#url = url;
    this.collection = collection;
    this.schema = schema;
    this.model = mongoose.model(this.collection, this.schema);

    // Establecer conexión al crear una instancia de mongoDbManager
    this.#setConection();
  }

  async #setConection() {
    try {
      await mongoose.connect(this.#url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Conectado a MongoDB");
    } catch (error) {
      console.log("Error en la conexion con MongoDB", error);
    }
  }

  async getElements(query = {}, options = {}) {
    // Elimina la llamada a this.#setConection();
    try {
      const elements = await this.model.find(query, null, options);
      return elements;
    } catch (error) {
      console.log("Error en la consulta de elementos con MongoDB", error);
    }
  }

  // Elimina las llamadas a this.#setConection() en los demás métodos
  async getElementById(id) {
    try {
      const element = await this.model.findById(id);
      return element;
    } catch (error) {
      console.log("Error en la consulta de elemento con MongoDB", error);
    }
  }

  async countElements(query) {
    try {
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
      const message = await this.model.insertMany(elements);
      return message;
    } catch (error) {
      console.log("Error al agregar elemento/s con MongoDB", error);
    }
  }

  async updateElement(id, info) {
    try {
      const message = await this.model.findByIdAndUpdate(id, info);
      return message;
    } catch (error) {
      console.log("Error en la actualizacion de elemento con MongoDB", error);
    }
  }

  async removeElement(id) {
    try {
      const response = await this.model.findByIdAndRemove(id);
      return response;
    } catch (error) {
      console.log("Error al borrar elemento con MongoDB", error);
    }
  }
}