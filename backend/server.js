// backend/server.js
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

// Importo i file delle route per autenticazione e post
const authRoutes = require('./routes/authentication.js');
const mainRoutes = require('./routes/main.js');

// Middleware per il parsing del corpo JSON con limite massimo di 10 mb
app.use(express.json({ limit: '10mb' }));

// Middleware per il parsing del corpo URL encoded con limite massimo di 10 mb
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Associo le route per autenticazione e post alle rispettive URL
app.use('/', authRoutes);
app.use('/', mainRoutes);

// Aggiungi una route di base
app.get('/', (req, res) => {
  res.send('Home Page');
});

app.listen(8080, () => {
  console.log(`Server started on port 8080`);
});