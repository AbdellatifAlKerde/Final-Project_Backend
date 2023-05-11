import Facture from "../models/factureModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

const getAllFactures = async (req, res, next) => {
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

    const items = await Facture.paginate({}, options);

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

const getFacture = async (req, res, next) => {
  try {
    let { id } = req.params;
    let response = await Facture.findOne({ _id: id });
    res.status(200).send({ success: true, response });
  } catch (error) {
    res.status(400).send({ error: true, error });
  }
};

const addFacture = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = await Order.findById(req.body.order);
    if (!order) {
      return res.status(404).json({ message: "One or more orders not found" });
    }

    const facture = await Facture.create({
      user: user._id,
      order: order._id,
      total: req.body.total,
    });

    return res.status(201).json({ facture });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const editFacture = async (req, res, next) => {
  try {
    const factureId = req.params.id;
    const updates = req.body;
    const options = { new: true };
    const updatedFacture = await Facture.findByIdAndUpdate(
      factureId,
      {
        $set: {
          user: updates.user,
          order: updates.order,
        },
      },
      options
    );
    return res.status(200).json({ order: updatedFacture });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const deleteFacture = async (req, res, next) => {
  let id = req.params.id;
  try {
    let response = await Facture.findByIdAndRemove({ _id: id });
    res.status(200).send({ success: true, response });
  } catch (error) {
    res.status(400).send({ error: true, error });
  }
};

export default {
  getAllFactures,
  getFacture,
  addFacture,
  editFacture,
  deleteFacture,
};
