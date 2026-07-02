import { Router } from "express";
import { 
    createScene, 
    getScenes, 
    getSceneById, 
    getSceneBySubId,
    updateScene, 
    deleteScene,
    addConnection,
    updatePositionAndLevel
} from "./scene.controller.js";
import { uploadFieldImage } from "../../middlewares/file-uploader.js";
import { 
    createSceneValidator,
    updateSceneValidator,
    addConnectionValidator,
    updatePosicionNivelValidator
} from "../../middlewares/scene-validators.js";

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

router.post(
    "/connection",
    addConnectionValidator,
    addConnection
);

router.post(
    "/posicion-nivel",
    updatePosicionNivelValidator,
    updatePositionAndLevel
);

export default router;