import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {PlantUml} from '../../sendPlantuml'
import "./MakeDiagram.css"

function MakeDiagram() {
    const location = useLocation();
    const diagram = PlantUml(location.state.endSchema);
    const navigate = useNavigate();
    
    const onClick = (info) =>  {
        try {
            fetch("http://localhost:3000/makediagram", {
                method: "POST",
                body: JSON.stringify(info),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then( res => res.json())
            .then( data => navigate( "/menu", {state: data} ) );

            navigate("/menu");

        } catch (error) {
            console.log("Error en frontend", error)
        }
    }

    const user = localStorage.getItem("config")
    const info = {
        user: JSON.parse(user),
        diagram: diagram
    }

    return(
        <>
            <img src={diagram} className="img" />
            <input type="button" value="Save" onClick={onClick(info)} className="save"></input>
        </>
    );
}

export { MakeDiagram };