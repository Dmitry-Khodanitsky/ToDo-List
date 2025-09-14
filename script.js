// helpers
// Экранирование символов
function sanitizeHTML(text) {
  const symbolReplacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#039;',
  }
  return text.replace(/[&<>"']/g, char => symbolReplacements[char])
}

// автоматическое увеличение textarea в зависимости от размера контента
function autoResize(textarea) {
  // Сбрасываем высоты
  textarea.style.height = 'auto'
  // Устанавливаем новую высоту на основе scrollHeight
  textarea.style.height = textarea.scrollHeight + 'px'
}

// состояние приложения
const state = {
  tasksCount: 0,
  countOfActive: 0,
  countOfDone: 0,
  tasks: [],
}

// Создание елемента с задачей
function createTask(content, taskID) {
  const taskElement = document.createElement('li')
  taskElement.classList.add('main-content__task-element')

  const checkboxWrapper = document.createElement('div')
  checkboxWrapper.classList.add('main-content__checkbox-wrapper')

  checkboxWrapper.innerHTML = `<input
                type="checkbox"
                name="done"
                class="main-content__task-checkbox"
                checked
              />`

  const label = document.createElement('label')
  label.classList.add('main-content__task-label')
  label.setAttribute('for', 'done')
  label.setAttribute('dat-task-id', `${taskID}`)
  label.innerHTML = `${content}`

  const deleteButtonWrapper = document.createElement('div')
  deleteButtonWrapper.classList.add('main-content__delete-button-wrapper')
  deleteButtonWrapper.innerHTML = `<button
                aria-label="Удалить задачу"
                class="main-content__task-delete-icon">
                </button>`
  taskElement.append(checkboxWrapper, label, deleteButtonWrapper)
  deleteButtonWrapper.addEventListener('click', () => deleteTask(taskID))
  return taskElement
}
// функция создания пустого контейнера с задачами иконка и текст/
const createEmptyTaskList = () => {
  const taskListItem = document.createElement('li')
  taskListItem.classList.add('main-content__list-icon')

  const taskListImg = document.createElement('img')
  taskListImg.setAttribute('src', 'assets/icons/list.svg')
  taskListImg.setAttribute('alt', 'У вас еще нет задач')

  taskListItem.append(taskListImg)

  const taskListTitle = document.createElement('li')
  taskListTitle.classList.add('main-content__title')

  const title = document.createElement('h3')
  title.innerHTML = `Задач пока нет <br>Добавьте свою первую задачу!`

  taskListTitle.append(title)

  tasksContainer.innerHTML = ''
  tasksContainer.append(taskListItem, taskListTitle)

  return tasksContainer
}

// функция рендера элементов
function renderTasks() {
  tasksContainer.innerHTML = ''
  if (state.tasks.length === 0) {
    console.log('task list is empty')
    createEmptyTaskList()
    statusBar.classList.add('hidden')
    return
  }
  state.tasks.forEach((task) => {
    tasksContainer.appendChild(createTask(task.content, task.id))
  })
  statusBar.classList.remove('hidden')
  const activeCountText = activeTasksLabel.querySelector('.page-header__text--active')
  const doneCountText = doneTasksLabel.querySelector('.page-header__text--done')
  activeCountText.textContent = `${state.countOfActive} активных`
  doneCountText.textContent = `${state.countOfDone} выполнено`
}

const tasksContainer = document.querySelector('.main-content__tasks-container')
const addTaskButton = document.querySelector('#add-task')
const statusBar = document.querySelector('.page-header__status-bar')
const activeTasksLabel = document.querySelector('.page-header__item--active')
const doneTasksLabel = document.querySelector('.page-header__item--done')
const input = document.querySelector('#task-input')
input.value = ''
input.focus()

// Событие textarea при вводе input
input.addEventListener('input', () => {
  autoResize(input)
})

// клик по кнопке "Добавить"
addTaskButton.addEventListener('click', (event) => {
  event.preventDefault()
  addTask()
  renderTasks()
})

const deleteTask = (taskID) => {
  const taskToDelete = state.tasks.find(task => task.id === taskID)
  state.tasksCount -= 1
  if (taskToDelete) {
    taskToDelete.completed === true ? state.countOfDone -= 1 : state.countOfActive -= 1
  }
  state.tasks = state.tasks.filter(task => task.id !== taskID)
  renderTasks()
}

const addTask = () => {
  const inputData = input.value.trim()
  if (inputData === '') {
    input.classList.add('input-error')
    input.value = ''
    setTimeout(() => {
      input.classList.remove('input-error')
    }, 700)

    return
  }

  const taskObject = {
    id: Date.now() * Math.floor(Math.random() * 10),
    content: sanitizeHTML(inputData),
    completed: false,
  }
  state.tasks.unshift(taskObject) // обновляем состояние
  state.tasksCount += 1
  state.countOfActive += 1
  input.value = ''
  input.style.height = 'auto'
}
renderTasks()
