export const corsOptions = {
    // Al usar una función, permitimos dinámicamente cualquier origen (ideal para los dominios cambiantes de VS Code) 
    // mientras mantenemos credentials en true, lo cual es obligatorio para cookies/sesiones cruzadas.
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};