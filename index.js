import express from "express";
import morgan from "morgan";
import cors from 'cors';
import router from "./routes/router.js";

const app = express();

app.use(express.json());
app.use(cors('*'));
app.use(morgan('combined'));

app.use(router);

const PORT = 4000;  // Definir el puerto

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);  // Mensaje actualizado
});
