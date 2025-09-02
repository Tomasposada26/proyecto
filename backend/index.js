require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const newsletterRoutes = require('./routes/newsletter');
const errorHandler = require('./middlewares/errorHandler');
const recoveryRoutes = require('./routes/recovery');
const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuario');
const reglaRoutes = require('./routes/regla');
const interesadoRoutes = require('./routes/interesado');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Conectar a la base de datos
connectDB();

app.use('/api', newsletterRoutes);
app.use('/api', recoveryRoutes);
app.use('/api', authRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', reglaRoutes);
app.use('/api', interesadoRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend de Aura escuchando en puerto ${PORT} `);
});