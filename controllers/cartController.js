import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

export const getCartItems = async (req, res, next) => {
  try {
    let { user } = req.params;
    let cartItems = await Cart.findOne({ user });
    if (!cartItems) {
      return res.status(404).json({ message: "Cart is Empty" });
    }
    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Add item to the cart
// const addToCart = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.body.user);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const products = await Product.find({ _id: { $in: req.body.products } });
//     console.log(products.length);
//     if (!products) {
//       return res
//         .status(404)
//         .json({ message: "One or more products not found" });
//     }
//     const productsPrice = products.map((p) => p.price);
//     const totalPrice = productsPrice.reduce((acc, price) => acc + price, 0);

//     console.log(productsPrice);

//     const cart = await Cart.create({
//       user: user._id,
//       products: products.map((p) => p._id),
//       total: totalPrice,
//     });

//     return res.status(201).json({ order });
//   } catch (err) {
//     return res.status(400).send(err.message);
//   }
// };

export const addToCart = async (req, res) => {
  try {
    const { userId, items } = req.body; // Destructure userId and items from the request body

    // Iterate over the items array to access each productId
    const productIds = items.map((item) => item.productId);

    // Find the products by IDs
    const products = await Product.find({ _id: { $in: productIds } });
    console.log(products.length);

    // Check if all products were found
    if (products.length !== productIds.length) {
      return res.status(404).json({ error: "One or more products not found" });
    }

    // Create an array to hold the new items for the cart
    const newItems = items.map((item, index) => {
      const product = products.find(
        (product) => product._id.toString() === item.productId
      );
      return {
        product: product._id,
        price: product.price,
      };
    });

    // Check if the cart exists for the current user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // If cart doesn't exist, create a new cart
      cart = new Cart({
        user: userId,
        items: newItems,
      });
    } else {
      // If cart exists, add the new items
      cart.items.push(...newItems);
    }

    // Calculate the total price
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);

    // Save the updated cart
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const controller = {
  getCartItems,
  addToCart,
};

export default controller;
