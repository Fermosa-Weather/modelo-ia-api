import fetch from 'node-fetch';

// URL de la API de la estación meteorológica
const URL_ESTACION = 'https://ramf.formosa.gob.ar/api/station-data/6716ec79a4894d50e5d205a3';
// Reemplaza 'TU_TOKEN_AQUI' con tu token real
const TOKEN = '';

export const obtenerDatosEstacion = async (req, res) => {
    try {
        const headers = {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        };

        const respuesta = await fetch(URL_ESTACION, { method: 'GET', headers });

        if (!respuesta.ok) {
            throw new Error(`Error al obtener datos: ${respuesta.statusText}`);
        }

        const datos = await respuesta.json();
        const filtrarDatos = datos[1];

        const generarActividad = async (req, res) => {
            console.log('Generando actividad...', filtrarDatos);
        
            // Obtener la consulta del usuario
            const consulta = req.body.query; // Asegúrate de que la consulta se envíe en el cuerpo como { query: "¿Cómo estará el tiempo el 2024-10-30?" }
        

            try {
                const peticion = await fetch('http://localhost:11434/api/generate', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "llamaPredictor",
                        prompt: ` ${consulta} segun estos datos ${JSON.stringify(filtrarDatos)}`,
                        num_keep: 1,
                    }),
                });
        
                // Verifica si la respuesta es exitosa
                if (!peticion.ok) {
                    throw new Error(`Error en la petición a la API de generación: ${peticion.statusText}`);
                }
        
                // Leer la respuesta como texto
                const respuestaTexto = await peticion.text();
        
                // Procesar la respuesta línea por línea
                const lineas = respuestaTexto.split('\n'); // Suponiendo que cada respuesta es una línea
                const responses = lineas.map(linea => {
                    try {
                        const json = JSON.parse(linea); // Intenta parsear cada línea como JSON
                        return json.response; // Devuelve solo la propiedad 'response'
                    } catch (error) {
                        console.error('Error al parsear la línea:', error);
                        return null; // O maneja el error de otra manera
                    }
                }).filter(response => response !== null); // Filtra las respuestas nulas
        
                // Envía las respuestas concatenadas
                res.setHeader("Content-Type", "text/plain");
                res.write(responses.join('')); // Une las respuestas en un solo string
                res.end(); // Cierra la respuesta
                console.log('Actividad generada con éxito.');
                
            } catch (error) {
                console.error(error);
                if (!res.headersSent) {
                    res.status(500).json({ message: "Error en la generación de actividad." });
                }
            }
        };
        
        generarActividad(req, res);
    } catch (error) {
        console.error(`Error en obtenerDatosEstacion: ${error.message}`);
        res.status(500).json({ mensaje: 'Error al obtener datos de la estación.', error: error.message });
    }
};
