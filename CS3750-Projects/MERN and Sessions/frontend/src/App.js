import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Records from "./components/records";
import Registration from "./components/registration";
import Summary from "./components/summary";
import Balances from "./components/balances";
import SessionSet from "./components/session_set";
import SessionGet from "./components/session_get";
import SessionDelete from "./components/session_delete";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/records" element={<Records />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/balances" element={<Balances />} />
        <Route path="/session_set" element={<SessionSet />} />
        <Route path="/session_get" element={<SessionGet />} />
        <Route path="/session_delete" element={<SessionDelete />} />
      </Routes>
    </div>
  );
}

export default App;
