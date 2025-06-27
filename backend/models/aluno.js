const mongoose = require('mongoose');

const AlunoScheme = new mongoose.Schema({
  nome: String,
  apelido: String,
  idade: Number,
  anoCurricular: Number,
  curso: Number
});

module.exports = mongoose.model('Aluno', AlunoScheme);
