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
const saveToLocalStorage = () => {
  localStorage.setItem('toDoAppState', JSON.stringify(state),
  )
}
const loadFromLocalStorage = () => {
  const savedState = localStorage.getItem('toDoAppState')
  return JSON.parse(savedState)
}

const initialState = {
  tasksCount: 0,
  countOfActive: 0,
  countOfDone: 0,
  tasks: [],
}

// Загружаем состояние из LocalStorage или используем начальное
let state = loadFromLocalStorage() || initialState

// Создание елемента с задачей
function createTask(content, taskID) {
  const taskElement = document.createElement('li')
  taskElement.classList.add('main-content__task-element')

  const checkboxWrapper = document.createElement('div')
  checkboxWrapper.classList.add('main-content__checkbox-wrapper')

  const checkboxInput = document.createElement('input')
  checkboxInput.setAttribute('type', 'checkbox')
  checkboxInput.setAttribute('name', 'done')
  checkboxInput.classList.add('main-content__task-checkbox')
  checkboxWrapper.append(checkboxInput)

  const currentTask = state.tasks.find(task => task.id === taskID)
  if (currentTask) {
    checkboxInput.checked = currentTask.completed
  }

  const label = document.createElement('label')
  label.classList.add('main-content__task-label')
  label.setAttribute('for', 'done')
  label.setAttribute('data-task-id', `${taskID}`)
  label.innerHTML = `${content}`

  if (currentTask && currentTask.completed) {
    label.style.textDecoration = 'line-through'
    label.style.color = '#888'
  }

  const deleteButtonWrapper = document.createElement('div')
  deleteButtonWrapper.classList.add('main-content__delete-button-wrapper')
  deleteButtonWrapper.innerHTML = `<button
                aria-label="Удалить задачу"
                class="main-content__task-delete-icon">
                </button>`
  taskElement.append(checkboxWrapper, label, deleteButtonWrapper)
  deleteButtonWrapper.addEventListener('click', () => deleteTask(taskID))

  checkboxInput.addEventListener('change', markAsDone)
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

const updateStatusBar = () => {
  const activeCountText = activeTasksLabel.querySelector('.page-header__text--active')
  const doneCountText = doneTasksLabel.querySelector('.page-header__text--done')
  activeCountText.textContent = `${state.countOfActive} активных`
  doneCountText.textContent = `${state.countOfDone} выполнено`
}

// функция рендера элементов
function renderTasks() {
  tasksContainer.innerHTML = ''
  input.value = ''
  input.focus()
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
  updateStatusBar()
}

const tasksContainer = document.querySelector('.main-content__tasks-container')
const addTaskButton = document.querySelector('#add-task')
const statusBar = document.querySelector('.page-header__status-bar')
const activeTasksLabel = document.querySelector('.page-header__item--active')
const doneTasksLabel = document.querySelector('.page-header__item--done')
const input = document.querySelector('#task-input')

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

// контроллер удаления задчи
const deleteTask = (taskID) => {
  const taskToDelete = state.tasks.find(task => task.id === taskID)
  state.tasksCount -= 1
  if (taskToDelete) {
    taskToDelete.completed === true
      ? (state.countOfDone -= 1)
      : (state.countOfActive -= 1)
  }
  state.tasks = state.tasks.filter(task => task.id !== taskID)
  saveToLocalStorage()
  renderTasks()
}

// контроллер добавление задачи
const addTask = () => {
  const inputData = input.value.trim()

  // перенести в рендер
  if (inputData === '') {
    input.classList.add('input-error')
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
  input.style.height = 'auto'

  saveToLocalStorage()
}

const markAsDone = (event) => {
  const checkbox = event.target

  const taskElement = checkbox.closest('.main-content__task-element')
  if (!taskElement) return

  const label = taskElement.querySelector('.main-content__task-label')
  if (!label) return

  const taskId = Number(label.dataset.taskId)

  state.tasks.forEach((task) => {
    if (task.id === taskId) {
      task.completed = !task.completed // Переключаем состояние

      // подсчет количества задач
      state.countOfActive = state.tasks.filter(task => !task.completed).length
      state.countOfDone = state.tasks.filter(task => task.completed).length
    }
  })
  if (checkbox.checked) {
    label.style.textDecoration = 'line-through'
    label.style.color = '#888'
  }
  else {
    label.style.textDecoration = 'none'
    label.style.color = ''
  }

  updateStatusBar()
  saveToLocalStorage()
}
renderTasks()
