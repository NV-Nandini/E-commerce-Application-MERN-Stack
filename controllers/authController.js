import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken"; //JWT is json web token
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
//import { toast } from "react-hot-toast";

//Registration
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body; //req.body gets the data sent by the user
    //validations
    //validation for new User
    if (!name) {
      return res.send({ message: "Name is required" }); // since we have mentioned "name" as "required" in userModel.js that is the only error that can occur
    }
    if (!email) {
      return res.send({ message: "Email is required" }); // since we have mentioned "email" as "required" in userModel.js that is the only error that can occur
    }
    if (!password) {
      return res.send({ message: "Password is required" }); // since we have mentioned "password" as "required" in userModel.js that is the only error that can occur
    }
    if (!phone) {
      return res.send({ message: "Phone Number is required" }); // since we have mentioned "phone" as "required" in userModel.js that is the only error that can occur
    }
    if (!address) {
      return res.send({ message: "Address is required" }); // since we have mentioned "address" as "required" in userModel.js that is the only error that can occur
    }
    if (!answer) {
      return res.send({ message: "Answer is required" }); // since we have mentioned "address" as "required" in userModel.js that is the only error that can occur
    }
    //validation for existing user email
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "This email is already registered, Login or use another email",
      });
    }
    //registering the user
    const hashedPassword = await hashPassword(password); // this is done using authHelper.js

    //saving the received values
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    //validate user
    const user = await userModel.findOne({ email });
    // console.log({ email });
    //console.log(user);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Unregistered email, please register",
      });
    }

    const match = await comparePassword(password, user.password); // this is done using authHelper.js
    //console.log(match);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Incorrect password, Please enter again",
      });
    }

    //creating a token using JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_secret, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "User Login successfull",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};
//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    //password
    if (password && password.length < 4) {
      return res.status(400).json({
        error: "Password is required and must be at least 4 characters long",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: "true",
      message: "user profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "error while updating user profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Geting Orders",
      error: error.message,
    });
  }
};
//all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Geting all Orders",
      error: error.message,
    });
  }
};

//order status controller
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.status(200).json(orders);
    a;
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating Order status",
      error: error.message,
    });
  }
};
