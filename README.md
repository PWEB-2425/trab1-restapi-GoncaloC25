## O que consiste o programa

Este é um programa CRUD (Create, Read, Update, Delete) de alunos. Ele permite gerir alunos inscritos em diversos cursos. Permite ainda a gestão dos cursos.
Neste programa, pode ser utilizada a base de dados MongoDB, hospedada localmente, disponivel na banch "Backend", ou no serviço Web render, disponivel na branch "deploy". Existe ainda a possibilidade de utilizar o programa com uma simples base de dados json, utilizando o json-server, implementado também na branch "Backend".
Esta aplicação também está disponivel como serviço Web, utilizando o Vercel. a mesma pode ser acedida utilizando o seguinte link: [https://trab1-pw-frontend-j3rs-kljbz50dx-goncalos-projects-8f9d73fa.vercel.app/](https://trab1-pw-frontend-j3rs-kljbz50dx-goncalos-projects-8f9d73fa.vercel.app/)

## Como utilizar

Primeiramente, é necessário escolher um modo de implementação da base de dados, e, conforme a base de dados pretendida, escolher a branch pretendida.

### Json-server

Para utilizar o programa utilizando a base de dados Json-server, escolhemos a branch "Backend", mudamos para o dirétorio "mock-server", e executamos o comando `npm start`.

### MongoDB Local

Para utilizarmos o programa com a base de dados MongoDB, com um servidor local, escolhemos a branch "Backend", mudamos para o diretório "backend", e executamos o comando `node server.js` para arrancarmos o servidor. Após a indicação do terminal, o servidor estará disponivel no porto indicado no ficheiro `.env`, ou, caso exista erro a ler o ficheiro, no porto 5000.

### MongoDB implementado no Render

Para utilizarmos a aplicação com o deploy no render, apenas teremos de escolher o branch deploy e executar o servidor para o nosso frontend. O nosso servidor de dados estará disponivel no link [https://trab1-pw.onrender.com/alunos/](https://trab1-pw.onrender.com/alunos/) e também [https://trab1-pw.onrender.com/cursos](https://trab1-pw.onrender.com/cursos/). Também podemos utilizar este modelo de base de dados ao utilziarmos a aplicação disponibilizada no Vercel, a mesma utiliza este modelo. 

## Problemas conhecidos

Neste programa, são conhecidos os problemas:
  - Impossivel adicionar alunos ou cursos quando utilizado outro modelo de base de dados sem ser o JSON-Server.
  - Criada uma entrada vazia fora do array de alunos ou cursos quando é tentado adicionar um novo aluno ou curso.