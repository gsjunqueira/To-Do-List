const LOCALSTORAGE_KEY = "tarefas"

const elTitle = document.querySelector("h1")
const elFilter = document.getElementById('filter')
const elWorks = document.getElementById('works')
const elNewWorkDescription = document.getElementById('new-work')
const elAddWork = document.getElementById('add-work')

let tarefas = []

function createWorksList(tarefas) {

    elWorks.innerHTML = ""
    tarefas.forEach(tarefa => {
        const elWorkItem = document.createElement("li")
        elWorkItem.classList.add(tarefa.completa ? "complete" : "pending")

        const elWorkDescription = document.createElement("span")
        elWorkDescription.classList.add("description")
        elWorkDescription.innerText = tarefa.Descricao

        const elWorkStatus = document.createElement("span")
        elWorkStatus.classList.add("status")
        elWorkStatus.innerText = tarefa.completa ? "FEITA" : "A FAZER"

        const elWorkApagar = document.createElement("button")
        elWorkApagar.classList.add("apagar")
        elWorkApagar.innerText = "Apagar"

        elWorkItem.appendChild(elWorkDescription)
        elWorkItem.appendChild(elWorkStatus)
        elWorkItem.appendChild(elWorkApagar)

        elWorkItem.addEventListener('click', () => setWorkStatus(tarefa.id, !tarefa.completa))
        elWorkApagar.addEventListener('click', (evt) =>{
            evt.stopPropagation()
            eraseWork(tarefa.id)
        })
        elWorks.appendChild(elWorkItem)
    })
}

async function setWorkStatus(id, completa) {
    try {
        tarefas = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) ?? '[]')
        const index = tarefas.findIndex(tarefa => tarefa.id == id)
        if (index >= 0) {
           tarefas[index].completa =  completa
           localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(tarefas))
           await loadWorks()
        } else {
            console.error("Erro ao trocar status da tarefa")
        }
    } catch {
        console.error("Erro de internet ao trocar status da tarefa")
    }
}


async function eraseWork(id) {
    try {
        tarefas = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) ?? '[]')
        const index = tarefas.findIndex(tarefa => tarefa.id == id)
        if (index >= 0) {
           tarefas.splice(index, 1)
           localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(tarefas))
           await loadWorks()
        } else {
            console.error("Erro ao apagar tarefa")
        }
    } catch {
        console.error("Erro de internet ao apagar tarefa")
    }
}

async function loadWorks() {
    try {
        tarefas = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) ?? '[]')
        createWorksList(tarefas)
        await loadWorksList()
    } catch {
        console.error("Erro de internet ao carregar as tarefas")
    }
}

async function insertNewWork(Descricao) {
    try {
        tarefas = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) ?? '[]')
        tarefas.push({
            id: Date.now(),
            Descricao,
            completa: false
        })
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(tarefas))
        loadWorks()
    } catch {
        console.error("Erro de internet ao criar nova tarefa")
    }
}

elFilter.addEventListener("input", (event) => {
    const filter = event.target.value.toLowerCase()
    const worksFiltered = tarefas.filter(
        tarefa => tarefa.Descricao.toLowerCase().includes(filter)
    )
    createWorksList(worksFiltered)
})

elAddWork.addEventListener("click", evento => {
    const newWorkDescription = elNewWorkDescription.value.trim()
    if (newWorkDescription !== "") {
        insertNewWork(newWorkDescription)
    }
})

elTitle.addEventListener("click", () => {
    document.body.attributes["data-theme"].value = 
        document.body.attributes["data-theme"].value !== "light"
            ? "light" 
            : "dark"
})

window.onload = loadWorks
