const Aluno = require('../models/aluno');

exports.getAll = async (req, res) => {
  const alunos = await Aluno.find();

  res.json(alunos);
};

exports.getById = async (req, res) => {
  const aluno = await Aluno.findOne({ id: req.params.id });
  if (!aluno) return res.status(404).json({ msg: 'Aluno não encontrado' });

  res.json(aluno);
};

exports.create = async (req, res) => {
  try {
    // Generate a new ID — basic example (incremental, or use UUID if preferred)
    const lastAluno = await Aluno.findOne().sort({ id: -1 });
    const newId = lastAluno ? String(Number(lastAluno.id) + 1) : "1";

    const novoAluno = new Aluno({
      ...req.body,
      id: newId, // manually assign a unique string ID
    });

    await novoAluno.save();
    res.status(201).json(novoAluno);
  } catch (error) {
    console.error("Erro ao criar aluno:", error.message);
    res.status(500).json({ msg: "Erro ao criar aluno" });
  }
};

exports.update = async (req, res) => {
  const AlunoAtualizado = await Aluno.findOneAndUpdate({id: req.params.id}, req.body, { new: true });

  res.json(AlunoAtualizado);
};

exports.delete = async (req, res) => {
  await Aluno.findOneAndDelete({id: req.params.id});
  
  res.json({ msg: 'Aluno removido' });
};
