import { Router } from "express";
import {
    saveEvent,
    getEvents,
    getEventById,
    getEventsByEscenario,
    updateEvent,
    deleteEvent
} from "./event.controller.js";
import { uploadFieldImage } from "../../middlewares/file-uploader.js";
import { createEventValidator, updateEventValidator } from "../../middlewares/event.validation.js";

const router = Router();

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Crear un nuevo evento asociado a un escenario
 */
router.post(
    "/",
    uploadFieldImage.single("imagen"),
    createEventValidator,
    saveEvent
);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Obtener todos los eventos
 */
router.get("/", getEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Obtener un evento por ID
 */
router.get("/:id", getEventById);

/**
 * @swagger
 * /events/escenario/{idEscenario}:
 *   get:
 *     summary: Obtener eventos por ID de escenario
 */
router.get("/escenario/:idEscenario", getEventsByEscenario);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Actualizar un evento existente
 */
router.put(
    "/:id",
    uploadFieldImage.single("imagen"),
    updateEventValidator,
    updateEvent
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Eliminar un evento
 */
router.delete("/:id", deleteEvent);

export default router;
