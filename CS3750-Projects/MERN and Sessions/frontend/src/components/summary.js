import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Summary() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch("http://localhost:5000/current_user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    const data = await response.json();
                    if (data.error === "Not authenticated") {
                        navigate("/");
                    }
                    throw new Error(data.error);
                }

                const data = await response.json();
                console.log("Fetched user data:", data);  // Log fetched user data
                setUser(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        fetchUser();
    }, [navigate]);

    async function handleLogout() {
        try {
            await fetch("http://localhost:5000/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });

            setUser(null);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h3>Summary</h3>
            <div>
                <p>First Name: {user.firstName}</p>
                <p>Last Name: {user.lastName}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>Role: {user.role}</p>
                <p>Saving: {user.saving}</p>
                <p>Checking: {user.checking}</p>
            </div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}