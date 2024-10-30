// server.js
import express from 'express';
import cors from 'cors';
import datosEstacionRoutes from './routes/climaRoutes.js'; 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Usar las rutas
app.use('/api', datosEstacionRoutes); // Usa las rutas bajo el prefijo '/api'

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
