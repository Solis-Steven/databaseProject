// Importamos la conexión con nuestra base de datos y las consultas
import { getConnection, queries } from "../database/index.js"

/**
 * function that load the variables that contains
 * the functions into the database based on the user
 * params (pool) allows multiple connections to the backend
 */
export const loadData = async ( pool ) => {

    var aux = `CREATE OR REPLACE FUNCTION genSchemaNames()  --function that returns the names of the schemas separated by a comma
    RETURNS varchar
    SECURITY DEFINER --allows to delegate permissions of the user who creates the function (super user).
    AS 
    $$
    DECLARE
        curEsquemas REFCURSOR; --cursor to scroll through diagrams
        v_schemaName varchar; --name of the scheme
        vString        varchar; -- returned string which contains all the schema names     
        curElimComa REFCURSOR; --cursor to remove the extra commas in the string
        
        
    BEGIN
            vString := ''; --begin the string
            OPEN curEsquemas FOR --open the schema cursor
            SELECT n.nspname 
            FROM pg_namespace n
            WHERE n.nspname != 'pg_toast' AND n.nspname != 'pg_catalog' AND n.nspname != 'pg_stadistic' AND n.nspname != 'information_schema';
            FETCH curEsquemas INTO v_schemaName; --moves to the first register
            LOOP
                IF FOUND THEN
                        vString:= vString|| v_schemaName || ','; --adds the string the name of the schema separated by a comma
                ELSE
                    EXIT;
                END IF;
            FETCH curEsquemas INTO v_schemaName;
            END LOOP;
            CLOSE curEsquemas;
            IF (RIGHT(vString,1) = ',') THEN
                OPEN curElimComa FOR --opens the cursor to remove the extra comma at the end of the string
                  SELECT substr(vString,1,length(vString)-1); --remove the comma
            FETCH curElimComa INTO vString;
            CLOSE curElimComa;
            END IF;
        
        
            RETURN vString;
    END;
    $$ 
    LANGUAGE PLPGSQL ;`

    var aux2 = `CREATE OR REPLACE FUNCTION genJsonData(v_schemaName varchar) --function that generates a json with the information from the database
    RETURNS Json
    SECURITY DEFINER
    AS 
    $$
    DECLARE
      curTablas	REFCURSOR; --cursor for traversing tables
      curColumnas REFCURSOR; --cursor to scroll through table columns
      curConstraints 	REFCURSOR; --cursor to scroll through the table constraints
      curElimComa REFCURSOR; --cursor to remove extra commas
      vJsonR		varchar; --genral string that turns into json
      vNomColumna varchar; --name of the attribute of the table
      vNomTabla varchar; --name of the table
      vNomConstraint varchar; --name of the constraint
      vTipoDatos varchar; --type of the attribute column
      --variables cursor constraint
      tabl_esquema varchar; --name of the table the constraint belongs to
      const_nomb varchar; --name of the constraint name column
      nom_tabl varchar; --name of the constraint table
      col_nomb varchar; --name of the constraint attribute 
      forgn_esquema_tabla varchar; --name of the foreign table schema
      forgn_nombre_tabla varchar; --name of the foreign table name
      forgn_nombre_columna varchar; --name of the foreign atrribute name
      constr_type varchar; --name of the constraint type
      
        
     
    BEGIN
    
            
                vJsonR:= '{' ||'"schemaName": ' || '"' ||v_schemaName ||'"'|| ',' || '"tables": ' || '[';
    
                    OPEN curTablas FOR  
                    SELECT table_name 
                    FROM information_schema.tables
                    WHERE table_type='BASE TABLE' 
                    AND table_schema=v_schemaName;
                FETCH curTablas INTO vNomTabla;
                LOOP --begin to loop the tables of the schema
                        IF FOUND THEN --add the table to the list of tables
    
                            vJsonR := vJsonR || '{' || '"tableName": ' ||'"'|| vNomTabla ||'"'|| ','|| '"atributes": [';
                                    OPEN curColumnas FOR 
                                            SELECT column_name, data_type 
                                            FROM information_Schema.columns
                                            WHERE table_schema=v_schemaName AND table_name=vNomTabla;
                                    FETCH curColumnas INTO vNomColumna,vTipoDatos;
                                    LOOP --loop the attributes
                                    IF FOUND THEN --add the attribute name and type to the list
                                        vJsonR:= vJsonR || '{' || '"columnName": ' ||'"'|| vNomColumna ||'"'|| ',' || '"dataType": ' ||'"' || vTipoDatos || '"' || '},';
                                    ELSE
                                        EXIT;
                                    END IF;
                                    FETCH curColumnas INTO vNomColumna,vTipoDatos;
                                    END LOOP ;
                                    CLOSE curColumnas;
                                    IF (RIGHT(vJsonR,1) = ',') THEN -- asks if the last character is a comma then extracts it.
                                        OPEN curElimComa FOR
                                            SELECT substr(vJsonR,1,length(vJsonR)-1);
                                        FETCH curElimComa INTO vJsonR;
                                        CLOSE curElimComa;
                                    END IF;
                                    vJsonR := vJsonR || '],';
                                    vJsonR := vJsonR || '"constraints": [' ;
                                    OPEN curConstraints FOR
                                            SELECT
                                                 tc.table_schema, 
                                                 tc.constraint_name, 
                                                 tc.table_name, 
                                                 kcu.column_name, 
                                                 ccu.table_schema AS foreign_table_schema,
                                                 ccu.table_name AS foreign_table_name,
                                                 ccu.column_name AS foreign_column_name,
                                                 tc.constraint_type
                                            FROM 
                                                 information_schema.table_constraints AS tc 
                                                 JOIN information_schema.key_column_usage AS kcu
                                                 ON tc.constraint_name = kcu.constraint_name
                                                 AND tc.table_schema = kcu.table_schema
                                                 JOIN information_schema.constraint_column_usage AS ccu
                                                 ON ccu.constraint_name = tc.constraint_name
                                                 AND ccu.table_schema = tc.table_schema
                                                 WHERE  tc.table_name=vNomTabla;
    
                                    FETCH curConstraints INTO tabl_esquema, const_nomb, nom_tabl,col_nomb,forgn_esquema_tabla,forgn_nombre_tabla, forgn_nombre_columna, constr_type;
                                    LOOP
                                    IF FOUND THEN --add the constraint to the list of constraints
    
                                        vJsonR:= vJsonR || '{' || '"constraintType": ' ||'"'|| constr_type || '",' || '"constraintName": ' || '"' ||const_nomb ||'",';
                                        vJsonR:= vJsonR ||'"tableSchema": '|| '"'|| tabl_esquema ||'",'|| '"tableName": ' ||'"'|| nom_tabl || '",' || '"columnName": ' || '"' ||col_nomb||'",';
                                        vJsonR:= vJsonR || '"foreignTableSchema": ' ||'"'|| forgn_esquema_tabla ||'",'|| '"foreignTableName":' ||'"'|| forgn_nombre_tabla ||'",';
                                        vJsonR:= vJsonR || '"foreignColumnName":' ||'"'|| forgn_nombre_columna ||'"' || '},';
    
    
                                    ELSE
                                        EXIT;
                                    END IF;
                                    FETCH curConstraints INTO tabl_esquema, const_nomb, nom_tabl,col_nomb,forgn_esquema_tabla,forgn_nombre_tabla,forgn_nombre_columna, constr_type;
                                    END LOOP;
                                    CLOSE curConstraints;
                                    IF (RIGHT(vJsonR,1) = ',') THEN -- asks if the last character is a comma then extracts it.
                                        OPEN curElimComa FOR
                                            SELECT substr(vJsonR,1,length(vJsonR)-1);
                                        FETCH curElimComa INTO vJsonR;
                                        CLOSE curElimComa;
                                    END IF;
                                    vJsonR := vJsonR || ']},';
                                    
    
                        ELSE
                            EXIT;
                        END IF;
    
                        FETCH curTablas INTO vNomTabla;
                END LOOP ;
                CLOSE curTablas ;
                IF (RIGHT(vJsonR,1) = ',') THEN -- asks if the last character is a comma then extracts it.
                   OPEN curElimComa FOR
                   SELECT substr(vJsonR,1,length(vJsonR)-1);
                   FETCH curElimComa INTO vJsonR;
                   CLOSE curElimComa;
                END IF;
                vJsonR := vJsonR || ']}';
    
        RETURN to_json(vJsonR::text); --converts the varchar to json and returns it
                 
    END;
    $$ 
    LANGUAGE PLPGSQL ;`

    var aux3 = `CREATE OR REPLACE FUNCTION insert_diagram(diagrama varchar, nombre_usr varchar(15)) --function to insert records in the schema table
    RETURNS BOOL
    SECURITY DEFINER
    AS
    $$
    BEGIN 
    
        Insert into PlantDiagrams (diagrama_link , nombre_usuario ) VALUES --insert the record
                    (diagrama, nombre_usr);
    
        RETURN TRUE; 
    
    END;
    $$
    LANGUAGE PLPGSQL ;`

    var aux4 = `CREATE OR REPLACE FUNCTION generate_diagram_table() --function that allows to create the table where the schemas are stored.
    RETURNS BOOL
    SECURITY DEFINER
    AS
    $$
    BEGIN 
    
        CREATE TABLE IF NOT EXISTS PlantDiagrams ( --create the tables if not exists
            id serial not null,
            diagrama_link varchar not null,
            nombre_usuario varchar(15) not null,
            CONSTRAINT PK_PlantDiagrams
                PRIMARY KEY (id)
        );
    
        RETURN TRUE; 
    
    END;
    $$
    LANGUAGE PLPGSQL ;`

    var aux5 = `CREATE OR REPLACE FUNCTION delete_diagram(idD int, usuario varchar ) --function that allows deleting a record in the schema table
    RETURNS BOOL
    SECURITY DEFINER
    AS
    $$
    BEGIN 
    
        DELETE FROM PlantDiagrams WHERE --delete the record where the id of the schema and the name of the user are the same 
            id = idD AND  nombre_usuario = usuario; 
    
        RETURN TRUE; 
    
    END;
    $$
    LANGUAGE PLPGSQL ;`
    
    // run the queries pool
    const response = await pool.query(aux)
    const response2 = await pool.query(aux2)
    const response4 = await pool.query(aux4)
    const response3 = await pool.query(aux3)
    const response5 = await pool.query(aux5)
    console.log(response, response2, response4, response3, response5 );
    pool.end(); 
}

/**
 * function that make the connection to the database
 * params (req) is from the frontend
 * return the response
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
        loadData( pool )
        .then( result  => {
            console.log(result);
        });
    } catch( error ) {
        console.log( "Error de conexion", error.message );
    }
}