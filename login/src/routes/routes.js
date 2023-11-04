const express = require("express")
const bcrypt = require("bcrypt");
const gerartoken = require("../utils/gerartoken")
const router = express.Router();
const Cliente = require("../models/cliente")


// Login de usuario
router.post("/",(req,res)=>{
    const user = req.body.usuario
    const password = req.body.senha

    Cliente.findOne({nomeusuario:user}).then((result)=>{
        if(!result){
            return res.status(404).send({output:`Usuário não existe`})
        }
        bcrypt.compare(password,result.senha).then((rs)=>{
            if(!rs){
                return res.status(400).send({output:`Usuário ou senha incorreto`})
            }

            const token = gerartoken(result._id,result.nomeusuario,result.email)
            res.status(200).send({output:"Autenticado",token:token})
        })
        .catch((error)=>res.status(500).send({output:`Erro ao processar dados -> ${error}`}))
    }).catch((err)=>res.status(500).send({output:`Erro ao processar o login -> ${err}`}))
})

// Endpoint de excessão
router.use((req,res)=>{
    res.type("application/json");
    res.status(404).send({mensagem:"404 - Not Found"})
})

module.exports = router;