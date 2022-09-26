import React, { useEffect, useState } from "react";
import "./Frame.css"
import { Link, useLocation } from "react-router-dom"
import { SchemasOptions } from "../SchemasOptions";


const db = [
    {
        schemaName: 'public',
        tables: [
            {
                tableName: "planetas",
                attributes: [
                    {
                        columnName: "color",
                        dataType: "varchar"
                    },

                    {
                        columnName: "antiguedad",
                        dataType: "int"
                    }
                ]
            },
            {
                tableName: "nebulosas",
                attributes: [
                    {
                        columnName: "color",
                        dataType: "varchar"
                    }
                ]
            }
        ]
    },

    {
        schemaName: 'poo',
        tables: [
            
        ]
    }
]

function Frame( ) {

    const location = useLocation();
    const [ schemaList, setSchemaList ] = useState( [] );

    useEffect( () => {
        console.log(schemaList)
    }, [ schemaList ] );

    return(
        <section className="frame-container">
            <div className="frame">

                <div className="grid-options">
                    {
                        location.state.map( schema => (
                            <div className="options">
                                <SchemasOptions setSchemaList={setSchemaList} schemaInformation={ schema.schemaName } />
                            </div>
                        ) )
                    }

                </div>

                <div className="frame-footer">
                    <Link  to="/tables" className="footer-btn" state={ {allSchemas: location.state, filteredSchemas: schemaList} } >Next</Link>
                </div>
            </div>
        </section>
    );
}

export { Frame };