// Importamos la conexión con nuestra base de datos y las consultas
import { getConnection, queries } from "../database/index.js"


export const loadData = async ( pool ) => {

    var aux = `CREATE OR REPLACE FUNCTION genSchemaNames() 
    RETURNS varchar
    SECURITY DEFINER
    AS 
    $$
    DECLARE
        curEsquemas REFCURSOR;
        v_schemaName varchar;
        vString        varchar;
    
        curElimComa REFCURSOR;
        
        
    BEGIN
            vString := '';
            OPEN curEsquemas FOR
            SELECT n.nspname 
            FROM pg_namespace n
            WHERE n.nspname != 'pg_toast' AND n.nspname != 'pg_catalog' AND n.nspname != 'pg_stadistic' AND n.nspname != 'information_schema';
            FETCH curEsquemas INTO v_schemaName;
            LOOP
                IF FOUND THEN
                        vString:= vString|| v_schemaName || ',';
                ELSE
                    EXIT;
                END IF;
            FETCH curEsquemas INTO v_schemaName;
            END LOOP;
            CLOSE curEsquemas;
            IF (RIGHT(vString,1) = ',') THEN
                OPEN curElimComa FOR
                  SELECT substr(vString,1,length(vString)-1);
            FETCH curElimComa INTO vString;
            CLOSE curElimComa;
            END IF;
        
        
            RETURN vString;
    END;
    $$ 
    LANGUAGE PLPGSQL ;`

    var aux2 = `CREATE OR REPLACE FUNCTION genJsonData(v_schemaName varchar) 
    RETURNS Json
    SECURITY DEFINER
    AS 
    $$
    DECLARE
      curTablas	REFCURSOR;
      curColumnas REFCURSOR;
      curConstraints 	REFCURSOR;
      curElimComa REFCURSOR;
      curEsquemas REFCURSOR;
      vJsonR		varchar;
      vLColum 	varchar;
      vNomColumna varchar;
      vNomTabla varchar;
      vNomConstraint varchar;
      vTipoDatos varchar;
      --variables cursor constraint
      tabl_esquema varchar;
      const_nomb varchar;
      nom_tabl varchar;
      col_nomb varchar;
      forgn_esquema_tabla varchar;
      forgn_nombre_tabla varchar;
      forgn_nombre_columna varchar;
      constr_type varchar;
      
      
      
    
      
     
    BEGIN
    
            
                vJsonR:= '{' ||'"schemaName": ' || '"' ||v_schemaName ||'"'|| ',' || '"tables": ' || '[';
    
                    OPEN curTablas FOR 
                    SELECT table_name 
                    FROM information_schema.tables
                    WHERE table_type='BASE TABLE' 
                    AND table_schema=v_schemaName;
                FETCH curTablas INTO vNomTabla;
                LOOP
                        IF FOUND THEN
    
                            vJsonR := vJsonR || '{' || '"tableName": ' ||'"'|| vNomTabla ||'"'|| ','|| '"atributes": [';
                                    OPEN curColumnas FOR 
                                            SELECT column_name, data_type 
                                            FROM information_Schema.columns
                                            WHERE table_schema=v_schemaName AND table_name=vNomTabla;
                                    FETCH curColumnas INTO vNomColumna,vTipoDatos;
                                    LOOP
                                    IF FOUND THEN
                                        vJsonR:= vJsonR || '{' || '"columnName": ' ||'"'|| vNomColumna ||'"'|| ',' || '"dataType": ' ||'"' || vTipoDatos || '"' || '},';
                                    ELSE
                                        EXIT;
                                    END IF;
                                    FETCH curColumnas INTO vNomColumna,vTipoDatos;
                                    END LOOP ;
                                    CLOSE curColumnas;
                                    IF (RIGHT(vJsonR,1) = ',') THEN
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
                                    IF FOUND THEN
    
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
                                    IF (RIGHT(vJsonR,1) = ',') THEN
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
                IF (RIGHT(vJsonR,1) = ',') THEN
                   OPEN curElimComa FOR
                   SELECT substr(vJsonR,1,length(vJsonR)-1);
                   FETCH curElimComa INTO vJsonR;
                   CLOSE curElimComa;
                END IF;
                vJsonR := vJsonR || ']}';
    
        RETURN to_json(vJsonR::text);
                 
    END;
    $$ 
    LANGUAGE PLPGSQL ;`

    var aux3 = `CREATE OR REPLACE FUNCTION insert_diagram(diagrama varchar, nombre_usr varchar(15))
    RETURNS BOOL
    SECURITY DEFINER
    AS
    $$
    BEGIN 
    
        Insert into PlantDiagrams (diagrama_link , nombre_usuario ) VALUES
                    (diagrama, nombre_usr);
    
        RETURN TRUE; 
    
    END;
    $$
    LANGUAGE PLPGSQL ;`

    var aux4 = `CREATE OR REPLACE FUNCTION generate_diagram_table()
    RETURNS BOOL
    SECURITY DEFINER
    AS
    $$
    BEGIN 
    
        CREATE TABLE IF NOT EXISTS PlantDiagrams (
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

    var aux5 = `CREATE OR REPLACE FUNCTION delete_diagram(idD int, usuario varchar )
    RETURNS BOOL
    SECURITY DEFINER
    AS
    $$
    BEGIN 
    
        DELETE FROM PlantDiagrams WHERE
            id = idD AND  nombre_usuario = usuario; 
    
        RETURN TRUE; 
    
    END;
    $$
    LANGUAGE PLPGSQL ;`
    
    const response = await pool.query(aux)
    const response2 = await pool.query(aux2)
    const response3 = await pool.query(aux3)
    const response4 = await pool.query(aux4)
    const response5 = await pool.query(aux5)
    console.log(response, response2, response3, response4, response5 );
    pool.end(); 
}


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