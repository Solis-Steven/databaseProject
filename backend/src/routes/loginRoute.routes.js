/** Hacemos uso de la clase Router para crear manejadores de rutas */
import { Router } from 'express'

import { makeConnection } from "../controllers/login.controller.js"

// Creamos una instrancia de la clase Router
const router = Router();

// Rutas
router.post('/userLogin', makeConnection)

// Exportamos nuestra instancia para poder consumirla desde otro sitio
export default router;