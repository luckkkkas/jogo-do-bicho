import express from 'express';
import mysql2 from 'mysql2'
const app = express();
const port = 5000;
app.use(express.json())

const db = mysql2.createConnection({
    user: 'u224972953_root',
    database: 'u224972953_teste_php',
    password: 'Skoi7617@',
    host: '62.72.62.1',
});

db.connect((err)=>{
    if(err){
        console.error('erro ao conectar ao bd: ', err)
    }else{
        console.log('Banco de dados conectado com sucesso!!, só alegria')
    }
})

app.get('/',(req, res) => {
    res.send('Olá, mundo!')
})

app.post('/post', (req, res)=>{
    const {valor1, valor2, valor3, valor4, valor5} = req.body;
    try{
        console.log(valor1, valor2, valor3, valor4)
        res.status(200).send({valores: "recebidos"})
    }catch{
        console.error('erro ao exibir dados recebidos')
        res.status(500).send({erro: 'erro de consulta'})
    }finally{
        console.log('fim da execução')
    }
})

app.listen(port, ()=>{
    console.log(`servidor ta online na porta ${port}`)
})