// Import the Prodcut model so we can query the database
const Product = require("../models/Product");

// @route GET/ products
// @desc  Fetch all products from MongoDB

    const getProducts = async (req, res) => {
  try {
    // Product.find({}) with no filter returns every document in the collection
    const products = await Product.find({});

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};


// @route   GET /products/:id
// @desc    Fetch a single product by its MongoDB _id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // If no product matches that ID, findById returns null —
    // we need to handle that ourselves and send a proper 404
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    // This catches cases like a malformed/invalid ID format
    // (e.g. someone visits /products/abc123 — not a valid MongoDB ID)
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
      error: error.message,
    });
  }
};

module.exports = { getProducts, getProductById };