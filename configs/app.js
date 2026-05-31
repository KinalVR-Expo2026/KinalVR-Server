'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import escenaRoutes from '../src/scenes/escene.routes.js';
import eventRoutes from '../src/events/event.routes.js';
import { parseMultipart } from '../middlewares/file-uploader.js';

const BASE_PATH = '/kinal-vr/v1';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
    app.use(morgan('dev'));
    
    // Global multipart/form-data parser for non-file-upload routes
    app.use((req, res, next) => {
        const contentType = req.headers['content-type'] || '';
        if (contentType.includes('multipart/form-data')) {
            const isFileUploadRoute = (req.method === 'POST' || req.method === 'PUT') &&
                (req.path.includes('/scenes') || req.path.includes('/events'));
            if (!isFileUploadRoute) {
                return parseMultipart(req, res, next);
            }
        }
        next();
    });
}

const routes = (app) => {
    app.get(`${BASE_PATH}/health`, (request, response) => {
        response.status(200).json({
            status: 'Healthy',
            timestamp: new Date().toISOString(),
            service: 'KinalVR Server'
        })
    })

    app.use(`${BASE_PATH}/scenes`, escenaRoutes);
    app.use(`${BASE_PATH}/events`, eventRoutes);

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado'
        })
    })
}

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT;
    app.set('trust proxy', 1);

    try {
        await dbConnection();
        middlewares(app);
        routes(app);

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`KinalVR Server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
        })
    } catch (error) {
        console.error(`Error starting KinalVR Server: ${error.message}`);
        process.exit(1);
    }
}