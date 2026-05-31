import Event from "./event.model.js";
import Scene from "../scenes/scene.model.js"; 

export const saveEvent = async (req, res) => {
    try {
        const data = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "La imagen del evento es obligatoria"
            });
        }

        const sceneExists = await Scene.findById(data.idEscenario);
        if (!sceneExists) {
            return res.status(404).json({
                success: false,
                message: "El escenario asociado no existe"
            });
        }

        data.urlImagen = req.file.path;

        const event = new Event(data);
        await event.save();

        res.status(201).json({
            success: true,
            message: "Evento creado exitosamente",
            event
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear el evento",
            error: err.message
        });
    }
};

export const getEvents = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = {};

        const [total, events] = await Promise.all([
            Event.countDocuments(query),
            Event.find(query)
                .populate("idEscenario", "ubicacion subId urlImagen")
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            events
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los eventos",
            error: err.message
        });
    }
};

export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate("idEscenario", "ubicacion subId urlImagen");

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Evento no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            event
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el evento",
            error: err.message
        });
    }
};

export const getEventsByEscenario = async (req, res) => {
    try {
        const { idEscenario } = req.params;

        const sceneExists = await Scene.findById(idEscenario);
        if (!sceneExists) {
            return res.status(404).json({
                success: false,
                message: "El escenario proporcionado no existe"
            });
        }

        const events = await Event.find({ idEscenario }).populate("idEscenario", "ubicacion subId urlImagen");

        res.status(200).json({
            success: true,
            events
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los eventos del escenario",
            error: err.message
        });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (req.file) {
            data.urlImagen = req.file.path;
        }

        if (data.idEscenario) {
            const sceneExists = await Scene.findById(data.idEscenario);
            if (!sceneExists) {
                return res.status(404).json({
                    success: false,
                    message: "El escenario asociado no existe"
                });
            }
        }

        const event = await Event.findByIdAndUpdate(id, data, { new: true });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Evento no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Evento actualizado exitosamente",
            event
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el evento",
            error: err.message
        });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Evento no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Evento eliminado exitosamente"
        });
        
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el evento",
            error: err.message
        });
    }
};