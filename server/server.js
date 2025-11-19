const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_FILE = "./db.json";

// Funzione helper per leggere db.json
const readDB = () => {
  const data = fs.readFileSync(DB_FILE, "utf8");
  return JSON.parse(data || '{"utenti":[], "config":{"registrazioneAttiva":true}}');
};

// Funzione helper per scrivere db.json
const writeDB = (db) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
};

// =================== UTENTI ===================

// Leggi tutti gli utenti
app.get("/utenti", (req, res) => {
  try {
    const db = readDB();
    res.json(db.utenti);
  } catch (err) {
    res.status(500).json({ error: "Errore lettura file utenti" });
  }
});

// Aggiungi un nuovo utente
app.post("/utenti", (req, res) => {
  const nuovoUtente = req.body;
  if (!nuovoUtente.nome) return res.status(400).json({ error: "Nome richiesto" });

  try {
    const db = readDB();
    const maxId = db.utenti.reduce((acc, u) => (u.id > acc ? u.id : acc), 0);
    nuovoUtente.id = maxId + 1;
    db.utenti.push(nuovoUtente);
    writeDB(db);
    res.status(201).json(nuovoUtente);
  } catch {
    res.status(500).json({ error: "Errore scrittura file" });
  }
});

// Aggiorna un utente
app.put("/utenti/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const nuovoUtente = req.body;

  try {
    const db = readDB();
    const index = db.utenti.findIndex((u) => u.id === id);
    if (index === -1) return res.status(404).json({ error: "Utente non trovato" });
    db.utenti[index] = nuovoUtente;
    writeDB(db);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Errore aggiornamento utente" });
  }
});

// Elimina un utente
app.delete("/utenti/:id", (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const db = readDB();
    db.utenti = db.utenti.filter((u) => u.id !== id);
    writeDB(db);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Errore eliminazione utente" });
  }
});

// =================== CONFIG ===================

// Leggi configurazione
app.get("/config", (req, res) => {
  try {
    const db = readDB();
    res.json(db.config);
  } catch {
    res.status(500).json({ error: "Errore lettura configurazione" });
  }
});

// Aggiorna configurazione
app.put("/config", (req, res) => {
  try {
    const db = readDB();
    db.config = req.body;
    writeDB(db);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Errore aggiornamento configurazione" });
  }
});

app.listen(3001, () => console.log("✅ Server avviato su http://localhost:3001"));
