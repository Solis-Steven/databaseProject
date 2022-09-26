/** Este archivo va a dar inicio al servidor */
import app from './app.js'
import './database/connection.js'

// Corremos el servidor en el puerto 3000
app.listen(3000);
/* Mostramos un mensaje para confirmar que el
   servidor ha iniciado correctamente*/
console.log("Corriendo server...");