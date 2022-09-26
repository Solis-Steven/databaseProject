import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Menu.css"

function Menu() {
    const location = useLocation();

    return (
        <main>
            <div className="manu-frame">
                <div className="grid-menu">
                    <Link className="menu-options" to="/" >Delete diagrams</Link>
                    <Link className="menu-options" to="/" >Show diagrams</Link>
                    <Link className="menu-options" to="/schema" state={{location: location.state}} >Make diagrams</Link>
                </div>
            </div>
        </main>
    )
}

export { Menu };