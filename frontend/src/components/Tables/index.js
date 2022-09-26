import "./Tables.css"
import { Link, useLocation } from "react-router-dom"
import { TablesOptions } from "../TablesOptions";


function Tables() {
    const location = useLocation();
    const { allSchemas, filteredSchemas } = location.state
    const tablesState = filteredSchemas


    return(
        <section> 
            <div className="tables">
                {
                    
                    allSchemas.filter( schema =>
                        filteredSchemas.map( e => e.schemaName ).includes(schema.schemaName) )
                    .map( schema => (
                        <div className="table">
                            <h3 className="schema-name">{schema.schemaName}</h3>
                            {
                                schema.tables.map( table =>    
                                    <TablesOptions  tablesState={tablesState} schemaList={ allSchemas } tableName={ table.tableName } schemaName={ schema.schemaName }/>
                                )
                            }
                        </div>
                    ) )

                }

                <div className="table-footer">
                    <Link to="/attributes" className="footer-btn" state={ {tablesState: tablesState} } >Next</Link>
                </div>
            </div>
        </section>
    );
}

export { Tables };