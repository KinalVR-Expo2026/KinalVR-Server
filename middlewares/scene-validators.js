import { body } from "express-validator";
import { checkValidators } from "./checkValidators.js";
import Scene from "../src/scenes/scene.model.js";

export const createSceneValidator = [
    body('ubicacion')
        .notEmpty()
        .withMessage('La ubicación es obligatoria'),
    body('nivel')
        .notEmpty()
        .withMessage('El nivel del escenario es obligatorio')
        .isIn(['PRIMER-NIVEL', 'SEGUNDO-NIVEL', 'TERCER-NIVEL', 'CUARTO-NIVEL'])
        .withMessage('El nivel debe ser PRIMER-NIVEL, SEGUNDO-NIVEL, TERCER-NIVEL o CUARTO-NIVEL'),
    body('posicion')
        .notEmpty()
        .withMessage('La posición es obligatoria')
        .customSanitizer((value) => {
            if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed)) return parsed;
                } catch (e) {
                    return value.split(',').map(num => parseFloat(num.trim()));
                }
            }
            return value;
        })
        .isArray({ min: 2, max: 2 })
        .withMessage('La posición debe ser un array con exactamente 2 elementos [x, y]')
        .custom((value) => {
            if (!value.every(num => typeof num === 'number' && !isNaN(num))) {
                throw new Error('Los elementos de la posición deben ser números');
            }
            return true;
        }),
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
    body('nivel')
        .optional()
        .isIn(['PRIMER-NIVEL', 'SEGUNDO-NIVEL', 'TERCER-NIVEL', 'CUARTO-NIVEL'])
        .withMessage('El nivel debe ser PRIMER-NIVEL, SEGUNDO-NIVEL, TERCER-NIVEL o CUARTO-NIVEL'),
    body('posicion')
        .optional()
        .customSanitizer((value) => {
            if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed)) return parsed;
                } catch (e) {
                    return value.split(',').map(num => parseFloat(num.trim()));
                }
            }
            return value;
        })
        .isArray({ min: 2, max: 2 })
        .withMessage('La posición debe ser un array con exactamente 2 elementos [x, y]')
        .custom((value) => {
            if (!value.every(num => typeof num === 'number' && !isNaN(num))) {
                throw new Error('Los elementos de la posición deben ser números');
            }
            return true;
        }),
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

export const addConnectionValidator = [
    body('sourceSubId')
        .notEmpty()
        .withMessage('El subId de origen (sourceSubId) es obligatorio')
        .isString()
        .withMessage('El subId debe ser un texto'),
    body('targetSubId')
        .notEmpty()
        .withMessage('El subId de destino (targetSubId) es obligatorio')
        .isString()
        .withMessage('El subId debe ser un texto'),
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