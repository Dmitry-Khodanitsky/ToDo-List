import { getDomElements, sanitizeHTML } from './utils.js'
import { state, saveToLocalStorage, updateCounters } from './state.js'

const { tasksContainer, input, activeTasksLabel, doneTasksLabel, statusBar } = getDomElements()
// Создание елемента с задачей
export function createTask(content, taskID) {
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
  label.textContent = `${content}`

  if (currentTask && currentTask.completed) {
    label.classList.add('checked')
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
export const createEmptyTaskList = () => {
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

export const markAsDone = (event) => {
  const checkbox = event.target

  const taskElement = checkbox.closest('.main-content__task-element')
  if (!taskElement) {
    console.warn('[markAsDone] Task element not found')
    return
  }

  const label = taskElement.querySelector('.main-content__task-label')
  if (!label) {
    console.warn('[markAsDone] Label not found')
    return
  }

  const taskId = label.dataset.taskId
  if (!taskId) {
    console.warn(`[markAsDone] Task ID: ${taskId} not found`)
    return
  }
  const task = state.tasks.find(task => task.id === taskId)

  task.completed = !task.completed
  label.classList.toggle('checked', task.completed)
  checkbox.checked = task.completed

  updateCounters()
  saveToLocalStorage()
  updateStatusBar()
}

// контроллер удаления задчи
const deleteTask = (taskID) => {
  const taskToDelete = state.tasks.find(task => task.id === taskID)
  if (!taskToDelete) {
    console.warn(`Task with ID ${taskID} not found`)
    return
  }
  state.tasks = state.tasks.filter(task => task.id !== taskID)
  updateCounters()
  saveToLocalStorage()
  renderTasks()
}

// контроллер добавление задачи
export const addTask = () => {
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
    id: crypto.randomUUID(),
    content: sanitizeHTML(inputData),
    completed: false,
  }
  state.tasks.unshift(taskObject) // обновляем состояние
  updateCounters()
  input.style.height = 'auto'

  saveToLocalStorage()
}

export const updateStatusBar = () => {
  const activeCountText = activeTasksLabel.querySelector('.page-header__text--active')
  const doneCountText = doneTasksLabel.querySelector('.page-header__text--done')
  activeCountText.textContent = `${state.countOfActive} активных`
  doneCountText.textContent = `${state.countOfDone} выполнено`
}

export function renderTasks() {
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
