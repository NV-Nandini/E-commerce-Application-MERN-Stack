import express, { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  productCategoryController,
  productController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  productUpdateController,
  relatedproductController,
  searchProductController,
  singleProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//update product
router.put(
  "/update-products/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  productUpdateController
);

//get All products
router.get("/get-products", productController);

//single product
router.get("/get-product/:slug", singleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController); //pid is product id

//delete products
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);

//filter products
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//productper page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", relatedproductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payment routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

export default router;
