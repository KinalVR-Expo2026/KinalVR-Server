import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
    urlImagen: {
        type: String,
        required: [true, 'La URL de la imagen del evento es obligatoria']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción del evento es obligatoria']
    },
    idEscenario: {
        type: Schema.Types.ObjectId,
        ref: 'Scene',
        required: [true, 'El ID del escenario asociado es obligatorio']
    },
    position: { 
        type: String, 
        default: "0 1 -3" 
    },
    rotation: { 
        type: String, 
        default: "0 0 0" 
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Event', eventSchema);
