import Driver from "../models/driversModel.js";
// import uploadImage from "../middleware/image.js";

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

    const items = await Driver.paginate({}, options);

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

export async function getDriverById(req, res) {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json(driver);
  } catch (error) {
    console.error(`Error getting Driver by ID: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
}

//add admin
export async function addDriver(req, res, next) {
  try {
    const { name, phone, status } = req.body;
    const driver = await Driver.create({
      name: name,
      phone: phone,
      status: status,
    });

    return res.status(201).json({ driver });
  } catch (err) {
    return res.status(400).send(err.message);
  }
}

export async function editDriver(req, res, next) {
  let { id } = req.params;
  try {
    const response = await Driver.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.status(200).send({ success: true, response });
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

// delete product
export async function deleteDriver(req, res, next) {
  let { id } = req.params;
  try {
    const oldDriver = await Driver.findById(req.params.id);
    if (!oldDriver) {
      return res.status(409).send({ message: "Driver does not exists" });
    }
    const response = await Driver.findOneAndDelete({ _id: id }, req.body, {
      new: true,
    });
    res.status(200).send({
      success: true,
      response,
      message: "Driver deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

const controller = {
  getAll,
  addDriver,
  getDriverById,
  editDriver,
  deleteDriver,
};

export default controller;
