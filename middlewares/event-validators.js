import { body } from "express-validator";
import { checkValidators } from "./checkValidators.js";

export const createEventValidator = [
    body('urlImagen')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('La imagen del evento es obligatoria');
            }
            return true;
        }),
    body('descripcion')
        .notEmpty()
        .withMessage('La descripción es obligatoria'),
    body('idEscenario')
        .notEmpty()
        .withMessage('El idEscenario es obligatorio')
        .isMongoId()
        .withMessage('El idEscenario debe ser un ID de MongoDB válido'),
    body('position')
        .optional()
        .isString()
        .withMessage('La posición debe ser un texto con formato de coordenadas "x y z"'),
    body('rotation')
        .optional()
        .isString()
        .withMessage('La rotación debe ser un texto con formato "x y z"'),
    checkValidators
];

export const updateEventValidator = [
    body('urlImagen')
        .optional()
        .custom((value, { req }) => {
            return true; 
        }),
    body('descripcion')
        .optional()
        .notEmpty()
        .withMessage('La descripción es obligatoria'),
    body('idEscenario')
        .optional()
        .isMongoId()
        .withMessage('El idEscenario debe ser un ID de MongoDB válido'),
    body('position')
        .optional()
        .isString()
        .withMessage('La posición debe ser un texto con formato de coordenadas "x y z"'),
    body('rotation')
        .optional()
        .isString()
        .withMessage('La rotación debe ser un texto con formato "x y z"'),
    checkValidators
];