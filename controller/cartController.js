const mongoose = require ("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @route   GET /cart
// @desc    Get the logged-in user's cart, with product details populated

const getCart = async (req,res) => {
    try{
         // req.user comes from the "protect" middleware — it already
         // figured out who's making this request before we got here
         const cartItems = await Cart.find({user: req.user._id}).populate(
            "product",
            "name price description stock imageUrl"
             // ^ this tells mongoose: "instead of just the product's _id,
            // fetch the full product document, but only these fields"
         );

         res.status(200).json({
            success: true,
            count: cartItems.length,
            data: cartItems,
         });
    } catch (error){
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
            error: error.message,
        });
    }
};


// @route   POST /cart
// @desc    Add a product to the logged-in user's cart.
//          If it's already there, increase the quantity instead
//          of creating a duplicate row.

const addToCart = async (req,res) => {
    try{
        const{productId , quantity = 1} = req.body;
        // Validate the ID format before even hitting the database
        if(!mongoose.Types.ObjectId.isValid(productId)){
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format",
            });
        } 

        // This is the "check if product ID exists before adding to cart"
        // validation your brief specifically asks for  
        const product = await Product.findById(productId);
        if(!product){
            return res.status(400).json({
                success: false,
                message: "Product not found, cannot add to cart",
            });
        } 

        if(product.stock<quantity){
            return res.status(400).json({
                success: false,
                message: `Insufficient stock for "${product.name}" . Available:${product.stock}`,
            });
        }   
        // Check if this exact user already has this exact product in their cart
        let cartItem = await Cart.findOne({user: req.user._id, product: productId});
        if(cartItem){
            // Already in cart - just bump the quantity
            cartItem.quantity += Number(quantity);
            await cartItem.save();  
        } else{
            // Not in cart yet - create a new cart entry
            cartItem = await Cart.create({
                user: req.user._id,
                product: productId,
                quantity,
            });
        }
        // Populate product details before sending the response back 
        cartItem = await cartItem.populate("product", "name price description stock imageUrl");

        res.status(201).json({
            success: true,
            message:"Product added to cart",
            data: cartItem,
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to add product to cart",
            error: error.message,
        });
    }
};

// @route   PUT /cart/:id
// @desc    Update the quantity of a specific cart item.
//          :id here refers to the Cart document's own _id.

const updateCartItem = async (req,res) =>{
    try{
        const {id} = req.params;
        const {quantity} = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid cart item ID format",
            });
        }
    
    
    // Important: we filter by BOTH the cart item's _id AND req.user._id —
    // this makes sure a user can only update THEIR OWN cart items,
    // not someone else's, even if they guess a valid cart item ID    
    const cartItem = await Cart.findOne({_id:id, user:req.user._id});
    if(!cartItem){
        return res.status(404).json({
            success: false,
            message: "Cart item not found",
        });
    }  
     const product = await Product.findById(cartItem.product);
    if (product && quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
      });
    }
    cartItem.quantity = quantity;
    await cartItem.save();  

    const updated = await cartItem.populate("product", "name price description stock imageUrl");
    res.status(200).json({
        success:true,
        message:"Cart item updated",
        data:updated,
    });
 } catch(error){
    res.status(500).json({
        success: false,
        message:"Failed to update cart item",
        error: error.message,
    });
 }
};

// @route  DELETE /cart/:id
// @desc   Remove  a specified item from the cart.
const removeFromCart = async (req,res) => {
    try{
        const{id} = req.params;                                                             

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message:"Invalid cart item ID format",
            });
        }
        // Again - scoped to req.user._id, so users can only delete their own items 
        const cartItem  = await Cart.findOneAndDelete({_id:id, user: req.user._id});
        if(!cartItem){
            return res.status(404).json({
                success: false,
                message: "Cart item not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            data: cartItem,
        });
    } catch (error){
        res.status(500).json({
            success: false,
            message: "Failed to remove cart item",
            error: error.message,
        });
    }
};

module.exports = {getCart, addToCart,updateCartItem, removeFromCart};

