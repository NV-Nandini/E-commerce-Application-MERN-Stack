import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

//creating category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is Required" });
    }
    const exixtingCategory = await categoryModel.findOne({ name });
    if (exixtingCategory) {
      return res
        .status(200)
        .send({ success: "true", message: "Name already exists" });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res
      .status(201)
      .send({ success: true, message: "New category created", category });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "Error while creating category",
      error,
    });
  }
};

//updating category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: "true",
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "Error while updating category",
      error,
    });
  }
};

//get all categories
export const categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: "true",
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "Error while getting all Categories",
      error,
    });
  }
};

//get single category
export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: "true",
      message: "Single Category fetched Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "Error while getting a category",
      error,
    });
  }
};

//delete single category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: "true",
      message: "Deleted Single Category Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "Error while deleting a category",
      error,
    });
  }
};
