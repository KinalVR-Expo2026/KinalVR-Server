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

// Rutas específicas antes que "/:id" — de lo contrario Express nunca las alcanza
// porque "/:id" hace match con cualquier segmento (ver bug corregido: GET /sub/:subId
// quedaba inalcanzable al estar definida después de GET /:id).
router.get(
    "/sub/:subId",
    getSceneBySubId
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

router.get(
    "/:id",
    getSceneById
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