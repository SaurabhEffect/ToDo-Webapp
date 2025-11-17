// ToDo WebApp v3.1 - Added Theme Toggle

const form = document.querySelector("form");
const input = document.querySelector("input");
const todosContainer = document.querySelector(".todos");
const filterBtns = document.querySelectorAll(".filter-btn");
const themeToggleBtn = document.querySelector("#theme-toggle-btn");

let state = {
  todos: [],
  filter: "all",
  theme: "light",
};

const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  applyTheme();
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

  todosContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  todosContainer.addEventListener("drop", handleDrop);
  themeToggleBtn.addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    saveTheme();
    applyTheme();
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
  if (filteredTodos.length === 0) {
    todosContainer.innerHTML = `<span class="no-todos">No tasks ${
      state.filter === "all" ? "" : state.filter
    }</span>`;
  } else {
    filteredTodos.forEach((todo) => {
      const todoEl = createTodoElement(todo);
      todosContainer.appendChild(todoEl);
    });
  }
}

function createTodoElement(todo) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  todoDiv.dataset.id = todo.id;
  todoDiv.draggable = true;

  if (todo.completed) {
    todoDiv.classList.add("completed");
  }
  let clickTimer = null;
  const textEl = document.createElement("span");
  textEl.innerHTML = todo.text;
  textEl.addEventListener("click", () => {
    if (todoDiv.classList.contains("editing")) {
      return;
    }
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      toggleTodo(todo.id);
    }, 200);
  });

  textEl.addEventListener("dblclick", (e) => {
    clearTimeout(clickTimer);
    const parent = e.target.closest(".todo");
    if (parent.classList.contains("completed")) {
      return;
    }
    parent.classList.add("editing");
    const editInput = document.createElement("input");
    editInput.classList.add("edit-input");
    editInput.value = todo.text;
    parent.appendChild(editInput);
    editInput.focus();
    editInput.addEventListener("blur", () => {
      if (document.body.contains(parent)) {
        editTodo(todo.id, editInput.value.trim());
      }
    });

    editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        editInput.blur();
      }
      if (e.key === "Escape") {
        render();
      }
    });
  });

  const closeEl = document.createElement("span");
  closeEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
  closeEl.classList.add("delete");
  closeEl.addEventListener("click", () => {
    deleteTodo(todo.id);
  });

  todoDiv.appendChild(textEl);
  todoDiv.appendChild(closeEl);
  todoDiv.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragging");
    e.dataTransfer.setData("text/plain", todo.id);
  });
  todoDiv.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
  });
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

function handleDrop(e) {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData("text/plain");
  const afterElement = getDragAfterElement(todosContainer, e.clientY);
  const afterId = afterElement ? afterElement.dataset.id : null;
  reorderTodos(draggedId, afterId);
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".todo:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function addTodo(text) {
  const newTodo = {
    id: Date.now().toString(),
    text: text,
    completed: false,
  };
  state.todos.push(newTodo);
  saveTodos();
  render();
}

function toggleTodo(id) {
  state.todos = state.todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  render();
}

function deleteTodo(id) {
  state.todos = state.todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

function setFilter(filter) {
  state.filter = filter;
  render();
}

function editTodo(id, newText) {
  if (newText === "") {
    deleteTodo(id);
  } else {
    state.todos = state.todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    saveTodos();
    render();
  }
}

function reorderTodos(draggedId, afterId) {
  const draggedTodo = state.todos.find((todo) => todo.id === draggedId);
  state.todos = state.todos.filter((todo) => todo.id !== draggedId);
  if (afterId === null) {
    state.todos.push(draggedTodo);
  } else {
    const targetIndex = state.todos.findIndex((todo) => todo.id === afterId);
    state.todos.splice(targetIndex, 0, draggedTodo);
  }
  saveTodos();
  render();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(state.todos));
}

function saveTheme() {
  localStorage.setItem("theme", state.theme);
}

function loadState() {
  const savedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
  state.todos = savedTodos;
  const savedTheme = localStorage.getItem("theme") || "light";
  state.theme = savedTheme;
}

function applyTheme() {
  if (state.theme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggleBtn.innerHTML = sunIcon;
  } else {
    document.body.classList.remove("dark-mode");
    themeToggleBtn.innerHTML = moonIcon;
  }
}
