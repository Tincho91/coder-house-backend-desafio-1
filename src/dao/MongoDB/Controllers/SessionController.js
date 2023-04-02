import { UserManagerMongoDB } from "../Models/User.js";
import { ProductManagerMongoDB } from "./ProductManager.js";

const userManager = new UserManagerMongoDB();
const productManager = new ProductManagerMongoDB();

export const signIn = (req, res) => {
  res.render('signIn-Up', { action: 'signin' });
};

export const signUp = (req, res) => {
  res.render('signIn-Up', { action: 'signup' });
};

export const getSession = (req, res, next) => {
  if (req.session.login) {
    res.redirect(302, "/home");
  } else {
    const action = req.query.action;
    res.render("signIn-Up", {
      action: action,
    });
  }
};

export const testLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userManager.model.findOne({ email });

  if (user && password === user.password) {
    req.session.login = true;
    req.session.user = user;
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.role = "admin";
    } else {
      req.session.role = "user";
    }
    res.redirect(302, "/api/session/home");
  } else {
    res.render("signIn-Up", {
      errorMessage: "Correo electrónico o contraseña incorrecta.",
    });
  }
};

export const destroySession = (req, res, next) => {
  if (req.session.login) {
    req.session.destroy(() => {
      res.redirect("/api/session/home");
    });
  }
};

export async function home(req, res) {
  try {
    const { limit, page, sort, category, availability, query } = req.query;
    const queryObject = { category, availability };

    if (query) {
      queryObject.category = new RegExp(query, "i");
    }

    const { products, totalDocuments } = await productManager.getProducts(
      limit,
      page,
      sort,
      queryObject
    );

    const totalPages = Math.ceil(
      totalDocuments / (limit ? parseInt(limit) : 10)
    );
    const currentPage = page ? parseInt(page) : 1;
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    const nextPage = hasNextPage ? currentPage + 1 : null;
    const prevPage = hasPrevPage ? currentPage - 1 : null;
    const prevLink = hasPrevPage
      ? `/home?limit=${limit}&page=${prevPage}`
      : null;
    const nextLink = hasNextPage
      ? `/home?limit=${limit}&page=${nextPage}`
      : null;

    res.render("home", {
      user: req.session.user,
      products,
      totalPages,
      prevPage,
      nextPage,
      currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
    console.log(req.session.user)
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while getting the products" });
  }
}

export const register = async (req, res, next) => {
  const { firstName, lastName, email, age, password } = req.body;
  const user = await userManager.model.findOne({ email });

  if (user) {
    res.redirect(302, "/api/session/home");
  } else {
    const newUser = await userManager.model.create({
      firstName,
      lastName,
      email,
      age,
      password,
      role: "user",
    });
    req.session.login = true;
    req.session.user = newUser;
    req.session.role = "user";
    // Call the home function directly
    home(req, res);
  }
};