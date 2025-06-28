const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conexão com mongoDB realizada com sucesso');
  } catch (error) {
    console.error('Erro ao ligar ao MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;