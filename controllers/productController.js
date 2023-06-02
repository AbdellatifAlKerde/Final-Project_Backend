import Product from "../models/productModel.js";
import Restaurant from "../models/restaurantModel.js";
import Category from "../models/categoryModel.js";
import fs from "fs";

const getAllProducts = async (req, res, next) => {
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

    const items = await Product.paginate({}, options);

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

const getProduct = async (req, res, next) => {
  try {
    let { id } = req.params;
    let response = await Product.findOne({ _id: id });
    res.status(200).send({ success: true, response });
  } catch (error) {
    res.status(400).send({ error: true, error });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { page, limit } = req.query;

    // Set default values for page and limit if not provided
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    const options = {
      page: pageNumber,
      limit: pageSize,
    };

    const { docs, totalDocs, totalPages } = await Product.paginate(
      { category: categoryId },
      options
    );

    res.json({
      items: docs,
      totalItems: totalDocs,
      totalPages: totalPages,
      currentPage: pageNumber,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// const getProductByCategory = async (req, res) => {
//   try {
//     const category = req.params.category;
//     const products = await Product.find({ category: category });
//     res.json({ items: products });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const addProduct = async (req, res, next) => {
  const { name, description, price, image } = req.body;
  try {
    const restaurant = await Restaurant.findById(req.body.restaurant_id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const category = await Category.findById(req.body.category);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const product = await Product.create({
      restaurant_id: restaurant._id,
      name: name,
      description: description,
      price: price,
      image: image,
      category: category._id,
    });

    return res.status(201).json({ product });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const editProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const oldProduct = await Product.findById(productId);
    // !req.body.image ? null : fs.unlinkSync(oldProduct.image);
    // !req.body.image
    //   ? null
    //   : oldProduct.image
    //   ? fs.unlinkSync(oldProduct.image)
    //   : null;
    const updates = req.body;
    const options = { new: true };
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          restaurant_id: updates.restaurant_id,
          name: updates.name,
          description: updates.description,
          price: updates.price,
          image: updates.image,
          category: updates.category,
        },
      },
      options
    );
    return res.status(200).json({ product: updatedProduct });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const oldProduct = await Product.findById(id);
    if (!oldProduct) {
      return res.status(409).send({ message: "Product does not exists" });
    }

    let response = await Product.findByIdAndRemove({ _id: id });
    res.status(200).send({ success: true, response });
  } catch (error) {
    res.status(400).send({ error: true, error });
  }
};

export default {
  getAllProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
  getProductByCategory,
};
