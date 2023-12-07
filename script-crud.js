//stop in the Class4 item2

const btnAddTask = document.querySelector('.app__button--add-task')
const formAddTask = document.querySelector('.app__form-add-task')
const textarea = document.querySelector('.app__form-textarea')
const ulTasks = document.querySelector('.app__section-task-list')
const btnCancelTask = document.querySelector('.app__form-footer__button--cancel')
const paragraphDescriptionTask = document.querySelector('.app__section-active-task-description')

const btnRemoveCompleted = document.querySelector('#btn-remover-concluidas')
const btnRemoveAllTasks = document.querySelector('#btn-remover-todas')


//get the tasks that already exist in localStorage, if not, declare the array empty
let tasks = JSON.parse(localStorage.getItem('tasks')) || []
let selectedTask = null
let liSelectedTask = null

function updateTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function createElementTask(task) {
    //creating a li element
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    //creating a svg element
    const svg = document.createElement('svg')
    svg.innerHTML = `<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>`

    //creating a p element
    const paragraph = document.createElement('p')
    paragraph.textContent = task.description
    paragraph.classList.add('app__section-task-list-item-description')

    //creating a button and img element 
    //and including the img element inside the button element
    const button = document.createElement('button')
    button.classList.add('app_button-edit')

    button.onclick = () => {
        const newDescription = prompt("Qual é o novo nome da task?")
        if (newDescription) {
            paragraph.textContent = newDescription
            task.description = newDescription
            updateTasks() 
        }
    }

    const imageButton = document.createElement('img')
    imageButton.setAttribute('src', '/imagens/edit.png')
    button.append(imageButton)

    // including elements within the li element
    li.append(svg)
    li.append(paragraph)
    li.append(button)

    if (task.complete) {
        li.classList.add('app__section-task-list-item-complete')
        button.setAttribute('disabled', 'disabled')
    } else {
        //select task
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(element => {
                    element.classList.remove('app__section-task-list-item-active')
                })
    
            //deselect task
            if (selectedTask == task) {
                paragraphDescriptionTask.textContent = ''
                selectedTask = null
                liSelectedTask = null
                return
            }
            selectedTask = task
            liSelectedTask = li
            paragraphDescriptionTask.textContent = task.description
            li.classList.add('app__section-task-list-item-active')
        }
    }

    return li
}

btnAddTask.addEventListener('click', () => {
    formAddTask.classList.toggle('hidden')
} )

formAddTask.addEventListener('submit', (event) => {
    event.preventDefault()
    const task = {
        description: textarea.value
    }
    tasks.push(task)
    const elementTask = createElementTask(task)
    ulTasks.append(elementTask)
    updateTasks()
    textarea.value = ''
    formAddTask.classList.add('hidden')
})

tasks.forEach(task => {
    const elementTask = createElementTask(task)
    ulTasks.append(elementTask)
});

const clearForm = () => {
    textarea.value = '';
    formAddTask.classList.add('hidden');
}

btnCancelTask.addEventListener('click', clearForm);

document.addEventListener('FinishedFocus', () => {
    if (selectedTask && liSelectedTask) {
        liSelectedTask.classList.remove('app__section-task-list-item-active')
        liSelectedTask.classList.add('app__section-task-list-item-complete')
        liSelectedTask.querySelector('button').setAttribute('disabled', 'disabled')
        selectedTask.complete = true
        updateTasks()
    }
})


const removeTasks  = (onlyComplete) => {
    // const seletor = onlyComplete ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"
    let selector =  ".app__section-task-list-item-complete"
    if (!onlyComplete) {
        selector = ".app__section-task-list-item"
    }
    
    document.querySelectorAll(selector).forEach(element => {
        element.remove()
    })
    tasks = onlyComplete ? tasks.filter(task => !task.complete) : []
    paragraphDescriptionTask.textContent = ''
    updateTasks()
}

btnRemoveCompleted.onclick = () => removeTasks(true)
btnRemoveAllTasks.onclick = () => removeTasks(false)