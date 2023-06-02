import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../controllers/authController.js";

//get all users
export const getAllAdmins = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Paginate items using mongoose-paginate-v2
    const options = {
      page: pageNumber || 1,
      limit: limitNumber || 10,
    };

    const items = await Admin.paginate({}, options);

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

//get an user by id
export const getAdminById = async (req, res, next) => {
  try {
    let { id } = req.params;
    let admin = await Admin.findOne({ _id: id });
    if (!admin) {
      throw new Error("Admin not found");
    }
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

//User Registration
export const register = async (req, res, next) => {
  try {
    const { username, password, isSuper, isActive } = req.body;
    console.log(username, password, isSuper);

    // if (!username || !password || !isSuper) {
    //   return res.status(400).json({
    //     message: "All inputs is required",
    //   });
    // }

    const existingAdmin = await Admin.findOne({ username: req.body.username });
    if (existingAdmin)
      return res.status(409).json({
        message: "Username exists",
      });

    const newAdmin = new Admin({
      username: username,
      password: password,
      isSuper: isSuper,
      isActive: isActive,
    });
    await newAdmin
      .save()
      .then((response) => {
        res.status(201).json({
          success: true,
          response,
          message: "Admin Created Successfully",
        });
      })
      .catch((err) => {
        res.status(400).json({ success: false, err });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

//User login
export const login = async (req, res, next) => {
  try {
    // Check if email and password are provided
    const { username } = req.body;

    // Check if email exists in database
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Check if password is correct
    const isValidPassword = await admin.isValidPassword(req.body.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate and send authentication token
    const token = generateToken({
      id: admin._id,
      username: admin.username,
    }); // Customize token payload as needed
    // save user token
    res.cookie(
      "adminToken",
      token,
      {
        httpOnly: true,
      },
      { expires: new Date(Date.now() + 604800000) }
    );

    const { password, ...otherDetails } = admin._doc;

    res.json({ ...otherDetails, token });
  } catch (error) {
    next(error);
  }
};

//update a user by id
export const editAdmin = async (req, res, next) => {
  let { id } = req.params;
  const { username, password, isSuper, isActive } = req.body;

  try {
    // check if admin already exists
    const oldAdmin = await Admin.findOne({ username });

    if (oldAdmin) {
      return res.status(409).send("Admin already exists, please login");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // password = hashedPassword;
    const response = await Admin.findOneAndUpdate(
      { _id: id },
      {
        username: username,
        password: hashedPassword,
        isSuper: isSuper,
        isActive: isActive,
      },
      {
        new: true,
      }
    );
    res.status(200).send({ success: true, response });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const editActive = async (req, res, next) => {
  try {
    let id = req.params.id;
    const { isActive } = req.body;

    const response = await Admin.findOneAndUpdate(
      { _id: id },
      {
        isActive: isActive,
      },
      {
        new: true,
      }
    );
    res.status(200).send({ success: true, response });
  } catch (err) {
    return next(err);
  }
};

export const editUsername = async (req, res, next) => {
  try {
    let id = req.params.id;
    const { username } = req.body;

    const existingAdmin = await Admin.findOne({ username: req.body.username });
    if (existingAdmin)
      return res.status(409).json({
        message: "Username exists",
      });

    const response = await Admin.findOneAndUpdate(
      { _id: id },
      {
        username: username,
      },
      {
        new: true,
      }
    );
    res.status(200).send({ success: true, response });
  } catch (err) {
    return next(err);
  }
};

export const editPassword = async (req, res, next) => {
  try {
    let id = req.params.id;
    const { password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const response = await Admin.findOneAndUpdate(
      { _id: id },
      {
        password: hashedPassword,
      },
      {
        new: true,
      }
    );
    res.status(200).send({ success: true, response });
  } catch (err) {
    return next(err);
  }
};

//delete user
export const deleteAdmin = async (req, res, next) => {
  try {
    const result = await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      result,
      message: "Admin deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

const controller = {
  getAllAdmins,
  getAdminById,
  register,
  login,
  editAdmin,
  deleteAdmin,
  editUsername,
  editPassword,
  editActive,
};

export default controller;
