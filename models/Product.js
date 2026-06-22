// Import mongoose so that we can define a schema 

const mongoose  = require ("mongoose");

// A schema is mongoose's way of defining the "shape" of a document in a collection - what field it has, their types, and rules for each.

const productSchema = new mongoose.Schema(
    {
      name:{
        type: String,
        required: [true, "Product name is required"],
        trim: true, // removes accidental leading/trailing spaces
      },
      price:{
        type: Number,
        required: [true,"Product price is required"],
        min: [0, "Price cannot be negative"],
      },
      description:{
        type: String,
        required: [true, "Product description is required"],
      },
      stock:{
        type: Number,
        required: [true, "Stock quantity is required"],
        min:[0, "Stock cannot be negative"],
        default: 0,
      },
      category:{
        type:String,
        default: "general",
      },
      imageUrl:{
        type: String,
        default: "",
      },
},
{
    // Automatically adds createAt and updateAt fields to every document 
    timestamps: true,
}
);

// mongoose.model() takes our schema and turns it into a usable model.
// "Product" here also tells MongoDB to create/use a collection
// named "products" (mongoose automatically lowercases + pluralizes it).
module.exports = mongoose.model("Product", productSchema);