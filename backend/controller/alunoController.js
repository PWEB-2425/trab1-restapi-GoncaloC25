const Aluno = require('../models/aluno');

exports.getAll = async (req, res) => {
  const alunos = await Aluno.find();

  res.json(alunos);
};

exports.getById = async (req, res) => {
  const alunoId = req.params.id;

  if (!alunoId) {
    return res.status(400).json({ msg: 'ID do aluno é necessário' });
  }

  try {
    // Find the document that contains an aluno with this id
    const doc = await Aluno.findOne({ "alunos.id": alunoId });
    
    if (!doc || !doc.alunos) {
      return res.status(404).json({ msg: 'Aluno não encontrado' });
    }

    // Extract the specific aluno from the array
    const aluno = doc.alunos.find(a => a.id === alunoId);
    
    if (!aluno) {
      return res.status(404).json({ msg: 'Aluno não encontrado' });
    }

    // Send only the aluno
    res.json(aluno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro do servidor' });
  }
};

exports.create = async (req, res) => {
   try {
    const newAluno = req.body;
    
    // Find a document to add the student to (or create one if none exists)
    const result = await Aluno.findOneAndUpdate(
      {}, // Empty filter matches any document
      { $push: { alunos: newAluno } },
      { new: true, upsert: true } // Creates doc if none exists
    );

    res.status(201).json(newAluno);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.update = async (req, res) => {
    const alunoId = req.params.id;
  const updateData = req.body;

  console.log(`Attempting to update student ${alunoId} with:`, updateData);

  try {
    // 1. Verify the document exists
    const doc = await Aluno.findOne({ "alunos.id": alunoId });
    console.log('Found document:', doc ? doc._id : 'NOT FOUND');
    
    if (!doc) {
      console.log('Document not found');
      return res.status(404).json({ msg: 'Documento não encontrado' });
    }

    // 2. Verify the student exists in the array
    const alunoIndex = doc.alunos.findIndex(a => a.id === alunoId);
    console.log('Student array position:', alunoIndex);
    
    if (alunoIndex === -1) {
      console.log('Student not found in document');
      return res.status(404).json({ msg: 'Aluno não encontrado no documento' });
    }

    // 3. Perform the update
    const updateQuery = {
      $set: {}
    };

    // Build the $set object dynamically
    Object.keys(updateData).forEach(key => {
      updateQuery.$set[`alunos.${alunoIndex}.${key}`] = updateData[key];
    });

    console.log('Update query:', JSON.stringify(updateQuery, null, 2));

    const result = await Aluno.updateOne(
      { "alunos.id": alunoId },
      updateQuery
    );

    console.log('Update result:', result);

    if (result.modifiedCount === 0) {
      console.log('No documents were modified');
      return res.status(404).json({ msg: 'Nenhum documento foi modificado' });
    }

    // 4. Fetch the updated document
    const updatedDoc = await Aluno.findOne({ "alunos.id": alunoId });
    const updatedAluno = updatedDoc.alunos.find(a => a.id === alunoId);

    res.json({
      msg: 'Aluno atualizado com sucesso',
      aluno: updatedAluno
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ msg: 'Erro do servidor', error: error.message });
  }
};

exports.delete = async (req, res) => {
  await Aluno.findOneAndDelete({"alunos.id": req.params.id});
  
  res.json({ msg: 'Aluno removido' });
};
