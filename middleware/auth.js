const jwt = require("jsonwebtoken");
const User = require("../models/User");


// This middleware runs BEFORE any protected route's controller.
// Its job: check if a valid JWT was sent, and if so, figure out
// which user it belongs to and attach that user to req.user —
// so the actual route logic (e.g. addToCart) knows who's asking.

const protect = async (req,res,next) => {
  try{
    let token;
    // Tokens are sent in the Authorization header like:
    // Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1]; // grabs just the token part, after"Bearer"
    }
    console.log("2. Token extracted:", token);

    if(!token) {
        return  res.status(401).json({
            success: false,
            message: "Not authorized, no token provided",
        });
    }

    // Verify the token is valid AND was signed with our JWT_SECRET
    // (this also automatically checks it hasn't expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded.id is the user ID we embedded back in generateToken()
    const user = await User.findById(decoded.id).select("-password");

    if(!user){
        return res.status(401).json({
            success: false,
            message: "Not Authorized , user not found",
        });
    }

    // Attach the user to the request object so later code can use req.user
    req.user = user;
    // This IS a regular (non-async-quirky) middleware function,
    // so next() works completely normally here — calling it
    // passes control to whatever comes next (the actual route handler)
    next();
  } catch(error){
    return res.status(401).json({
        success: false,
        message:"Not authorized, invalid token",
    });
  }
};
module.exports = {protect};
