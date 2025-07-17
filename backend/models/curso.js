const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  nomeDoCurso: String,
  id: Number
});

module.exports = mongoose.model('Curso', cursoSchema);
