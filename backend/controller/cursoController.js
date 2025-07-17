const Curso = require('../models/curso');

exports.getAll = async (req, res) => {
    const cursos = await Curso.find();

    res.json(cursos);
};

exports.getById = async (req, res) => {
    const curso = await Curso.findOne({id: req.params.id});
    if (!curso) return res.status(404).json({ msg: 'Curso não encontrado' });

    res.json(curso);
};

exports.create = async (req, res) => {
  try {
    // Generate a new ID — basic example (incremental, or use UUID if preferred)
    const lastCurso = await Curso.findOne().sort({ id: -1 });
    const newId = lastCurso ? String(Number(lastCurso.id) + 1) : "1";

    const novoCurso = new Curso({
      ...req.body,
      id: newId, // manually assign a unique string ID
    });

    await novoCurso.save();
    res.status(201).json(novoCurso);
  } catch (error) {
    console.error("Erro ao criar curso:", error.message);
    res.status(500).json({ msg: "Erro ao criar curso" });
  }
};

exports.update = async (req, res) => {
  const cursoAtualizado = await Curso.findOneAndUpdate({id: req.params.id}, req.body, { new: true });

  res.json(cursoAtualizado);
};

exports.delete = async (req, res) => {
  await Curso.findOneAndDelete({id: req.params.id});
  
  res.json({ msg: 'Curso removido' });
};
