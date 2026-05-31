import Escena from "./escene.model.js";
import { Types } from "mongoose";

export const saveEscena = async (req, res) => {
    try {
        const data = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "La imagen 360 es obligatoria"
            });
        }

        // Verificar que el subId no esté repetido
        const existingEscena = await Escena.findOne({ subId: data.subId });
        if (existingEscena) {
            return res.status(400).json({
                success: false,
                message: "El subId ya está en uso por otro escenario"
            });
        }

        data.urlImagen = req.file.path;

        const escena = new Escena(data);
        await escena.save();

        res.status(201).json({
            success: true,
            message: "Escenario guardado exitosamente",
            escena
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al guardar el escenario",
            error: err.message
        });
    }
};

export const getEscenas = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = {};

        const [total, escenas] = await Promise.all([
            Escena.countDocuments(query),
            Escena.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            escenas
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los escenarios",
            error: err.message
        });
    }
};

export const getEscenaById = async (req, res) => {
    try {
        const { id } = req.params;
        const escena = await Escena.findById(id);

        if (!escena) {
            return res.status(404).json({
                success: false,
                message: "Escenario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            escena
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el escenario",
            error: err.message
        });
    }
};

export const getEscenasBySubId = async (req, res) => {
    try {
        const { subId } = req.params;
        const escenas = await Escena.find({ subId });

        if (escenas.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron escenarios para el subId proporcionado"
            });
        }

        res.status(200).json({
            success: true,
            escenas
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los escenarios",
            error: err.message
        });
    }
};

export const updateEscena = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (req.file) {
            data.urlImagen = req.file.path;
        }

        // Verificar que el nuevo subId no esté repetido si se está actualizando
        if (data.subId) {
            const existingEscena = await Escena.findOne({ subId: data.subId, _id: { $ne: new Types.ObjectId(id) } });
            if (existingEscena) {
                return res.status(400).json({
                    success: false,
                    message: "El subId ya está en uso por otro escenario"
                });
            }
        }

        const escena = await Escena.findByIdAndUpdate(id, data, { new: true });

        if (!escena) {
            return res.status(404).json({
                success: false,
                message: "Escenario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Escenario actualizado exitosamente",
            escena
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el escenario",
            error: err.message
        });
    }
};

export const deleteEscena = async (req, res) => {
    try {
        const { id } = req.params;
        const escena = await Escena.findByIdAndDelete(id);

        if (!escena) {
            return res.status(404).json({
                success: false,
                message: "Escenario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Escenario eliminado exitosamente"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el escenario",
            error: err.message
        });
    }
};
