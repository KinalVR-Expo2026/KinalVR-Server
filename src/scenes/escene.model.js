import { Schema, model } from 'mongoose';

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
        type: Number,
        required: [true, 'El subId es obligatorio'],
        unique: true
    },
}, {
    timestamps: true,
    versionKey: false
});

export default model('Escena', escenaSchema);