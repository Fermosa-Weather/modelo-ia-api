// routes/climaRoutes.js
import express from 'express';
import { obtenerDatosEstacion } from '../controllers/obtenerDatosEstacion.js';

const router = express.Router();

// Ruta para obtener datos de la estación meteorológica
router.post('/obtener-datos', obtenerDatosEstacion);

export default router;
