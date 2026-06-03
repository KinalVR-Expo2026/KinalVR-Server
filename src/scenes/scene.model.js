import { Schema, model } from 'mongoose';

const conexionSchema = new Schema({
    targetSubId: { type: String, required: true },
    position: { type: String, default: "0 1 -3" },
    rotation: { type: String, default: "0 0 0" }
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