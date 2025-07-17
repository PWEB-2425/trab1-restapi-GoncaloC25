// Importa módulos necessários
const express = require('express');
const session = require('express-session');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');

dotenv.config();

const baseurl = 'http://127.0.0.1:5500'

// Cria uma instância do Express
const app = express();

// Necessário para enviar cookies
app.set('trust proxy', 1);

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {    

    // Check if the origin is your frontend domain or any subpath
    if (origin === baseurl || origin.startsWith(`${baseurl}/`)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Session configuration - make sure it's secure in production
app.use(session({
  name: 'sid',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if using HTTPS
    sameSite: 'strict',
    httpOnly: true, // prevents client-side JS from reading the cookie
    maxAge: 1 * 60 * 60 * 1000 // 1 hour
  }
}));

// Permite receber dados de formulários via POST
app.use(express.urlencoded({ extended: true }));
// Permite receber dados em JSON
app.use(express.json());

// proteger a pagina estatica '/pesquisa.html'
// tem que ser feito antes de configurar o servidor estatico

// Função para criar entradas na base de dados

app.use('/criar/:isWhat', async (req, res) => {
    try{
        const isWhat = req.params.isWhat;
        var doc = {};
        var collection;

        if (isWhat === "aluno"){
            collection = db.collection('Alunos');
            doc = {
                nome: req.body.nome,
                apelido: req.body.apelido,
                idade: req.body.idade,
                anoCurricular: req.body.anoCurricular,
                curso: req.body.curso
            }
        } else if(isWhat === "curso"){
            collection = db.collection('Cursos');
            doc = {
                nomeDoCurso: req.body.nomeDoCurso
            }
        } else {
            throw error("Parametro desconhecido")
        }
        
        const resultado = await collection.insertOne(doc);
        console.log(`A document was inserted with the _id: ${resultado.insertedId}`);

        res.status(201).json({
            message: isWhat + ' criado com sucesso',
            id: resultado.insertedId
        });

    } catch (error) {
        console.log('Impossivel criar, erro inesperado no servidor: ' + error);

        res.status(500).json({ error: 'Erro inesperado no servidor' });
    }
});

// Função para listar entradas na base de dados

app.use('/listar/:isWhat', async (req, res) => {
    try{
        const isWhat = req.params.isWhat;
        var collection;
        
        if(isWhat === "aluno"){
            collection = db.collection('Alunos');
        } else if (isWhat === "curso"){
            collection = db.collection('Cursos');
        } else {
            throw error("Parametro desconhecido");
        }

        const resultado = await collection.find();
        res.send(await resultado.toArray());

    } catch (error) {
        console.log('Impossivel encontrar, erro inesperado no servidor: ' + error);
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

// Funçoes de middleware para Atualizar entradas na base de dados

app.use('/update/:isWhat', async (req, res) => {
    try{
        const isWhat = req.params.isWhat;
        var collection;
        var updateDocument = {};
        
        if(isWhat === "aluno"){
            collection = db.collection('Alunos');
            updateDocument = {
                $set: {
                    nome: req.body.nome,
                    apelido: req.body.apelido,
                    idade: req.body.idade,
                    anoCurricular: req.body.anoCurricular,
                    curso: req.body.curso
                }
            };
        } else if (isWhat === "curso"){
            collection = db.collection('Cursos');
            updateDocument = {
                $set: {
                    nomeDoCurso: req.body.nomeDoCurso,
                }
            }
        } else {
            throw error("Parametro desconhecido");
        }

        const o_id = new ObjectId(req.body.id);

        const filter = {_id: o_id };

        const resultado = await collection.updateOne(filter, updateDocument);

        console.log(resultado.modifiedCount + " elemento atualizado.");

        res.status(200).json({
            message: isWhat + " atualizado com sucesso"
        })

    } catch (error) {
        console.log('Impossivel atualizar, erro inesperado no servidor: ' + error);

        res.status(500).json({
            message: 'Internal Server Error',
        });

    }
});

// Funções middleware para eliminar elementos por id

app.use('/delete/:isWhat', async (req, res) => {
    try{
        const isWhat = req.params.isWhat;
        var collection;
        
        if(isWhat === "aluno"){
            collection = db.collection('Alunos');
        } else if (isWhat === "curso"){
            collection = db.collection('Cursos');
        } else {
            throw error("Parametro desconhecido");
        }

        var o_id = new ObjectId(req.body.id);
        const resultado = await collection.deleteOne({_id: o_id});

        console.log(resultado.deletedCount + isWhat + "(s) corresponderam á pesquisa e foram eliminados");

        res.status(200).json({
            message: isWhat+" eliminado com sucesso"
        })

    } catch (error) {
        console.log('Impossivel eliminar, erro inesperado no servidor: ' + error);

        res.status(500).json({
            message: 'Internal Server Error',
        });
        
    }
});

// funções middleware para encontrar elementos por id

app.use('/find/:isWhat/:id', async (req, res) => {
    try{
        const isWhat = req.params.isWhat;
        var collection;
        
        if(isWhat === "aluno"){
            collection = db.collection('Alunos');
        } else if (isWhat === "curso"){
            collection = db.collection('Cursos');
        } else {
            throw error("Parametro desconhecido");
        }

        var o_id = new ObjectId(req.params.id);
        //const projectFields = { _id: 0, nome: 1, apelido: 1, idade: 1, anoCurricular: 1, curso: 1 };

        const resultado = await collection.findOne({_id: o_id})//.project(projectFields);

        console.log(isWhat + " encontrado: ", await resultado);

        res.send(await resultado);

    }catch(error){
        console.log('Impossivel encontrar, erro inesperado no servidor: ' + error);

        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});


// Rota de login: autentica username e cria sessão
app.post('/login', async (req, res) => {
    const collection = db.collection('Admins');
    const username = req.body.username;
    const password = req.body.password;
    
    // Procura username na base de dados
    const userdb = await collection.findOne({ username: username });

    if(!userdb){
        return res.status(401).json({
            message: "Utilizador inexistente"
        })
    }

    bcrypt.compare(password, userdb.password, async function (err, isMatch) {
        if (isMatch) {
            // username autenticado com sucesso
            console.log(`Utilizador ${username} autenticado com sucesso.`);
            req.session.username = username;
                
            return res.redirect(baseurl);

        } else {  
            // Falha na autenticação
            console.log(`Falha na autenticação para o usuário ${username}.`);
            return res.status(401).json({
                message: 'Palavra-passe incorreta'
            })
        }
    });
});

// Middleware para proteger rotas: verifica se username está autenticado
function estaAutenticado(req, res, next) {
    if (req.session.username) {
        console.log("Utilizador autenticado");
        next();
    } else {
        console.log("Utilizador não autenticado");
        res.status(401).json({
            message: 'Utilizador não autenticado. Por favor, inicie sessão'
        })
    }
}

// Rota de logout: destroi a sessão autenticada
app.get('/logout', (req, res) => {
    req.session.destroy();
    console.log("Sessão destruida")
    res.redirect(baseurl + '/login.html');
});

app.get('/profile', estaAutenticado, (req, res) => {
    const username = req.session.username
    console.log(`Utilizador autenticado: ${username}`)
    res.json({
        name: username
    })
});

// Variáveis globais para banco de dados
let db; // instância da ligacao à BD MongoDB

// Função para conectar ao MongoDB e iniciar o servidor
async function start() {
    console.log('Iniciando aplicação...');
    try { 
        // Cria um novo cliente MongoDB usando a string de conexão do .env ou padrão local
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect(); // Estabelece conexão com base de dados
        console.log('Ligado ao MongoDB');
        db = client.db(process.env.DB_NAME); // Seleciona a base de dados 'usersdb'
        // Inicia o servidor Express na porta definida no .env ou 3001
        return app.listen(process.env.PORT || 5000, () => {
            const port = process.env.PORT || 5000;
            console.log("Servidor pronto na porta " + port);
        });
    }
    catch (error) {
        // Mostra erro caso não consiga ligar BD e/ou servidor
        console.error('Erro ao iniciar', error);
    }
}

// Inicia a aplicação
start();