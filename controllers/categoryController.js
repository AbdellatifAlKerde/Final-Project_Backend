import Category from "../models/categoryModel.js";

class Controller {
  //   create a new category
  createCategory = async (req, res) => {
    try {
      const category = new Category(req.body);
      await category.save();
      res.status(200).json(category);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  // Get all categories
  getAllCategories = async (req, res, next) => {
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

      const items = await Category.paginate({}, options);

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

  // Get category by id
  getCategoryById = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Update category by id

  updateCategoryById = async (req, res, next) => {
    let { id } = req.params;
    try {
      const oldCategory = await Category.findById(req.params.id);
      const response = await Category.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });
      res.status(200).send({ success: true, response });
    } catch (error) {
      return next(error);
    }
  };

  // Delete  category by Id

  deleteCategoryById = async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
}

const controller = new Controller();
export default controller;
