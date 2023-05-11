import Restaurant from "../models/restaurantModel.js";
import fs from "fs";

export async function getAll(req, res, next) {
  try {
    const { page, limit } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Paginate items using mongoose-paginate-v2
    const options = {
      page: pageNumber || 1,
      limit: limitNumber || 10,
    };

    const items = await Restaurant.paginate({}, options);

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
}

export async function getRestaurantById(req, res) {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error(`Error getting Restaurant by ID: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
}

//add admin
export async function addRestaurant(req, res, next) {
  try {
    const { name, description, location, image } = req.body;
    const restaurant = await Restaurant.create({
      name: name,
      description: description,
      location: location,
      image: image,
    });

    return res.status(201).json({ restaurant });
  } catch (err) {
    return res.status(400).send(err.message);
  }
}

export async function editRestaurant(req, res, next) {
  let { id } = req.params;
  try {
    const oldRestaurant = await Restaurant.findById(id);
    console.log(req.body.image);
    !req.body.image ? null : fs.unlinkSync(oldRestaurant.image);

    const response = await Restaurant.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.status(200).send({ success: true, response });
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

// delete product
export async function deleteRestaurant(req, res, next) {
  let { id } = req.params;
  try {
    const oldRestaurant = await Restaurant.findById(req.params.id);
    if (!oldRestaurant) {
      return res.status(409).send({ message: "Restaurant does not exists" });
    }

    !oldRestaurant.image ? null : fs.unlinkSync(oldRestaurant.image);

    const response = await Restaurant.findOneAndDelete({ _id: id }, req.body, {
      new: true,
    });
    res.status(200).send({
      success: true,
      response,
      message: "Restaurant deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

const controller = {
  getAll,
  addRestaurant,
  getRestaurantById,
  editRestaurant,
  deleteRestaurant,
};

export default controller;
