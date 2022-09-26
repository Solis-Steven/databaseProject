/** Creamos las consultas necesarias para consumir de la base de datos 
    lo que el cliente requiere */
    export const queries = {
        getJson: "select genJsonData('ad');",
        getSchema: "select genSchemaNames();",
    }