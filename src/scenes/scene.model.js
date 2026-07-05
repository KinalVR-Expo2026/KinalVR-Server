import { Schema, model } from 'mongoose';
import { POSITION_BOUND, ROTATION_BOUND, isWithinCoordinateBounds } from '../../middlewares/coordinate-validator.js';

// Los mismos límites se validan en middlewares/scene-validators.js (addConnectionValidator)
// y en el cliente (AdminOverlay.jsx) — mantener sincronizado si se cambian.
const conexionSchema = new Schema({
    targetSubId: { type: String, required: true },
    position: {
        type: String,
        default: "0 1 -3",
        validate: {
            validator: (value) => isWithinCoordinateBounds(value, POSITION_BOUND),
            message: (props) => `${props.value} no es una posición válida (formato "x y z", máximo ±${POSITION_BOUND} por eje)`
        }
    },
    rotation: {
        type: String,
        default: "0 0 0",
        validate: {
            validator: (value) => isWithinCoordinateBounds(value, ROTATION_BOUND),
            message: (props) => `${props.value} no es una rotación válida (formato "x y z", máximo ±${ROTATION_BOUND} por eje)`
        }
    }
}, { _id: false });

const escenaSchema = new Schema({
    urlImagen: {
        type: String,
        required: [true, 'La URL de la imagen 360 es obligatoria']
    },
    ubicacion: {
        type: String,
        required: [true, 'La ubicación física es obligatoria']
    },
    nivel: {
        type: String,
        enum: {
            values: ['PRIMER NIVEL', 'SEGUNDO NIVEL', 'TERCER NIVEL', 'CUARTO NIVEL'],
            message: '{VALUE} no es un nivel válido'
        },
        required: [true, 'El nivel del escenario es obligatorio']
    },
    posicion: {
        type: [Number]
    },
    coordinacionAngulo: {
        type: Number,
        default: 0
    },
    subId: {
        type: String,
        required: [true, 'El subId es obligatorio'],
        unique: true
    },
    conexiones: {
        type: [conexionSchema],
        default: []
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Scene', escenaSchema);