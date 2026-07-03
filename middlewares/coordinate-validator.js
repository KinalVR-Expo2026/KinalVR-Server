import { body } from "express-validator";

// Formato aceptado por A-Frame para position/rotation: "x y z" (3 números separados por espacios).
export const COORDINATE_FORMAT_REGEX = /^-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s+-?\d+(\.\d+)?$/;

// Límites compartidos con el frontend (AdminOverlay.jsx) y los esquemas Mongoose
// (scene.model.js / event.model.js). Si se cambian aquí, actualizar también allá.
export const POSITION_BOUND = 50;
export const ROTATION_BOUND = 360;

export const isWithinCoordinateBounds = (value, bound) => {
    if (typeof value !== "string" || !COORDINATE_FORMAT_REGEX.test(value)) return false;
    return value.trim().split(/\s+/).map(Number).every((n) => Math.abs(n) <= bound);
};

export const positionRotationValidator = (field, { bound, label }) =>
    body(field)
        .optional()
        .isString()
        .withMessage(`${label} debe ser un texto con formato de coordenadas "x y z"`)
        .matches(COORDINATE_FORMAT_REGEX)
        .withMessage(`${label} debe tener el formato "x y z" con 3 números (ej. "1.5 -2 0.75")`)
        .custom((value) => isWithinCoordinateBounds(value, bound))
        .withMessage(`${label} tiene valores fuera de rango (máximo ±${bound} por eje)`);
