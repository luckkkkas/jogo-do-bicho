
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mysql2 from 'mysql2';

dotenv.config();
console.log(process.env)
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_DATABASE:', process.env.DB_DATABASE);

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());

const db = mysql2.createConnection({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST
})

db.connect((err) =>{
    if(err){
        console.log('erro de conexão do bd!!')
    }else{
        console.log('banco de dados conectado!')
    }
})

app.get('/', (req, res)=>{
    res.send('valid, json')
})

app.post('/Login', (req, res)=>{
    try {
        const {user, pass} = req.body;
        if(!user || !pass){
            req.status(400).json({"erro": "usuário e senha requeridas"})
        }

        const sql = "SELECT * FROM logins WHERE username = ? and password = ?"

        db.query(sql, [user, pass], (err, results) =>{
            if (err) {
               console.error('Erro ao executar a query:', err);
               return res.status(500).json({ error: 'Erro no servidor' });
            }
          
              if (results.length > 0) {
                res.status(200).json({ message: 'Usuário encontrado', user: results[0] });
            } else {
               res.status(404).json({ error: 'Usuário ou senha incorretos' });
            }
        })
    //consultar no banco de dados 
    } catch (error) {
       cconsole.error('Erro interno:', error);
       res.status(500).json({ error: 'Erro interno do servidor' });
    }
    })

app.listen(port, ()=>{
    console.log(`Server on In port ${port}`);
})