// Экранирование символов
function sanitizeHTML(text) {
  const symbolReplacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => symbolReplacements[char])
}

//Создание елемента с задачей
function createTask(inputValue) {
  const safeInputValue = sanitizeHTML(inputValue)
  const taskElement = document.createElement('div')
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
            ${safeInputValue}
            </label>
            <div class="main-content__delete-button-wrapper">
              <button
                aria-label="Удалить задачу"
                class="main-content__task-delete"
              ></button>
            </div>`

  taskElement.innerHTML = innerDiv
  return taskElement
}

const tasksContainer = document.querySelector('.main-content__tasks-container')
const addTaskButton = document.querySelector('#add-task')
const statusBar = document.querySelector('.page-header__status-bar')
const activeTasksLabel = document.querySelector('.page-header__item--active')
const doneTasksLabel = document.querySelector('.page-header__item--done')
let countOfActive = Number(activeTasksLabel.dataset.count)
let countOfDone = Number(doneTasksLabel.dataset.count)

// клик по кнопке "Добавить"
addTaskButton.addEventListener('click', (event) => {
  event.preventDefault()
  const input = document.querySelector('#task-input')
  const inputData = input.value.trim()
  input.value = ''

  if (inputData.length > 0) {
    if (countOfActive === 0) {
      ;[...tasksContainer.children].forEach((child) => {
        child.classList.add('hidden')
      })
      statusBar.classList.remove('hidden')
    }

    countOfActive += 1
    const activeCountText = activeTasksLabel.querySelector(
      '.page-header__text--active'
    )
    const doneCountText = doneTasksLabel.querySelector(
      '.page-header__text--done'
    )
    activeCountText.textContent = `${countOfActive} активных`
    doneCountText.textContent = `${countOfDone} выполнено`
    tasksContainer.prepend(createTask(inputData))
  }
})
