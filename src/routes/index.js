import express from "express";

import * as indexController from "../controller/index.js";

const router = express.Router();

router.get("/", indexController.indexRender);
router.get("/success", indexController.success);
router.post("/", indexController.postRender);

export default router;