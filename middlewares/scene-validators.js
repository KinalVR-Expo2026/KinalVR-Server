import { body } from "express-validator";
import { checkValidators } from "./checkValidators.js";
import { POSITION_BOUND, ROTATION_BOUND, positionRotationValidator } from "./coordinate-validator.js";
import Scene from "../src/scenes/scene.model.js";

const posicionArrayValidator = ({ required = false } = {}) => {
    const chain = body('posicion');
    if (required) {
        chain.notEmpty().withMessage('La posición es obligatoria');
    } else {
        chain.optional();
    }
    return chain
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
        });
};

export const createSceneValidator = [
    body('ubicacion')
        .notEmpty()
        .withMessage('La ubicación es obligatoria'),
    body('nivel')
        .notEmpty()
        .withMessage('El nivel del escenario es obligatorio')
        .isIn(['PRIMER NIVEL', 'SEGUNDO NIVEL', 'TERCER NIVEL', 'CUARTO NIVEL'])
        .withMessage('El nivel debe ser PRIMER NIVEL, SEGUNDO NIVEL, TERCER NIVEL o CUARTO NIVEL'),
    posicionArrayValidator(),
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
        .isString()
        .withMessage('La URL de la imagen debe ser un texto'),
    body('ubicacion')
        .optional()
        .notEmpty()
        .withMessage('La ubicación no puede estar vacía'),
    body('nivel')
        .optional()
        .isIn(['PRIMER NIVEL', 'SEGUNDO NIVEL', 'TERCER NIVEL', 'CUARTO NIVEL'])
        .withMessage('El nivel debe ser PRIMER NIVEL, SEGUNDO NIVEL, TERCER NIVEL o CUARTO NIVEL'),
    posicionArrayValidator(),
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
        .withMessage('El subId debe ser un texto')
        .custom((value, { req }) => {
            if (value === req.body.sourceSubId) {
                throw new Error('Un escenario no puede conectarse consigo mismo');
            }
            return true;
        }),
    positionRotationValidator('position', { bound: POSITION_BOUND, label: 'La posición' }),
    positionRotationValidator('rotation', { bound: ROTATION_BOUND, label: 'La rotación' }),
    checkValidators
];

export const updatePosicionNivelValidator = [
    body('subId')
        .notEmpty()
        .withMessage('El subId es obligatorio')
        .isString()
        .withMessage('El subId debe ser un texto'),
    body('nivel')
        .notEmpty()
        .withMessage('El nivel es obligatorio')
        .isIn(['PRIMER NIVEL', 'SEGUNDO NIVEL', 'TERCER NIVEL', 'CUARTO NIVEL'])
        .withMessage('El nivel debe ser PRIMER NIVEL, SEGUNDO NIVEL, TERCER NIVEL o CUARTO NIVEL'),
    posicionArrayValidator({ required: true }),
    checkValidators
];
