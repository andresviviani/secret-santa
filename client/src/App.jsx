import { useState, useEffect } from "react";
import UserRegistration from "./components/UserRegistration";
import PinLogin from "./components/PinLogin";
import AdminPanel from "./components/AdminPanel";
import XmasBackground from "./components/XmasBackground";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [utenti, setUtenti] = useState([]);
  const [config, setConfig] = useState(null);
  const [showRecipient, setShowRecipient] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/config")
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:3001/utenti")
      .then((res) => res.json())
      .then((data) => setUtenti(data))
      .catch((err) => console.error(err));
  }, []);

  if (!config) return <p>Caricamento...</p>;

  return (
    <Router>
      <XmasBackground />
      <Routes>
        <Route
          path="/"
          element={
            config.registrazioneAttiva ? (
              <UserRegistration setUtenti={setUtenti} />
            ) : (
              <PinLogin utenti={utenti} setShowRecipient={setShowRecipient} />
            )
          }
        />
        <Route
          path="/admin"
          element={<AdminPanel utenti={utenti} setUtenti={setUtenti} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
