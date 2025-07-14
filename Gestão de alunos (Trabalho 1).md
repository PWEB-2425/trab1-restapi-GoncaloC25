# Gestão de alunos (Trabalho 1)

Projeto desenvolvido por Gonçalo Duque Correia, n. 29435

## Descrição

Esta aplicação permite:

- A gestão de alunos e de cursos guardados numa base de dados MongoDB
- Permitir a edição, visualização, remoção e criação de novos alunos/cursos


## Execução Local

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [MongoDB](https://www.mongodb.com/) (local ou Atlas)
- npm (geralmente já vem com o Node.js)


### Instalação
1. **Clone o repositório:**
2. **Instale as dependências:**
3. **Configure as variáveis de ambiente:**
    1. Poderá obter a string de conexão do MongoDB na sua dashboard do Atlas
4. **Certifique-se que o MongoDB está a correr.**
    1. Configure a string de conexão para Atlas no `.env`


### Como executar o projeto

diretamente invocando o node.js

```sh 
node server.js

```

Ou via npm

```sh
npm start

```

A aplicação ficará disponível em [http://localhost:3000](http://localhost:3000) (ou na porta definida no `.env`).


### Estrutura de pastas
``` 
Trabalho2/
│
...
│
├── frontend/
│   ├── fonts/
│   ├── script.js
│   ├── estilo.css
│   └── index.html
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
└── README.md
```

## Execução Remota
Para utilizar este programa utilizando o seu deploy no [Render](https://render.com/) e no [Vercel](https://vercel.com/), pode ser utilizado o link [https://trab1-pw-frontend-gray.vercel.app/](https://trab1-pw-frontend-gray.vercel.app/), que nos vai levar diretamente para a instancia disponivel no Vercel.
O Render é mantido ativo utilizando o website [UpTimeRobot](https://uptimerobot.com/), logo, deveria estar disponivel sempre que possivel.

## Fluxo de utilização
1. Escolha se pertende gerir cursos ou alunos
2. Execute operações á sua escolha.

## Notas para desenvolvimento
- O código está comentado para facilitar a compreensão.
- Para qualquer dúvida, consulte os comentários no código fonte.

---
