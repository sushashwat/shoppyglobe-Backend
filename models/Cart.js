const mongoose = require("mongoose");
const Product = require("./Product");
// Each document here represents ONE product inside ONE user's cart.
// e.g. if a user adds 3 different products, they'll have 3 separate
// Cart documents, all linked to the same user.

const cartSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,   // a reference to a User document 
            ref: "User", // tells mongoose which model this ID points to 
            required: true,
        },
        product:{
            type: mongoose.Schema.Types.ObjectId, // a reference to a product document 
            ref: "Product",
            required: true,
        },
        quantity:{
            type: Number,
            required: true,
            min: [1, "Quantity must be atleast 1"],
            default: 1,
        },
    },
    {
        timestamps:true,
    }
);

// This creates a rule at the database level: the combination of(user, product) must be unique — so the same user can't have
// the same product added as two separate cart rows. If they add it again, we'll just increase the quantity instead (we'll handle
// that logic in the controller).

cartSchema.index({user:1, product:1,}, {unique: true});
module.exports = mongoose.model("Cart", cartSchema);
