import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Restaurant from "../models/restaurantModel.js";

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

const addOrder = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const restaurants = await Restaurant.find({
      _id: { $in: req.body.restaurants },
    });
    if (!restaurants || restaurants.length !== req.body.restaurants.length) {
      return res
        .status(404)
        .json({ message: "One or more restaurants not found" });
    }

    const order = await Order.create({
      user: user._id,
      restaurants: restaurants.map((p) => p._id),
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
          restaurants: updates.restaurants,
        },
      },
      options
    );
    return res.status(200).json({ order: updatedOrder });
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
  getOrder,
  addOrder,
  editOrder,
  deleteOrder,
};
