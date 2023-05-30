import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../controllers/authController.js";

//get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Paginate items using mongoose-paginate-v2
    const options = {
      page: pageNumber || 1,
      limit: limitNumber || 10,
    };

    const items = await User.paginate({}, options);

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
export const getUserById = async (req, res, next) => {
  try {
    let { id } = req.params;
    let user = await User.findOne({ _id: id });
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

//User Registration
export const register = async (req, res, next) => {
  try {
    const { username, email, password, address, phone } = req.body;

    if (!username || !email || !password || !address || !phone) {
      return res.status(400).json({
        message: "All inputs is required",
      });
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(409).json({
        message: "Mail exists",
      });

    const newUser = new User({
      username: username,
      email: email.toLowerCase(),
      password: password,
      address: address,
      phone: phone,
    });
    await newUser
      .save()
      .then((response) => {
        res.status(201).json({
          success: true,
          response,
          message: "User Created Successfully",
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
    const { email } = req.body;

    // Check if email exists in database
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isValidPassword = await user.isValidPassword(req.body.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate and send authentication token
    const token = generateToken({
      id: user._id,
      email: user.email,
    }); // Customize token payload as needed
    // save user token
    res.cookie("userToken", token, {
      httpOnly: true,
      maxAge: 90000,
    });

    const { password, ...otherDetails } = user._doc;

    res.json({ ...otherDetails, token });
  } catch (error) {
    next(error);
  }
};

//update a user by id
export const editUser = async (req, res, next) => {
  let { id } = req.params;
  const { username, email, password, phone, address } = req.body;

  try {
    // Check if email is provided
    if (email) {
      // Check if user with the provided email already exists
      const oldUser = await User.findOne({ email });

      if (oldUser) {
        return res.status(409).send("User already exists, please login");
      }
    }

    const updateFields = {
      username,
      password: await bcrypt.hash(password, 10),
      address,
      phone,
    };

    // Conditionally add email field to the update object
    if (email) {
      updateFields.email = email.toLowerCase();
    }

    const response = await User.findOneAndUpdate({ _id: id }, updateFields, {
      new: true,
    });

    res.status(200).send({ success: true, response });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const editUsername = async (req, res, next) => {
  try {
    let id = req.params.id;
    const { username } = req.body;

    const response = await User.findOneAndUpdate(
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

export const editAddress = async (req, res, next) => {
  try {
    let id = req.params.id;
    const { address } = req.body;

    const response = await User.findOneAndUpdate(
      { _id: id },
      {
        address: address,
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

export const editPhone = async (req, res, next) => {
  try {
    let id = req.params.id;
    const { phone } = req.body;

    const response = await User.findOneAndUpdate(
      { _id: id },
      {
        phone: phone,
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

export const editEmail = async (req, res, next) => {
  try {
    let id = req.params.id;
    const { email } = req.body;

    // check if admin already exists
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User already exists, please login");
    }

    const response = await User.findOneAndUpdate(
      { _id: id },
      {
        email: email.toLowerCase(),
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

    const response = await User.findOneAndUpdate(
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
export const deleteUser = async (req, res, next) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      result,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

const controller = {
  getAllUsers,
  getUserById,
  register,
  login,
  editUser,
  deleteUser,
  editUsername,
  editAddress,
  editPhone,
  editEmail,
  editPassword,
};

export default controller;
