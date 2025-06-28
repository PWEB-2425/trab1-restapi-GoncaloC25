const mongoose = require('mongoose');

const AlunoScheme = new mongoose.Schema({
  id: String,
  nome: String,
  apelido: String,
  idade: Number,
  anoCurricular: Number,
  curso: Number
});

module.exports = mongoose.model('Aluno', AlunoScheme);
