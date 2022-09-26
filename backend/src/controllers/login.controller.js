// Importamos la conexión con nuestra base de datos y las consultas
import { getConnection, queries } from "../database/index.js"

/**
 * function that extracts the schemas from the database 
 * and to each one of these you assign their respective tables and their attributes.
 * 
 * @params (pool) allows multiple connections to the backend
 * @returns the response jsonlist
 */
export const loadSchemaData = async ( pool, res ) => {

    const response = await pool.query("select genSchemaNames();") 
    const schemaNames = response.rows[0].genschemanames;
    const schemaList = schemaNames.split(',');
    var jsonList = [];
    for (const schema of schemaList) {  
        const reponse2 = await pool.query("select genJsonData('"+ schema +"');")  
        const jsonReponse = reponse2.rows[0].genjsondata
        const parsedJson = JSON.parse(jsonReponse)
        jsonList.push(parsedJson);
    }
    pool.end();
    return jsonList;
}

/**
 * function that make the connection to the database
 * @params (req) is from the frontend
 * @returns the response
 */
export const makeConnection = async ( req, res ) => {
    try {
        const connectionValues = ({
            user: req.body.user,
            host: req.body.serverConnection,
            database: req.body.databaseName,
            password: req.body.password,
            port: req.body.port,
        });
        const pool = await getConnection( connectionValues );
        loadSchemaData( pool )
        .then( result  => {
            res.send( result );        });
    } catch( error ) {
        console.log( "Error de conexion", error.message );
    }
}