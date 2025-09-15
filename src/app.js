import { autoResize, getDomElements } from './utils.js'
import { renderTasks, addTask } from './tasks.js'

const { input, addTaskButton } = getDomElements()

input.addEventListener('input', () => {
  autoResize(input)
})

addTaskButton.addEventListener('click', (event) => {
  event.preventDefault()
  addTask()
  renderTasks()
})

renderTasks()
