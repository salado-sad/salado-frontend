// App.js
import React, { useState } from "react";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      {showLogin ? (
        <Login onSwitch={() => setShowLogin(false)} />
      ) : (
        <Signup onSwitch={() => setShowLogin(true)} />
      )}
    </div>
  );
}

export default App;