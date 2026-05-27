import { Router } from "express";
import { 
    saveEscena, 
    getEscenas, 
    getEscenaById, 
    getEscenasBySubId,
    updateEscena, 
    deleteEscena 
} from "./escene.controller.js";
import { uploadFieldImage } from "../../middlewares/file-uploader.js";
import { createEscenaValidator, updateEscenaValidator } from "../../middlewares/escene.validation.js";

const router = Router();

/**
 * @swagger
 * /escenas:
 *   post:
 *     summary: Crear un nuevo escenario con imagen 360
 */
router.post(
    "/",
    uploadFieldImage.single("imagen"),
    createEscenaValidator,
    saveEscena
);

/**
 * @swagger
 * /escenas:
 *   get:
 *     summary: Obtener todos los escenarios
 */
router.get("/", getEscenas);

/**
 * @swagger
 * /escenas/{id}:
 *   get:
 *     summary: Obtener un escenario por ID
 */
router.get("/:id", getEscenaById);

router.get("/subid/:subId", getEscenasBySubId);

/**
 * @swagger
 * /escenas/{id}:
 *   put:
 *     summary: Actualizar un escenario
 */
router.put(
    "/:id",
    uploadFieldImage.single("imagen"),
    updateEscenaValidator,
    updateEscena
);

/**
 * @swagger
 * /escenas/{id}:
 *   delete:
 *     summary: Eliminar un escenario
 */
router.delete("/:id", deleteEscena);

export default router;
