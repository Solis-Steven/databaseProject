// Importamos la conexión con nuestra base de datos y las consultas
import { getConnection, queries } from "../database/index.js"


/**
 * function that extracts the schemas from the database 
 * and to each one of these you assign their respective tables and their attributes.
 * 
 * @params (pool) allows multiple connections to the backend
 */
 export const insert = async ( pool, diagram, user ) => {
    
    const response = await pool.query(`select insert_diagram('${diagram}','${user}');`); 
    console.log(response);
    pool.end();
}




/**
 * function that make the connection to the database
 * @params (req) is from the frontend
 * @returns the response
 */
 export const makeConnection = async ( req, res ) => {
    try {
        console.log("Holaaaaaaaaaaaaaaaaaa", req.body)
        const connectionValues = ({
            user: req.body.user.user,
            host: req.body.user.serverConnection,
            database: req.body.user.databaseName,
            password: req.body.user.password,
            port: req.body.user.port,
        });
        const pool = await getConnection( connectionValues );
        insert( pool, req.body.diagram, req.body.user.user )
        .then( result  => {
            res.send( result );        });
    } catch( error ) {
        console.log( "Error de conexion", error.message );
    }
}