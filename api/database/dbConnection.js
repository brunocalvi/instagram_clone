const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/instagram';

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);

    console.log('-> Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('-> Erro ao conectar ao MongoDB:', error);
  }
};

connectToMongoDB();
