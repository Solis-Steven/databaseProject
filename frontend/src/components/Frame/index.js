import React, { useEffect, useState } from "react";
import "./Frame.css"
import { Link, useLocation } from "react-router-dom"
import { SchemasOptions } from "../SchemasOptions";

function Frame( ) {

    const location = useLocation();
    const [ schemaList, setSchemaList ] = useState( [] );

    useEffect( () => {
        console.log(schemaList)
    }, [ schemaList ] );

    return(
        <section >
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