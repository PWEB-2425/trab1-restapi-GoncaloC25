const Curso = require('../models/curso');

exports.getAll = async (req, res) => {
    const cursos = await Curso.find();

    res.json(cursos);
};

exports.getById = async (req, res) => {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return res.status(404).json({ msg: 'Curso não encontrado' });

    res.json(curso);
};

exports.create = async (req, res) => {
  const novoCurso = new Curso(req.body);
  await novoCurso.save();

  res.status(201).json(novoCurso);
};

exports.update = async (req, res) => {
  const cursoAtualizado = await Curso.findByIdAndUpdate(req.params.id, req.body, { new: true });

  res.json(cursoAtualizado);
};

exports.delete = async (req, res) => {
  await Curso.findByIdAndDelete(req.params.id);
  
  res.json({ msg: 'Curso removido' });
};
