import { Router } from "express";
import multer, { memoryStorage } from "multer";

import ProductController from "../controllers/Product";

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
  upload.array("images"),
  productController.createProduct
);

export default router;
