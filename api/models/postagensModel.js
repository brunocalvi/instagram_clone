const mongoose = require('mongoose');

const postagens = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  url_imagem: {
    type: String,
    required: true,
  },
});

module.exports = postagens;