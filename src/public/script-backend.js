const URL_API = "http://localhost:3030"

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
        const response = await fetch(`${URL_API}/tarefa/${id}/${completa ? 'completa' : 'incompleta'}`,{
            method: 'PATCH',
            credentials: 'include'
        })
        if (response.ok) {
            await loadWorks()
        } else if (response.status = 401) {
            window.location.href = `${URL_API}/auth/github`
        } else {
            console.error("Erro ao trocar status da tarefa")
        }
    } catch {
        console.error("Erro de internet ao trocar status da tarefa")
    }
}


async function eraseWork(id) {
    try {
        const response = await fetch(`${URL_API}/tarefa/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        if (response.ok) {
            await loadWorks()
        } else if (response.status = 401) {
            window.location.href = `${URL_API}/auth/github`
        } else {
            console.error("Erro ao apagar tarefa")
        }
    } catch {
        console.error("Erro de internet ao apagar tarefa")
    }
}

async function loadWorks() {
    try {
        const response = await fetch(`${URL_API}/tarefas`, {
            credentials: 'include'
        })
        if (response.ok) {
            tarefas = await response.json()
            createWorksList(tarefas)
        } else if (response.status = 401) {
            window.location.href = `${URL_API}/auth/github`
        } else {
            console.error("Erro ao carregar as tarefas")
        }
    } catch {
        console.error("Erro de internet ao carregar as tarefas")
    }
}

async function insertNewWork(Descricao) {
    try {
        const response = await fetch(`${URL_API}/tarefa`, { 
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Descricao,
                completa: false
            })
        })
        if (response.ok) {
            elNewWorkDescription.value = ''
            await loadWorks()
        } else if (response.status = 401) {
            window.location.href = `${URL_API}/auth/github`
        } else {
            console.error("Erro ao criar nova tarefa")
        }
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
