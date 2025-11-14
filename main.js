// ToDo WebApp 2.0 - Enhanced UI & UX with LocalStorage

let form = document.querySelector("form");
let input = document.querySelector("input");
let todos = document.querySelector(".todos");

document.addEventListener("DOMContentLoaded", loadTodos);

function createTodoElement(task) {
  let todo = document.createElement("div");
  let textEl = document.createElement("span");

  textEl.innerHTML = task.text;
  todo.appendChild(textEl);
  if (task.completed) {
    todo.classList.add("completed");
  }
  textEl.addEventListener("click", function () {
    todo.classList.toggle("completed");
    saveTodos();
  });

  let closeEl = document.createElement("span");
  closeEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
  closeEl.classList.add("delete");
  closeEl.addEventListener("click", function (e) {
    todos.removeChild(todo);
    saveTodos();
  });

  todo.appendChild(closeEl);
  todo.classList.add("todo");
  return todo;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let value = input.value;
  if (!value.trim()) return;

  const newTask = {
    text: value,
    completed: false,
  };

  const todoElement = createTodoElement(newTask);
  todos.appendChild(todoElement);
  input.value = "";

  saveTodos();
});

function saveTodos() {
  const todoElements = document.querySelectorAll(".todo");
  const tasks = [];

  todoElements.forEach((todoEl) => {
    const text = todoEl.querySelector("span:first-child").innerHTML;
    const completed = todoEl.classList.contains("completed");
    tasks.push({ text, completed });
  });
  localStorage.setItem("todos", JSON.stringify(tasks));
}

function loadTodos() {
  const savedTasks = JSON.parse(localStorage.getItem("todos") || "[]");
  savedTasks.forEach((task) => {
    const todoElement = createTodoElement(task);
    todos.appendChild(todoElement);
  });
}
