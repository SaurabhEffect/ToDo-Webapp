// ToDo WebApp 2.1 - Added Task Filtering
// Refactored code

const form = document.querySelector("form");
const input = document.querySelector("input");
const todosContainer = document.querySelector(".todos");
const filterBtns = document.querySelectorAll(".filter-btn");

let state = {
  todos: [],
  filter: "all",
};

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  setupEventListeners();
  render();
});

function setupEventListeners() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const todoText = input.value.trim();
    if (todoText) {
      addTodo(todoText);
      input.value = "";
    }
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setFilter(btn.dataset.filter);
    });
  });
}

function render() {
  todosContainer.innerHTML = "";
  filterBtns.forEach((btn) => {
    if (btn.dataset.filter === state.filter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  const filteredTodos = getFilteredTodos();
  filteredTodos.forEach((todo) => {
    const todoEl = createTodoElement(todo);
    todosContainer.appendChild(todoEl);
  });
}

function createTodoElement(todo) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  if (todo.completed) {
    todoDiv.classList.add("completed");
  }

  const textEl = document.createElement("span");
  textEl.innerHTML = todo.text;
  textEl.addEventListener("click", () => {
    toggleTodo(todo.id);
  });

  const closeEl = document.createElement("span");
  closeEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
  closeEl.classList.add("delete");
  closeEl.addEventListener("click", () => {
    deleteTodo(todo.id);
  });

  todoDiv.appendChild(textEl);
  todoDiv.appendChild(closeEl);
  return todoDiv;
}

function getFilteredTodos() {
  switch (state.filter) {
    case "active":
      return state.todos.filter((todo) => !todo.completed);
    case "completed":
      return state.todos.filter((todo) => todo.completed);
    case "all":
    default:
      return state.todos;
  }
}

function addTodo(text) {
  const newTodo = {
    id: Date.now().toString(),
    text: text,
    completed: false,
  };
  state.todos.push(newTodo);
  saveState();
  render();
}

function toggleTodo(id) {
  state.todos = state.todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveState();
  render();
}

function deleteTodo(id) {
  state.todos = state.todos.filter((todo) => todo.id !== id);
  saveState();
  render();
}

function setFilter(filter) {
  state.filter = filter;
  render();
}

function saveState() {
  localStorage.setItem("todos", JSON.stringify(state.todos));
}

function loadState() {
  const savedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
  state.todos = savedTodos;
}
