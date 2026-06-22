const express = require("express");
const router = express.Router();
const {getProducts, getProductById} = require("../controller/productController");


// GET / products - list all products
router.get("/", getProducts);

// GET /products/:id - get one product by ID
router.get("/:id", getProductById)

module.exports = router;
