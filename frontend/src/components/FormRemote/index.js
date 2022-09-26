import React, { useEffect } from "react";
import "./FormRemote.css"
import { Link, useNavigate } from "react-router-dom"

function FormRemote() {
    const [ serverConnectionState, setServerConnectionState ] = React.useState("");
    const [ databaseState, setDatabaseState ] = React.useState("");
    const [ portState, setPorState ] = React.useState("");
    const [ userState, setUserState ] = React.useState("");
    const [ passwordState, setPasswordState ] = React.useState("");
    const myForm = React.useRef( null );
    const btnSend = React.useRef( null );
    const navigate = useNavigate();

    const serverConnectionChanges = (e) => {
        setServerConnectionState(e.target.value); 
    }

    const databaseChanges = (e) => {
        setDatabaseState(e.target.value); 
    }

    const portChanges = (e) => {
        setPorState(e.target.value); 
    }

    const userNameChanges = (e) => {
        setUserState(e.target.value); 
    }
 
    const passwordChanges = (e) => {
        setPasswordState(e.target.value); 
    }
 
    const onSubmit = (e) => {
        e.preventDefault();

        const loadDatabaseInformation = () => {
            try {
                const connectionValues = {
                    serverConnection: serverConnectionState,
                    databaseName: databaseState,
                    port: portState,
                    user: userState,
                    password: passwordState 
                }
                localStorage.setItem("config", JSON.stringify(connectionValues))
                fetch("http://localhost:3000/userLogin", {
                    method: "POST",
                    body: JSON.stringify(connectionValues),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then( res => res.json())
                .then( data => navigate( "/menu", {state: data} ) );

            } catch (error) {
                console.log("Error en frontend", error)
            }
        }

        loadDatabaseInformation()

    }
 
    useEffect( () => {
        if (serverConnectionState != "" && databaseState != "" && portState != "" && userState != "" && passwordState != "") {
            btnSend.current.classList.remove("formulario-button__false__remote");
            btnSend.current.classList.add("formulario-button__true__remote");
        } else {
            btnSend.current.classList.remove("formulario-button__true__remote");
            btnSend.current.classList.add("formulario-button__false__remote");
        }
    }, [ userState, passwordState ] );


    return(
        <section className="container">
            <div className="prueba">
            
                <form ref={myForm} className="form" onSubmit={onSubmit}>
                <h2 className="title__remote">Database Remote Connections</h2>
                    <label className="formulario-label__remote">Server to connect</label>
                    <input 
                        type="text"
                        className="formulario-input__remote" 
                        name="serverConnection"
                        value={serverConnectionState}
                        onChange={serverConnectionChanges}
                        placeholder="Server connection"
                        required>
                    </input>

                    <label className="formulario-label__remote">Database to connect</label>
                    <input 
                        type="text" 
                        className="formulario-input__remote" 
                        name="databaseName"
                        value={databaseState}
                        onChange={databaseChanges}
                        placeholder="Database name"
                        required>
                    </input>

                    <label className="formulario-label__remote">Port to connect</label>
                    <input 
                        type="text" 
                        className="formulario-input__remote" 
                        name="port"
                        value={portState}
                        onChange={portChanges}
                        placeholder="Port"
                        required>
                    </input>

                    <label className="formulario-label__remote">User name</label>
                    <input 
                        type="text" 
                        className="formulario-input__remote" 
                        name="user"
                        value={userState}
                        onChange={userNameChanges}
                        placeholder="User"
                        required>
                    </input>

                    <label className="formulario-label__remote">User password</label>
                    <input 
                        type="password" 
                        className="formulario-input__remote" 
                        placeholder="Password"
                        name="password"
                        value={passwordState}
                        onChange={passwordChanges}
                        required>
                    </input>
                    
                    <input 
                        ref={btnSend}
                        type="submit" 
                        className={`formulario-button__remote formulario-button__false__remote`}    
                        value="Connect">
                    </input>

                    <Link to="/" className="formulario-btn-cambio__remote">Setup database</Link>
                </form>
            </div>
        </section>
    );
}

export { FormRemote };