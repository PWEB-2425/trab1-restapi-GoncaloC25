// API real a ser implementada

const express = require('express');
const cors = require('cors');
const connectDB = require('./config');
const alunoRoute = require('./routes/alunoRoutes');
const cursoRoute = require('./routes/cursoRoutes');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/alunos', alunoRoute); 
app.use('/cursos', cursoRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));