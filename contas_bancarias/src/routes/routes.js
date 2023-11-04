const express = require("express")
const bcrypt = require("bcrypt");
const router = express.Router();
const Conta = require("../models/contas")
const config= require("../config/settings")
const jwt = require("jsonwebtoken")


//EndPoints da Conta
//Todos so endpoints de conta exigem token, pois são ações internas.
router.get("/",(req,res)=>{
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

        Conta.find().then((result)=>{
            res.status(200).send({output:`Ok`,payload:result})
        }).catch((error)=>res.status(500).send({output:`Erro ao processar o pedido`,err:error}))
    })
})

router.post("/insert",(req,res)=>{
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
        const dados = new Conta(req.body);
        dados.save().then((result)=>{
            res.status(201).send({output:`Cadastrado`,payload:result})
        }).catch((error)=>res.status(400).send({output:`Não foi possível cadastrar`,err:error}))
    })
})

router.put("/update/:id",(req, res)=>{
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
        Conta.findByIdAndUpdate(req.params.id,req.body,{new:true}).then((result)=>{
            if(!result){
                res.status(400).send({output:`Não foi possível localizar`})
            }
            res.status(200).send({ouptut:`Atualizado`,payload:result})
        }).catch((error)=>res.status(500).send({output:`Erro ao tentar atualizar`,erro:error}))
    })
})

router.delete("/delete/:id",(req,res)=>{
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
        Conta.findByIdAndDelete(req.params.id).then((result)=>{
            res.status(204).send({output:`Apagado`})
        }).catch((error)=>res.status(500).send({output:`Erro ao tentar apagar`,erro:error}))
    })
})

// Endpoint de excessão
router.use((req,res)=>{
    res.type("application/json");
    res.status(404).send({mensagem:"404 - Not Found"})
})

module.exports = router;