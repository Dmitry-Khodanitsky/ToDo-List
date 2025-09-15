export const saveToLocalStorage = () => {
  try {
    localStorage.setItem('toDoAppState', JSON.stringify(state))
  }
  catch (error) {
    console.error('Error saving to LocalStorage:', error)
  }
}
export const loadFromLocalStorage = () => {
  try {
    if (!localStorage.getItem('toDoAppState')) return null
    const savedState = localStorage.getItem('toDoAppState')
    return JSON.parse(savedState)
  }
  catch (error) {
    console.error('Error loading from LocalStorage:', error)
    return null
  }
}

export const initialState = {
  countOfActive: 0,
  countOfDone: 0,
  tasks: [],
}

// Загружаем состояние из LocalStorage или используем начальное
export const state = loadFromLocalStorage() || initialState

export function updateCounters() {
  state.countOfActive = state.tasks.filter(task => !task.completed).length
  state.countOfDone = state.tasks.length - state.countOfActive
}
