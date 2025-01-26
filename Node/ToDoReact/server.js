
import cors from 'cors';
import dotenv from 'dotenv';
import mysql2 from 'mysql2';
import express from 'express';

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());
const port = process.env.PORT;

const db = mysql2.createConnection({
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    host: process.env.DB_HOST
})

db.connect((err) => {
    if (err) {
        console.log('erro de conexão do bd!!')
    } else {
        console.log('banco de dados conectado!')
    }
})


app.get('/', (req, res) => {
    try {
        const sql = "SELECT * FROM task"
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).json({ erro: "erro de banco de dados" })
            }
            res.status(200).send(results);
        })
    } catch (error) {
        console.log("erro de servidor", error)
        res.status(500).send({ erro: "erro de servidor" })
    }
})

app.post('/CreateUser', (req, res) => {
    try {
        const { usuario, pass } = req.body;
        if (!usuario || !pass) {
            res.status(400).json({ erro: "usuario ou senha inválidos" })
        }

        const sql = "INSERT INTO logins value(?, ?, ?)"
        //const id = Math.random()
        db.query(sql, ['id', usuario, pass], (err, results) => {
            if (err) {
                console.log("erro ao executar query:", err);
                return res.status(500).json({ erro: "Erro de Servidor" });
            }
            console.log(results)
            return res.sendStatus(200)
        })

    } catch (error) {
        console.log("erro interno", error.message)
        res.status(500).json({ erro: "erro interno do servidor" });
    }
})

app.post('/addTask', (req, res) => {
    try {
        const { novaTarefa, deadline } = req.body;
        if (!novaTarefa) {
            res.status(400)
        }

        const sql = "INSERT INTO task(task, deadline) VALUES (?, ?)"

        db.query(sql, [novaTarefa, deadline], (err, results) => {
            if (err) {
                console.log("erro de query nas tasks:", err);
                return res.status(500).json({ erro: err })
            }
            return res.status(200).json({ sucess: "Task Adicionada" })
        })
    } catch (error) {
        console.log("erro no servidor")
        res.status(500).json({ erro: "erro de servidor" })
    }
})

app.delete('/Delete', (req, res) => {
    try {
        const { tarefaParaRemover } = req.body;
        const sql = "DELETE FROM task WHERE id = ?";
        db.query(sql, [tarefaParaRemover], (err, results) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ erro: err })
            }

            res.status(200).json({ sucess: "DELETADO COM SUCESSO" });
        })
    }catch(err){
        res.status(500).json({erro: "Erro de servidor"})
    }
})

app.post('/Login', (req, res) => {
    try {
        const { usuario, pass } = req.body;
        if (!usuario || !pass) {
            res.status(400).json({ "erro": "usuário e senha requeridas" })
        }
        const sql = "SELECT * FROM logins WHERE user = ? AND pass = ?"

        db.query(sql, [usuario, pass], (err, results) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                return res.status(500).json({ error: 'Erro no servidor' });
            }

            if (results.length > 0) {
                res.status(200).json({ message: 'Success' });
            } else {
                res.status(404).json({ error: 'Usuário ou senha incorretos' });
            }
        })
    } catch (error) {
        console.error('Erro interno:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})

app.listen(port, () => {
    console.log(`Server on In port ${port}`);
})