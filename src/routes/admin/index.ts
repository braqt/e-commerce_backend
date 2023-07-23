import { Router } from "express";

import AdminProductRoutes from "./products";
import AdminOrderRoutes from "./orders";
import AdminUserRoutes from "./users";

const router = Router();

router.use("/products", AdminProductRoutes);
router.use("/orders", AdminOrderRoutes);
router.use("/users", AdminUserRoutes);

export default router;
