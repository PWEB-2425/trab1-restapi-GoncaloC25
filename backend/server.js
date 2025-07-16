// Importa módulos necessários
const express = require('express');
const session = require('express-session');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');

dotenv.config();

// Cria uma instância do Express
const app = express();

app.use(session({ 
    secret: process.env.SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'none', // allow cross-site
        secure: true      // cookie only over HTTPS
    }
}));

// Permite receber dados de formulários via POST
app.use(express.urlencoded({ extended: true }));
// Permite receber dados em JSON
app.use(express.json());
app.use(cors({
    origin: 'https://trab1-pw-frontend-gray.vercel.app', // Frontend URL
    credentials: true
}));

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

app.use('/listar/:isWhat', estaAutenticado, async (req, res) => {
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



// Configura servidor para servir arquivos estáticos da pasta 'public'
//app.use(express.static('../frontend'));
const baseurl = 'https://trab1-pw-frontend-gray.vercel.app'

// Rota de login: autentica username e cria sessão
app.post('/login', async (req, res) => {
    const collection = db.collection('Admins');
    const username = req.body.username;
    const password = req.body.password;
    
    // Procura username na base de dados
    const userdb = await collection.findOne({ username: username });

    bcrypt.compare(password, userdb.password, async function (err, isMatch) {
        if (isMatch) {
            // username autenticado com sucesso
            console.log(`Utilizador ${username} autenticado com sucesso.`);
            req.session.username = username;
            return res.redirect(baseurl);    
        } else {  
            // Falha na autenticação
            console.log(`Falha na autenticação para o usuário ${username}.`);
            return res.redirect(baseurl + '/login.html');
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
        res.redirect(401, baseurl + '/login.html')
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