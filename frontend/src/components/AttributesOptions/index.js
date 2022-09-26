
function AttributesOptions( props ) {
    const tablesState = props.tablesState;

    const handleCheckboxs = ( { target } ) => {

        if( target.checked ) {
            let table = props.allSchema.filter( schema => schema.schemaName === props.schemaName )
            table = table.map( tables => tables.tables.filter( table => table.tableName === props.tableName ) )[0][0]

            let attribute = table.atributes.filter( atribute => atribute.columnName === props.attribute.columnName)[0]
            

            tablesState.forEach( schema => {
                if( schema.schemaName === props.schemaName ) {
                    schema.tables.forEach( table => {
                        if(table.tableName === props.tableName) {
                            table.atributes.push( attribute )
                        }
                    } )
                }
            })
        } else {
            tablesState.forEach( schema => {
                if( schema.schemaName === props.schemaName ) {
                    schema.tables.forEach( table => {
                        if(table.tableName === props.tableName) {
                            table.atributes = table.atributes.filter( attribute => attribute.columnName !== props.attribute.columnName )
                            console.log(table.atributes)
                        }
                    } )
                }
            })
        }
    }   
    

    return(
        <>
            <input type="checkbox" id={`${props.schemaName}.${props.tableName}.${props.attribute.columnName}`} value={props.attribute.columnName} onChange={handleCheckboxs} ></input> 
            <label className="option-label" for={`${props.schemaName}.${props.tableName}.${props.attribute.columnName}`}>{`${props.attribute.columnName} - ${props.attribute.dataType}`}</label>
        </>
    );
}

export { AttributesOptions };