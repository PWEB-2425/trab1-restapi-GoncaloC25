const btnaluno = document.getElementById("btn_aluno");
const btncurso = document.getElementById("btn_curso");
const btncriar = document.getElementById("adicionar-btn");
btnaluno.addEventListener("click", mostraAlunos);
btncurso.addEventListener("click", mostraCursos);

const alunosurl = "https://trab1-pw.onrender.com/alunos/";
const cursosurl = "https://trab1-pw.onrender.com/cursos/";

const table = document.getElementById("tabela");
let alunos = 0;
let cursos = 0;

btncriar.addEventListener("click", () => {
    if (alunos == 1 && cursos == 0) {   
        criarAluno();
    } else if (cursos == 1 && alunos == 0) { 
        criarCurso();
    }
});

listarAlunos();

async function listarAlunos(){
    const alunosresposta = await fetch(alunosurl);
    const cursosresposta = await fetch(cursosurl);

    const alunosJS = await alunosresposta.json();
    const alunosArray = alunosJS[0]?.alunos ?? [];

    const cursosJS = await cursosresposta.json();
    const cursosArray = cursosJS[0]?.cursos ?? [];
    console.log(alunosArray);

    table.innerHTML = "";

    table.innerHTML = "<thead><tr><th>Nome</th><th>Idade</th><th>Ano Curricular</th><th>Curso</th><th>Ações</th></tr></thead>";

    const tbody = document.createElement("tbody");

    for (aluno of alunosArray) {

        const trow = document.createElement("tr");
        let namedata = document.createElement("td");
        let coursedata = document.createElement("td");
        let idadedata = document.createElement("td");
        let anodata = document.createElement("td");
        let acoesdata = document.createElement("td");
        let delBtn = document.createElement("button");
        let editBtn = document.createElement("button");

        namedata.innerHTML = aluno.nome + " " + aluno.apelido;
        coursedata.innerHTML = cursosArray.find(curso => curso.id == aluno.curso)?.nomeDoCurso || "Curso Desconhecido"; 
        idadedata.innerHTML = aluno.idade + " anos";
        anodata.innerHTML = aluno.anoCurricular + "º ano";

        delBtn.setAttribute("data-alunoid", aluno.id);
        delBtn.setAttribute("type", "button");
        delBtn.setAttribute("id", "btnDel"+aluno.id);
        delBtn.setAttribute("class", "btn btn-danger");
        delBtn.innerHTML = "Remover";
        delBtn.addEventListener("click", removerAluno);

        editBtn.setAttribute("data-alunoid", aluno.id);
        editBtn.setAttribute("type", "button");
        editBtn.setAttribute("class", "btn");
        editBtn.setAttribute("id", "btnEdit"+aluno.id);
        editBtn.innerHTML = "Editar";
        editBtn.addEventListener("click", editarAluno);

        acoesdata.appendChild(delBtn);
        acoesdata.appendChild(editBtn);

        trow.setAttribute("data-alunoid", aluno.id);
        trow.appendChild(namedata);
        trow.appendChild(idadedata);
        trow.appendChild(anodata);
        trow.appendChild(coursedata);
        trow.appendChild(acoesdata);

        tbody.appendChild(trow);
    }
    
    table.appendChild(tbody);
}

async function criarAluno() {

    const tempRow = document.createElement("tr");
    const tbody = table.querySelector("tbody");

    await makeInptus(tempRow);

    tbody.appendChild(tempRow);
    table.appendChild(tbody);

    const addBtn = tempRow.querySelector("#btn_criar_aluno");
    addBtn.addEventListener("click", async () => {

        const inputs = tempRow.querySelectorAll('input, select');
        const alunoElement = {
            nome: inputs[0].value,
            apelido: inputs[1].value,
            idade: inputs[2].value,
            anoCurricular: inputs[3].value,
            curso: inputs[4].value
        };

        let hasEmptyField = false;
        for (const [key, value] of Object.entries(alunoElement)) {
            if (!value) {  // This checks for empty string, null, or undefined
                console.error(`Field ${key} is empty!`);
                hasEmptyField = true;
            }
        }   

        if (hasEmptyField) {
            alert("Existem Campos Vazios, impossivel adicionar.");
            table.removeChild(table.lastChild);
            listarAlunos();
            return;
        }


        alunoJSON = JSON.stringify(alunoElement);

        const resposta = await fetch(alunosurl,{method:"POST", body:alunoJSON});

        table.removeChild(table.lastChild);
        await listarAlunos();
    });

}

async function removerAluno(evento) {

    const botaoclicado = evento.target;
    const idaluno = botaoclicado.dataset.alunoid;

    const resposta = await fetch(alunosurl + idaluno, {method:"DELETE"});
    await listarAlunos();
    
}

function mostraAlunos() {
    alunos = 1;
    cursos = 0;
    const divalunos = document.getElementById("div_geral");
    divalunos.hidden = false;
    listarAlunos();
}

async function editarAluno(evento) {

    const botaoclicado = evento.target;
    const idaluno = botaoclicado.dataset.alunoid;

    const table = document.getElementById("tabela");
    const row = table.querySelector("tr[data-alunoid='" + idaluno + "']");

    const alunoeditUrl = alunosurl + idaluno;
    const alunoEditResponse = await fetch(alunoeditUrl);
    const alunoEdit = await alunoEditResponse.json();

    row.innerHTML = "";
    
    await makeInptus(row);

    const inputs = row.querySelectorAll('input, select');

    const btnCriarAluno = row.querySelector("#btn_criar_aluno");

    inputs[0].value = alunoEdit.nome;
    inputs[1].value = alunoEdit.apelido;
    inputs[2].value = alunoEdit.idade; 
    inputs[3].value = alunoEdit.anoCurricular;
    inputs[4].value = alunoEdit.curso;

    btnCriarAluno.innerHTML = "Editar";
    btnCriarAluno.addEventListener("click", async () => {

        const alunoElement = {
            nome: inputs[0].value,
            apelido: inputs[1].value,
            idade: inputs[2].value,
            anoCurricular: inputs[3].value,
            curso: inputs[4].value
        };

        let hasEmptyField = false;
        for (const [key, value] of Object.entries(alunoElement)) {
            if (!value) {  // This checks for empty string, null, or undefined
                console.error(`Field ${key} is empty!`);
                hasEmptyField = true;
            }
        }   

        if (hasEmptyField) {
            alert("Existem Campos Vazios, impossivel adicionar.");
            table.removeChild(table.lastChild);
            listarAlunos();
    nomeInput.setAttribute("type", "text");
    nomeInput.setAttribute("id", "aluno_nome");
    nomeInput.setAttribute("placeholder", "Nome");
    nomeInput.setAttribute("class", "text input");
    let apelidoInput = document.createElement("input");
    apelidoInput.setAttribute("type", "text");
    apelidoInput.setAttribute("id", "aluno_apeli");
    apelidoInput.setAttribute("placeholder", "Apelido");
            return;
        }

        alunoJSON = JSON.stringify(alunoElement);

        const resposta = await fetch(alunoeditUrl, {method:"PUT", body:alunoJSON});

        await listarAlunos();
        
    });
}

async function makeInptus(row){
    const cursosresposta = await fetch(cursosurl);
    const cursosJS = await cursosresposta.json();
    const cursosArray = cursosJS[0]?.cursos ?? [];

    let namedata = document.createElement("td");
    let nomeInput = document.createElement("input");
    nomeInput.setAttribute("type", "text");
    nomeInput.setAttribute("id", "aluno_nome");
    nomeInput.setAttribute("placeholder", "Nome");
    nomeInput.setAttribute("class", "text input");
    let apelidoInput = document.createElement("input");
    apelidoInput.setAttribute("type", "text");
    apelidoInput.setAttribute("id", "aluno_apeli");
    apelidoInput.setAttribute("placeholder", "Apelido");
    apelidoInput.setAttribute("class", "text input");
    namedata.appendChild(nomeInput);
    namedata.appendChild(apelidoInput);

    let idadedata = document.createElement("td");
    let idadeInput = document.createElement("input");
    idadeInput.setAttribute("type", "number");
    idadeInput.setAttribute("id", "aluno_idade");
    idadeInput.setAttribute("placeholder", "Idade");
    idadeInput.setAttribute("class", "num input");
    idadedata.appendChild(idadeInput);

    let anodata = document.createElement("td");
    let anoInput = document.createElement("input");
    anoInput.setAttribute("type", "number");
    anoInput.setAttribute("id", "aluno_ano");
    anoInput.setAttribute("placeholder", "Ano");
    anoInput.setAttribute("class", "num input");
    anodata.appendChild(anoInput);

    let cursodata = document.createElement("td");
    let cursoSelect = document.createElement("select");
    cursoSelect.setAttribute("id", "aluno_curso");
    cursoSelect.setAttribute("class", "select input");
    cursodata.appendChild(cursoSelect);

    for (let curso of cursosArray) {
        const option = document.createElement("option");
        option.value = curso.id; 
        option.textContent = curso.nomeDoCurso;
        option.setAttribute("class", "option");
        cursoSelect.appendChild(option);
    }

    let acoesdata = document.createElement("td");
    let btnCriarAluno = document.createElement("button");
    btnCriarAluno.setAttribute("type", "button");
    btnCriarAluno.setAttribute("id", "btn_criar_aluno");
    btnCriarAluno.setAttribute("class", "btn");
    btnCriarAluno.innerHTML = "Adicionar";
    acoesdata.appendChild(btnCriarAluno);

    row.appendChild(namedata);
    row.appendChild(idadedata);
    row.appendChild(anodata);
    row.appendChild(cursodata);
    row.appendChild(acoesdata);
}

function mostraCursos() {
    alunos = 0;
    cursos = 1;
    const divcursos = document.getElementById("div_geral");
    divcursos.hidden = false;
    listarCurso();
}

async function listarCurso(){
    const cursosresposta = await fetch(cursosurl);
    const cursosJS = await cursosresposta.json();
    const cursosArray = cursosJS[0]?.cursos ?? [];

    const alunosresposta = await fetch(alunosurl);
    const alunosJS = await alunosresposta.json();
    const alunosArray = alunosJS[0]?.alunos ?? [];

    table.innerHTML = "";
    table.innerHTML = "<thead><tr><th>Nome do Curso</th><th>Alunos Inscritos</th><th>Ações</th></tr></thead>";

    const tbody = document.createElement("tbody");

    for (curso of cursosArray) {
        const trow = document.createElement("tr");
        let namedata = document.createElement("td");
        let alunosData = document.createElement("td");
        let acoesdata = document.createElement("td");
        let delBtn = document.createElement("button");
        let editBtn = document.createElement("button");

        namedata.innerHTML = curso.nomeDoCurso;

        let alunosCount = alunosArray.filter(a => a.curso === curso.id).length;
        alunosData.innerHTML = alunosCount > 0 ? alunosCount + " Aluno(s)" : "Nenhum Aluno Inscrito";

        delBtn.setAttribute("data-cursoid", curso.id);
        delBtn.setAttribute("type", "button");
        delBtn.setAttribute("id", "btnDel"+curso.id);
        delBtn.setAttribute("class", "btn btn-danger");
        delBtn.innerHTML = "Remover";
        delBtn.addEventListener("click", removerCurso);

        editBtn.setAttribute("data-cursoid", curso.id);
        editBtn.setAttribute("type", "button");
        editBtn.setAttribute("class", "btn");
        editBtn.setAttribute("id", "btnEdit"+curso.id);
        editBtn.innerHTML = "Editar";
        editBtn.addEventListener("click", editarCurso);

        acoesdata.appendChild(delBtn);
        acoesdata.appendChild(editBtn);

        trow.setAttribute("data-cursoid", curso.id);
        trow.appendChild(namedata);
        trow.appendChild(alunosData);
        trow.appendChild(acoesdata);

        tbody.appendChild(trow);
        table.appendChild(tbody);
    }

}

async function criarCurso() {

    const tempRow = document.createElement("tr");
    const tbody = table.querySelector("tbody");

    await makeCursoInputs(tempRow);

    tbody.appendChild(tempRow);
    table.appendChild(tbody);

    const addBtn = tempRow.querySelector("#btn_criar_curso");
    addBtn.addEventListener("click", async () => {

        const inputs = tempRow.querySelectorAll('input');
        const cursoElement = {
            nomeDoCurso: inputs[0].value
        };

        if (!cursoElement.nomeDoCurso) {
            alert("Campo Nome do Curso vazio, impossivel adicionar.");
            table.removeChild(table.lastChild);
            listarCurso();
            return;
        }

        cursoJSON = JSON.stringify(cursoElement);

        const resposta = await fetch(cursosurl,{method:"POST", body:cursoJSON});

        table.removeChild(table.lastChild);
        await listarCurso();
    });

}

async function removerCurso(evento) {

    const botaoclicado = evento.target;
    const idcurso = botaoclicado.dataset.cursoid;

    const resposta = await fetch(cursosurl + idcurso, {method:"DELETE"});
    await listarCurso();
    
}

async function editarCurso(evento) {

    const botaoclicado = evento.target;
    const idcurso = botaoclicado.dataset.cursoid;
    const tbody = table.querySelector("tbody");

    const cursoEditResponse = await fetch(cursosurl + idcurso);
    const cursoEdit = await cursoEditResponse.json();

    const row = table.querySelector("tr[data-cursoid='" + idcurso + "']");

    row.innerHTML = "";

    await makeCursoInputs(row);

    tbody.appendChild(row);
    table.appendChild(tbody);

    const inputs = row.querySelector('#curso_nome');
    inputs.value = cursoEdit.nomeDoCurso;

    const btnCriarCurso = row.querySelector("#btn_criar_curso");
    btnCriarCurso.innerHTML = "Editar";
    btnCriarCurso.addEventListener("click", async () => {

        const cursoElement = {
            nomeDoCurso: inputs.value
        };

        let hasEmptyField = false;

        if (inputs.value == null) {
            alert("Campo Nome do Curso vazio, impossivel adicionar.");
            table.removeChild(table.lastChild);
            listarCurso();
            return;
        }

        cursoJSON = JSON.stringify(cursoElement);

        const resposta = await fetch(cursosurl+idcurso, {method:"PUT", body:cursoJSON});

        await listarAlunos();
        
    });
}

function makeCursoInputs(row){

    let namedata = document.createElement("td");
    let nomeInput = document.createElement("input");
    nomeInput.setAttribute("type", "text");
    nomeInput.setAttribute("id", "curso_nome");
    nomeInput.setAttribute("placeholder", "Nome do Curso");
    nomeInput.setAttribute("class", "text input");
    namedata.appendChild(nomeInput);

    let acoesdata = document.createElement("td");
    let btnCriarCurso = document.createElement("button");
    btnCriarCurso.setAttribute("type", "button");
    btnCriarCurso.setAttribute("id", "btn_criar_curso");
    btnCriarCurso.setAttribute("class", "btn");
    btnCriarCurso.innerHTML = "Adicionar";
    acoesdata.appendChild(btnCriarCurso);

    row.appendChild(namedata);
    row.appendChild(acoesdata);
}