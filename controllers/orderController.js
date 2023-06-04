import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

const getAllOrder = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    // const hiddenOrders = Boolean(isHidden);

    // Paginate items using mongoose-paginate-v2
    const options = {
      page: pageNumber || 1,
      limit: limitNumber || 10,
    };

    const items = await Order.paginate({}, options);

    return res.status(200).json({
      items: items.docs,
      totalPages: items.totalPages,
      currentPage: items.page,
      limit: items.limit,
      totalItems: items.totalDocs,
    });
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getOrder = async (req, res, next) => {
  try {
    let { id } = req.params;
    let response = await Order.findOne({ _id: id });
    res.status(200).send({ success: true, response });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true, error });
  }
};

// const addOrder = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.body.user);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const products = await Product.find({
//       _id: { $in: req.body.products },
//     });
//     if (!products || products.length !== req.body.products.length) {
//       return res
//         .status(404)
//         .json({ message: "One or more products not found" });
//     }

//     const order = await Order.create({
//       user: user._id,
//       products: products.map((p) => p._id),
//       total: req.body.total,
//     });

//     return res.status(201).json({ order });
//   } catch (err) {
//     return res.status(400).send(err.message);
//   }
// };

const addOrder = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const products = await Product.find({
      _id: { $in: req.body.products.map((p) => p._id) },
    });
    if (!products || products.length !== req.body.products.length) {
      return res
        .status(404)
        .json({ message: "One or more products not found" });
    }

    const order = await Order.create({
      user: user._id,
      products: req.body.products.map((p) => ({
        _id: p._id,
        quantity: p.quantity,
      })),
      total: req.body.total,
    });

    return res.status(201).json({ order });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const editOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const updates = req.body;
    const options = { new: true };
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          user: updates.user,
          products: updates.products,
          total: updates.total,
        },
      },
      options
    );
    return res.status(200).json({ order: updatedOrder });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

// const editOrderStatus = async (req, res) => {
//   try {
//     let id = req.params.id;
//     const { status } = req.body;
//     const response = await Order.findByIdAndUpdate(
//       { _id: id },
//       {
//         products: req.body.products.map((p) => ({
//           status: p.status,
//         })),
//       },
//       {
//         new: true,
//       }
//     );
//     res.status(200).send({ success: true, response });
//   } catch (err) {
//     return res.status(400).send(err.message);
//   }
// };

const editOrderStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body; // Assuming you receive the status in the request body

    const response = await Order.findByIdAndUpdate(
      { _id: id },
      {
        $set: { "products.$[].status": status }, // Update the status of all products within the order
      },
      { new: true }
    );

    if (!response) {
      return res.status(404).send("Order not found");
    }

    res.status(200).send({ success: true, response });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const deleteOrder = async (req, res, next) => {
  let id = req.params.id;
  try {
    let response = await Order.findByIdAndRemove({ _id: id });
    res.status(200).send({ success: true, response });
  } catch (error) {
    res.status(400).send({ error: true, error });
  }
};

export default {
  getAllOrder,
  getAllOrders,
  getOrder,
  addOrder,
  editOrder,
  deleteOrder,
  editOrderStatus,
};
