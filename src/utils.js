export function sanitizeHTML(text) {
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
export function autoResize(textarea) {
  // Сбрасываем высоты
  textarea.style.height = 'auto'
  // Устанавливаем новую высоту на основе scrollHeight
  textarea.style.height = textarea.scrollHeight + 'px'
}
export function getDomElements() {
  return {
    tasksContainer: document.querySelector('.main-content__tasks-container'),
    addTaskButton: document.querySelector('#add-task'),
    statusBar: document.querySelector('.page-header__status-bar'),
    activeTasksLabel: document.querySelector('.page-header__item--active'),
    doneTasksLabel: document.querySelector('.page-header__item--done'),
    input: document.querySelector('#task-input'),
  }
}
