/** Importamos lo necesario para crear nuestro servidor */

// Framework a utilizar para crear nuestro servidor
import express from 'express' 
// Nos permite que el cliente tenga permisos de acceso a los recursos del servidor 
import cors from 'cors';
import morgan from 'morgan'
// Obtenemos todas las rutas de nuestras apis
import loginRoute from "./routes/loginRoute.routes.js"  
import fillData from "./routes/fillData.routes.js"
import saveDiagrams from "./routes/saveDiagrams.routes.js"

// Creamos una instancia de express para utilizar nuestras rutas
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false})) // Para que reciba datos que vienen desde formularios html
app.use(cors());
app.use(morgan("dev"));
app.use(fillData);
app.use(loginRoute);
app.use(saveDiagrams);

// Exportamos nuestra instancia para poder consumirla desde otro sitio
export default app;