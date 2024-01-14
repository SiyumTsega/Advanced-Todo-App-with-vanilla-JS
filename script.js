const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const todoContainerElement = document.querySelector('[data-todo-list]')
const todoTitleElement = document.querySelector('[data-todo-title]')
const taskCountElement = document.querySelector('[data-todo-count]')
const taskContainerElement = document.querySelector('[data-tasks-container]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTaskBtn = document.querySelector(
  '[data-clear-complete-task-btn]'
)

const LOCAL_STORAGE_LIST_KEY = 'task.list'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

listsContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

taskContainerElement.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find((list) => (list.id = selectedListId))
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    )
    selectedTask.complete = e.target.checked
    save()
    renderTasksCount(selectedList)
  }
})

clearCompleteTaskBtn.addEventListener('click', (e) => {
  const selectedList = lists.find((list) => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete)
  saveAndRender()
})

deleteListButton.addEventListener('click', (e) => {
  lists = lists.filter((list) => list.id !== selectedListId)
  selectedListId = null
  saveAndRender()
})

newListForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const listName = newListInput.value
  if (listName == null || listName === '') return
  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
})

newTaskForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return
  const task = createTask(taskName)
  newTaskInput.value = null
  const selectedList = lists.find((list) => list.id === selectedListId)
  selectedList.tasks.push(task)
  saveAndRender()
})

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  }
}

function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
  }
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function saveAndRender() {
  save()
  render()
}

function render() {
  clearElement(listsContainer)
  renderLists()

  const selectedList = lists.find((list) => list.id == selectedListId)
  if (selectedListId == null) {
    todoContainerElement.style.display = 'none'
  } else {
    todoContainerElement.style.display = ''
    todoTitleElement.innerText = selectedList.name
  }
  renderTasksCount(selectedList)
  clearElement(taskContainerElement)
  renderTasks(selectedList)
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkBox = taskElement.querySelector('input')
    checkBox.id = task.id
    checkBox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    taskContainerElement.appendChild(taskElement)
  })
}

function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add('list-name')
    listElement.innerText = list.name
    if (list.id === selectedListId) {
      listElement.classList.add('active-list')
    }
    listsContainer.appendChild(listElement)
  })
}

function renderTasksCount(selectedList) {
  const incompleteTasksCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length
  const taskCountString = incompleteTasksCount === 1 ? 'task' : 'tasks'
  taskCountElement.innerText = `${incompleteTasksCount} ${taskCountString} remaining`
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

render()
