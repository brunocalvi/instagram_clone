const express = require('express');
const db = require('../database/dbConnection');
const PostagensModel = require('../models/postagensModel');
const setHeaders = require('../middleware/setHeaders'); 
const mongoose = require('mongoose');
const fs = require('fs');

const router = express.Router();

const postagens = mongoose.model('postagens', PostagensModel);

router.post('/api', setHeaders, async (req, res) => {
  let msg = '';
  let date = new Date();
  let time_stamp = date.getTime();

  let url_imagem = time_stamp + '_' + req.files.arquivo.originalFilename;
  
  let path_origem = req.files.arquivo.path;
  let path_destino = './uploads/' + url_imagem;
  

  let readS = fs.createReadStream(path_origem);
  let writeS = fs.createWriteStream(path_destino);
  readS.pipe(writeS);

  readS.on("end", async function(e) {
    if(e){
      res.status(500).json({ error : e });
      return;
    }

    let dados = {
      url_imagem: url_imagem,
      titulo: req.body.titulo,
    }

    const newPostagem = new postagens({
      titulo: dados.titulo,
      url_imagem: dados.url_imagem,
    });

    try{
      await newPostagem.save();
      msg = 'Dados inseridos com sucesso.';
  
    }catch(e) {
      console.log(e);
      msg = 'Falha ao inserir os dados.';
    } 
  
    res.json({ Msg: msg });
  });
});

router.get('/api', setHeaders, async (req, res) => {
  const lista = await postagens.find({});

  res.json({ Postagens: lista });
});

router.get('/api/:id', async (req, res) => {
  let id = req.params.id;

  try {
    const postagem = await postagens.findOne({ _id: id });
    res.json({ Postagem: postagem });

  } catch(e) {
    console.log(e);
    res.status(404).json({msg: 'Nenhuma informação encontrada!'});
  }
});

router.get('/imagens/:imagem', async (req, res) => {
  let img = req.params.imagem;

  fs.readFile('./uploads/'+img, function(err, content) {
    if(err) {
      res.status(400).json(err);
      return;
    }

    res.writeHead(200, { 'Content-type' : 'image/jpg' });
    res.end(content);
  });
});

router.put('/api/:id', setHeaders, async (req, res) => {
  let id = req.params.id;
  let titulo = req.body.titulo;
  let url_imagem = req.body.url_imagem; 

  let date = new Date();
  let time_stamp = date.getTime();

  try {
    let updatePostagem = await postagens.findOneAndUpdate({ _id: id }, { $push: { comentarios : { id_comentario: time_stamp, comentario: req.body.comentario }}});
    res.json({ 'Postagem': 'Postagem Atualizada' });
    
  }catch(e) {
    console.log(e);
    res.json({ 'Postagem': 'Falha na atualização.'});
  }
});

router.delete('/api/:id', async (req, res) => {
  let id = req.params.id;

  try {
    let deletePostagem = await postagens.findOneAndUpdate({}, { $pull: { comentarios: { id_comentario: id }}});
    res.json({ 'Postagem': `Postagem ${id} Deleteda.` });
    
  }catch(e) {
    console.log(e);
    res.json({ 'Postagem': 'Falha na deleção.'});
  }
});



module.exports = router;