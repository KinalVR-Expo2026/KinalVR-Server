import { check } from "express-validator";
import { checkValidators } from "./checkValidators.js";

export const createEscenaValidator = [
    check("ubicacion", "La ubicación es obligatoria").not().isEmpty(),
    check("subId", "El subId debe ser un número entero").isInt(),
    checkValidators
];

export const updateEscenaValidator = [
    checkValidators
];
