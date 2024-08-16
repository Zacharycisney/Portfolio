import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Registration() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
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

        if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
            window.alert("All fields must be filled.");
            return;
        }

        const newPerson = { ...form };

        try {
            const response = await fetch("http://localhost:5000/record/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPerson),
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                if (data.error === "Email already exists") {
                    window.alert("Email already exists");
                    return;
                }
            }

            setForm({ firstName: "", lastName: "", email: "", phone: "", password: "" });
            navigate("/summary");

        } catch (error) {
            window.alert(error);
            return;
        };
    }

    return (
        <div>
            <h3>Registration</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label>First Name: </label>
                    <input
                        type="text"
                        id="firstName"
                        value={form.firstName}
                        onChange={(e) => updateForm({ firstName: e.target.value })}
                    />
                </div>
                <div>
                    <label>Last Name: </label>
                    <input
                        type="text"
                        id="lastName"
                        value={form.lastName}
                        onChange={(e) => updateForm({ lastName: e.target.value })}
                    />
                </div>
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
                    <label>Phone: </label>
                    <input
                        type="text"
                        id="phone"
                        value={form.phone}
                        onChange={(e) => updateForm({ phone: e.target.value })}
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
                    <input type="submit" value="Register" />
                </div>
            </form>
        </div>
    )
}