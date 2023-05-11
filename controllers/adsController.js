import Ads from "../models/adsModel.js";
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

    const items = await Ads.paginate({}, options);

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

export async function getAdById(req, res) {
  try {
    const ad = await Ads.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }
    res.status(200).json(ad);
  } catch (error) {
    console.error(`Error getting Ad by ID: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
}

//add admin
export async function addAd(req, res, next) {
  try {
    const { title, description, image } = req.body;
    const ad = await Ads.create({
      title: title,
      description: description,
      image: image,
    });

    return res.status(201).json({ ad });
  } catch (err) {
    return res.status(400).send(err.message);
  }
}

export async function editAd(req, res, next) {
  let { id } = req.params;
  try {
    const oldAd = await Ads.findById(id);
    !req.body.image ? null : fs.unlinkSync(oldAd.image);

    const response = await Ads.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.status(200).send({ success: true, response });
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

// delete product
export async function deleteAd(req, res, next) {
  let { id } = req.params;
  try {
    const oldAd = await Ads.findById(req.params.id);
    if (!oldAd) {
      return res.status(409).send({ message: "Ad does not exists" });
    }

    !oldAd.image ? null : fs.unlinkSync(oldAd.image);

    const response = await Ads.findOneAndDelete({ _id: id }, req.body, {
      new: true,
    });
    res.status(200).send({
      success: true,
      response,
      message: "Ad deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

const controller = {
  getAll,
  addAd,
  getAdById,
  editAd,
  deleteAd,
};

export default controller;
