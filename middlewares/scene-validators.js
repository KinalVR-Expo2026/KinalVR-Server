import { body } from "express-validator";
import { checkValidators } from "./checkValidators.js";
import Scene from "../src/scenes/scene.model.js";

export const createSceneValidator = [
    body('ubicacion')
        .notEmpty()
        .withMessage('La ubicación es obligatoria'),
    body('subId')
        .notEmpty()
        .withMessage('El subId es obligatorio')
        .custom(async (value) => {
            const existingScene = await Scene.findOne({ subId: value });
            if (existingScene) {
                throw new Error('El subId ya está en uso por otro escenario');
            }
        }),
    checkValidators
];

export const updateSceneValidator = [
    body('urlImagen')
        .optional()
        .custom((value, { req }) => {
            return true; 
        }),
    body('ubicacion')
        .optional()
        .notEmpty()
        .withMessage('La ubicación no puede estar vacía'),
    body('subId')
        .optional()
        .notEmpty()
        .withMessage('El subId no puede estar vacío')
        .custom(async (value, { req }) => {
            const { id } = req.params;             
            const existingScene = await Scene.findOne({ subId: value, _id: { $ne: id } });
            if (existingScene) {
                throw new Error('El subId ya está en uso por otro escenario');
            }
        }),
    checkValidators
];
