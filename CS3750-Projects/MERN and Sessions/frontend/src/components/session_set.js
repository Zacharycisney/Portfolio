import React, { useState, useEffect } from "react";

export default function SessionSet() {
    const [status, setStatus] = useState("");

    useEffect(() => {
        async function run() {
            const response = await fetch(`http://localhost:5000/session_set`,
                {
                method: "GET",
                credentials: 'include' // if a cookie is found then it will be presented to the backend
                // if it is missing every fetch call would need to have an include tacked on
                }
            );
            if (!response.ok){
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const statusResponse = await response.json();
            setStatus(statusResponse.status); // connecting to session.js in the backend
        }
        run();
        return;
    }, [])

    return (
        <div>
            <h3> Set Session </h3>
            <p>{status}</p>
        </div>
    )
}
