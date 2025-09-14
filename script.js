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

  const innerDiv = `
            <div class="main-content__checkbox-wrapper">
              <input
                type="checkbox"
                name="done"
                class="main-content__task-checkbox"
                checked
              />
            </div>
            <label for="done" class="main-content__task-label">
            ${content}
            </label>
            <div class="main-content__delete-button-wrapper">
              <button
                aria-label="Удалить задачу"
                class="main-content__task-delete-icon"
              ></button>
            </div>`

  taskElement.innerHTML = innerDiv
  return taskElement
}

// функция рендера элементов
function renderTasks() {
  toogleUiState()
  if (state.uiState === false) {
    console.log('task list is empty')
    // обновить отображение активных и выполненных задач
    // tasksContainer.innerHTML = ''
    return
  }
  tasksContainer.innerHTML = ''
  state.tasks.forEach((task) => {
    tasksContainer.appendChild(createTask(task.content))
  })
  statusBar.classList.remove('hidden')
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

const toogleUiState = () => {
  state.uiState = state.tasksCount ? true : false
}

const deleteTask = (taskID) => {
  state.tasksCount -= 1
  state.tasks.filter((task) => {
    task.id !== taskID
  })
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
  input.value = '' // опиимизировать в функцию

  // эта часть кода и ниже отвечает за рендер, нужно перенести
  const activeCountText = activeTasksLabel.querySelector('.page-header__text--active')
  const doneCountText = doneTasksLabel.querySelector('.page-header__text--done')
  activeCountText.textContent = `${state.countOfActive} активных`
  doneCountText.textContent = `${state.countOfDone} выполнено`

  input.style.height = 'auto'
}
renderTasks()
