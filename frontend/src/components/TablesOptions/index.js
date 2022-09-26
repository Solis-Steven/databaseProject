
function TablesOptions( props ) {
    const schemas = props.tablesState   

    const handleCheckboxs = ( { target } ) => {

        if( target.checked ) {
            let newTable = props.schemaList.filter( schema => schema.schemaName === props.schemaName )
            newTable = newTable.map( tables => tables.tables.filter( table => table.tableName === props.tableName ) )[0][0]

            schemas.forEach( schema => {
                if( schema.schemaName === props.schemaName ) {
                    schema.tables.push( newTable )                }
            } );
        } else {
            schemas.forEach( schema => {
                if( schema.schemaName === props.schemaName ) {
                    schema.tables = schema.tables.filter( table => table.tableName !== props.tableName )
                }
            } );
        }
    }   
    

    return(
        <>
            <input type="checkbox" id={`${props.schemaName}.${props.tableName}`} value={props.tableName} onChange={handleCheckboxs} ></input> 
            <label className="option-label" for={`${props.schemaName}.${props.tableName}`}>{props.tableName}</label>
        </>
    );
}

export { TablesOptions };