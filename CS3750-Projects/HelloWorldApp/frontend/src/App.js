import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HelloWorld from './components/HelloWorld';

const App = () => {
  const [username, setUsername] = useState('');

  return (
    <div>
      <Routes>
        <Route path="/" element={<HelloWorld />} />
      </Routes>
    </div>
  );
};

export default App;