import Scene from "./scene.model.js";
import { Types } from "mongoose";

export const createScene = async (req, res) => {
    try {
        const data = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "La imagen 360 es obligatoria"
            });
        }

        const existingScene = await Scene.findOne({ subId: data.subId });
        if (existingScene) {
            return res.status(400).json({
                success: false,
                message: "El subId ya está en uso por otro escenario"
            });
        }

        if (req.file) {
            data.urlImagen = req.file.path;
        }

        const scene = new Scene(data);
        await scene.save();

        res.status(201).json({
            success: true,
            message: "Escenario creado exitosamente",
            scene: scene
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear el escenario",
            error: err.message
        });
    }
};

export const getScenes = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = {};

        const [total, scenes] = await Promise.all([
            Scene.countDocuments(query),
            Scene.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total: total,
            scenes: scenes
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los escenarios",
            error: err.message
        });
    }
};

export const getSceneById = async (req, res) => {
    try {
        const { id } = req.params;
        const scene = await Scene.findById(id);

        if (!scene) {
            return res.status(404).json({
                success: false,
                message: "Escenario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            scene: scene
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el escenario",
            error: err.message
        });
    }
};

export const getSceneBySubId = async (req, res) => {
    try {
        const { subId } = req.params;
        const scene = await Scene.findOne({ subId });

        if (!scene) {
            return res.status(404).json({
                success: false,
                message: "Escenario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            scene: scene
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el escenario",
            error: err.message
        });
    }
};

export const updateScene = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (req.file) {
            data.urlImagen = req.file.path;
        }

        if (data.subId) {
            const existingScene = await Scene.findOne({ subId: data.subId, _id: { $ne: new Types.ObjectId(id) } });
            if (existingScene) {
                return res.status(400).json({
                    success: false,
                    message: "El subId ya está en uso por otro escenario"
                });
            }
        }

        const scene = await Scene.findByIdAndUpdate(id, data, { new: true });

        if (!scene) {
            return res.status(404).json({
                success: false,
                message: "Escenario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Escenario actualizado exitosamente",
            scene: scene
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el escenario",
            error: err.message
        });
    }
};

export const deleteScene = async (req, res) => {
    try {
        const { id } = req.params;
        const scene = await Scene.findByIdAndDelete(id);

        if (!scene) {
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

export const addConnection = async (req, res) => {
    try {
        const { sourceSubId, targetSubId, position = "0 1 -3", rotation = "0 0 0" } = req.body;

        if (sourceSubId === targetSubId) {
            return res.status(400).json({
                success: false,
                message: "Un escenario no puede conectarse consigo mismo"
            });
        }

        const sourceScene = await Scene.findOne({ subId: sourceSubId });
        if (!sourceScene) {
            return res.status(404).json({
                success: false,
                message: `El escenario de origen '${sourceSubId}' no existe`
            });
        }

        const targetScene = await Scene.findOne({ subId: targetSubId });
        if (!targetScene) {
            return res.status(404).json({
                success: false,
                message: `El escenario de destino '${targetSubId}' no existe`
            });
        }

        if (sourceScene.conexiones.some(c => c.targetSubId === targetSubId)) {
            return res.status(400).json({
                success: false,
                message: `La conexión hacia '${targetSubId}' ya existe en el escenario '${sourceSubId}'`
            });
        }

        sourceScene.conexiones.push({ targetSubId, position, rotation });
        await sourceScene.save();

        res.status(200).json({
            success: true,
            message: "Conexión agregada exitosamente",
            scene: sourceScene
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al agregar la conexión al escenario",
            error: err.message
        });
    }
};

export const updatePositionAndLevel = async (req, res) => {
    try {
        const { subId, posicion, nivel } = req.body;

        const scene = await Scene.findOne({ subId });
        if (!scene) {
            return res.status(404).json({
                success: false,
                message: `El escenario con subId '${subId}' no existe`
            });
        }

        scene.posicion = posicion;
        scene.nivel = nivel;
        await scene.save();

        res.status(200).json({
            success: true,
            message: "Posición y nivel del escenario actualizados exitosamente",
            scene
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la posición y nivel del escenario",
            error: err.message
        });
    }
};