import { Router } from "express";
import { 
    createScene, 
    getScenes, 
    getSceneById, 
    getSceneBySubId,
    updateScene, 
    deleteScene 
} from "./scene.controller.js";
import { uploadFieldImage } from "../../middlewares/file-uploader.js";
import { createSceneValidator, updateSceneValidator } from "../../middlewares/scene-validators.js";

const router = Router();

router.post(
    "/",
    uploadFieldImage.single("imagen"),
    createSceneValidator,
    createScene
);

router.get(
    "/",
    getScenes
);

router.get(
    "/:id",
    getSceneById
);

router.get(
    "/sub/:subId",
    getSceneBySubId
);

router.put(
    "/:id",
    uploadFieldImage.single("imagen"),
    updateSceneValidator,
    updateScene
);

router.delete(
    "/:id",
    deleteScene
);

export default router;