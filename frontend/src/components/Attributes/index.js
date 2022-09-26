import "./Attributes.css"
import { Link, useLocation } from "react-router-dom"
import { AttributesOptions } from "../AttributesOptions";
import _ from 'lodash'

function Attributes(  ) {
    const location = useLocation();
    const { tablesState} = location.state;
    const newSchemaState = _.cloneDeep(tablesState)
 
    newSchemaState.forEach( schema => {
        schema.tables.forEach( table => {
            table.atributes = []
        } )
    });

    return(
        <section >
            <div className="attributes">

                {
                    
                    tablesState.map( schema => (
                        schema.tables.map( table => (
                            <div className="attribute">
                                <h3 className="schema-table-name">{`${schema.schemaName}.${table.tableName}`}</h3>
                                    {
                                        table.atributes.map( artribute => (
                                            <AttributesOptions allSchema={tablesState} tableName={table.tableName} schemaName={schema.schemaName} tablesState={newSchemaState} attribute={artribute} />   
                                        ) )
                                    }
                            </div>
                         ) )
                    ) )
                    
                }

                <div className="attributes-footer">
                    <Link to="/" className="footer-btn" state={{endSchema: newSchemaState}}>Generate Diagram</Link>
                </div>

            </div>
        </section>
    );
}

export { Attributes };