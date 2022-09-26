import React from "react" 
import {encode} from 'plantuml-encoder'

// var plantEncoder = require("plantuml-encoder")

// const test = `
// @startuml


// class poo.planetas {

//     +nombre: String
//     +tamaño: int
    
// }

// class admi.roles {

//     +nombre: String
//     +tamaño: int
    
// }

// @enduml

// `


export const PlantUml = (objList) => {
    let script = "@startuml\n"
    for (let i = 0; i < objList.length; i++){
        for(let x = 0; x < objList[i].tables.length; x++){
            script += `class ${objList[i].schemaName}.${objList[i].tables[x].tableName}{\n`
    
            for(let y = 0; y < objList[i].tables[x].atributes.length; y++){
                script += `+${objList[i].tables[x].atributes[y].columnName}: ${objList[i].tables[x].atributes[y].dataType}\n`
            }
            script += "}\n"  
        }
    }
    script += "@enduml"
    var encoded = encode(script)
    var endpoint = ('https://www.plantuml.com/plantuml/img/' + encoded)    
    return endpoint;
}

// [
//     {
//         schemaName: "public",
//         tables: [
//             {
//                 tableName: "papas",
//                 atributes: [
//                     {
//                         columnName: "peso",
//                         dataType: "varchar"
//                     }
//                 ]
//             }
//         ]
//     }
// ]