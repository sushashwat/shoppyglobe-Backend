// Load environment variables (so we can use MONGO_URI)
require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");

// Sample product data matching our schema
const sampleProducts = [
  {
    name: "Wireless Mouse",
    price: 799,
    description: "Ergonomic wireless mouse with USB receiver",
    stock: 50,
    category: "electronics",
    imageUrl: "https://placehold.co/300x300?text=Mouse",
  },
  {
    name: "Mechanical Keyboard",
    price: 2499,
    description: "RGB backlit mechanical keyboard with blue switches",
    stock: 30,
    category: "electronics",
    imageUrl: "https://placehold.co/300x300?text=Keyboard",
  },
  {
    name: "Cotton T-Shirt",
    price: 499,
    description: "Comfortable 100% cotton round-neck t-shirt",
    stock: 100,
    category: "clothing",
    imageUrl: "https://placehold.co/300x300?text=T-Shirt",
  },
  {
    name: "Running Shoes",
    price: 2999,
    description: "Lightweight running shoes with breathable mesh",
    stock: 40,
    category: "footwear",
    imageUrl: "https://placehold.co/300x300?text=Shoes",
  },
  {
    name: "Stainless Steel Water Bottle",
    price: 599,
    description: "1-litre insulated water bottle, keeps drinks cold for 24 hours",
    stock: 75,
    category: "home",
    imageUrl: "https://placehold.co/300x300?text=Bottle",
  },
  {
    name: "Yoga Mat",
    price: 899,
    description: "Non-slip 6mm thick yoga mat with carry strap",
    stock: 60,
    category: "fitness",
    imageUrl: "https://placehold.co/300x300?text=Yoga+Mat",
  },
];

// This function does the actual seeding work
const seedDatabase = async () => {
  try {
    // Connect directly to MongoDB (separate from server.js's connection,
    // since this script runs on its own, not as part of the running server)
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Remove any existing products first, so we don't get duplicates
    // every time we run this script
    await Product.deleteMany({});
    console.log("Existing products cleared");

    // Insert our sample products
    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} products inserted successfully`);

    // Close the connection and exit the script cleanly
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();