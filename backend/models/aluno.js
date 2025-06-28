const mongoose = require('mongoose');

const AlunoScheme = new mongoose.Schema({
  alunos: [{
    nome: String,
    apelido: String,
    idade: String,
    anoCurricular: String,
    curso: String,
    id: String
  }]
});

module.exports = mongoose.model('Aluno', AlunoScheme);
