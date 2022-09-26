import React from "react";
import "./SchemasOptions.css"

function SchemasOptions( props ) {

    const handleCheckboxs = ( { target } ) => {

        if( target.checked ) {
            props.setSchemaList( prev => [ ...prev, {
                schemaName: target.value,
                tables: []
            } ] )
        } else {
            props.setSchemaList( prev => prev.filter( (item) => item.schemaName !== target.value ) )
        } 
    }


    return(
        <>
            <input type="checkbox" id={props.schemaInformation} value={props.schemaInformation} onChange={handleCheckboxs} ></input> 
            <label className="option-label" for={props.schemaInformation}>{props.schemaInformation}</label>
        </>
    );
}

export { SchemasOptions };