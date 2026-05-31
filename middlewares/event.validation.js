import { check } from "express-validator";
import { checkValidators } from "./checkValidators.js";

export const createEventValidator = [
    check("descripcion", "La descripción es obligatoria").not().isEmpty(),
    check("idEscenario", "El idEscenario debe ser un ID de MongoDB válido").isMongoId(),
    checkValidators
];

export const updateEventValidator = [
    check("descripcion", "La descripción no puede estar vacía").optional().not().isEmpty(),
    check("idEscenario", "El idEscenario debe ser un ID de MongoDB válido").optional().isMongoId(),
    checkValidators
];
