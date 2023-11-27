import { Router } from "express";
import multer, { memoryStorage } from "multer";

import { checkIfAdmin } from "../../middlewares/auth";
import { checkRateLimit } from "../../middlewares/rateLimit";
import AdminController from "../../controllers/Admin";

const router = Router();
const adminController = new AdminController();

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
  [checkRateLimit, upload.array("images"), checkIfAdmin],
  adminController.createProduct
);

router.post(
  "/getProducts",
  //@ts-ignore
  [checkRateLimit, checkIfAdmin],
  adminController.getProducts
);

export default router;
