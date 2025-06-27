const Aluno = require('../models/aluno');

exports.getAll = async (req, res) => {
  const alunos = await Aluno.find();

  res.json(alunos);
};

exports.getById = async (req, res) => {
  const aluno = await Aluno.findById(req.params.id);
  if (!aluno) return res.status(404).json({ msg: 'Aluno não encontrado' });

  res.json(aluno);
};

exports.create = async (req, res) => {
  const novoAluno = new Aluno(req.body);
  await novoAluno.save();

  res.status(201).json(novoAluno);
};

exports.update = async (req, res) => {
  const AlunoAtualizado = await Aluno.findByIdAndUpdate(req.params.id, req.body, { new: true });

  res.json(AlunoAtualizado);
};

exports.delete = async (req, res) => {
  await Aluno.findByIdAndDelete(req.params.id);
  
  res.json({ msg: 'Aluno removido' });
};
