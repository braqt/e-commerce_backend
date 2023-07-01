import { Router } from "express";
import multer, { memoryStorage } from "multer";

import ProductController from "../controllers/Product";
import { checkIfAdmin } from "../middlewares/auth";

const router = Router();
const productController = new ProductController();

const upload = multer({
  storage: memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Archivo no válido. Solo se permiten imágenes."));
    }
  },
});

router.post(
  "/createProduct",
  //@ts-ignore
  [upload.array("images"), checkIfAdmin],
  productController.createProduct
);
router.post("/getProduct", productController.getProduct);

export default router;
