import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        if (!form.email || !form.password) {
            window.alert("All fields must be filled.");
            return;
        }

        const person = { ...form };
        try {
            const response = await fetch("http://localhost:5000/record/find", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(person),
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                if (data.error === "User does not exist") {
                    window.alert("Login and password do not match");
                    return;
                }
            }

            setForm({ email: "", password: "" });
            navigate("/summary");

        } catch (error) {
            window.alert(error);
            return;
        };
    }

    return (
        <div>
            <h3>Login</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Email: </label>
                    <input
                        type="text"
                        id="email"
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value })}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="text"
                        id="password"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                    />
                </div>
                <br />
                <div>
                    <input type="submit" value="Login" />
                </div>
            </form>
        </div>
    )
}