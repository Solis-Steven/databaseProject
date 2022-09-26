//constante para hacer el pool de conexiones
//import  Pool  from 'pg';
import pkg from 'pg';
const { Pool } = pkg;

/** Esta función nos permite conectar nuestro servidor con la base de datos
 * @returns Devuelve la conexión ya creada con la base de datos
*/
export async function getConnection( loginData ) {
    // Nos conectamos a la basej de datos
    try {
        const pool = new Pool( loginData );
        await pool.connect();
        return pool; // Devolvemos la conexión en caso de lograrse con éxito
        // await pool.end()
    } catch(err) {
        console.log(err); // Mostramos error en caso de fallar la conexión
    }
}