// ToDo WebApp v4.0 - Added advanced task management (Favorites, Tags, Due Dates, Undo)

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const todosContainer = document.getElementById("todos-container");
const filterBtns = document.querySelectorAll(".filter-btn");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const undoBtn = document.getElementById("undo-btn");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const celebration = document.getElementById("celebration");
const tagModal = document.getElementById("tag-modal");
const modalClose = document.getElementById("modal-close");
const tagInput = document.getElementById("tag-input");
const tagSuggestions = document.getElementById("tag-suggestions");
const datePicker = document.getElementById("date-picker");
const dateInput = document.getElementById("date-input");
const dateClear = document.getElementById("date-clear");
const dateSave = document.getElementById("date-save");

let state = {
  todos: [],
  history: [],
  filter: "all",
  theme: "light",
  currentEditingId: null,
  currentTaggingId: null,
  currentDateSettingId: null,
  availableTags: ["Work", "Personal", "Urgent", "Shopping", "Health"],
  draggedElement: null,
  draggedId: null,
};

const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  if (state.todos.length === 0) {
    addDemoTasks();
  }

  applyTheme();
  setupEventListeners();
  render();
});

function addDemoTasks() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  state.todos = [
    {
      id: Date.now().toString() + "1",
      text: "Welcome! Click the checkbox to complete tasks",
      completed: false,
      starred: true,
      tags: ["Personal"],
      dueDate: null,
      createdAt: new Date().toISOString(),
      order: 0,
    },
    {
      id: Date.now().toString() + "2",
      text: "Double-click any task to edit it",
      completed: false,
      starred: false,
      tags: ["Work"],
      dueDate: tomorrow.toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      order: 1,
    },
    {
      id: Date.now().toString() + "3",
      text: "Drag and drop tasks to reorder them",
      completed: false,
      starred: false,
      tags: [],
      dueDate: nextWeek.toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      order: 2,
    },
  ];

  saveTodos();
}

function setupEventListeners() {
  // Task form submission
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
      addTodo(text);
      taskInput.value = "";
    }
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setFilter(btn.dataset.filter);
    });
  });

  themeToggleBtn.addEventListener("click", toggleTheme);
  undoBtn.addEventListener("click", undoLastChange);
  clearCompletedBtn.addEventListener("click", clearCompleted);
  celebration.addEventListener("click", () => {
    celebration.classList.add("hidden");
  });
  modalClose.addEventListener("click", closeTagModal);
  tagModal.addEventListener("click", (e) => {
    if (e.target === tagModal) closeTagModal();
  });
  tagInput.addEventListener("input", (e) => {
    const value = e.target.value.trim();
    if (value) {
      renderTagSuggestions(value);
    }
  });
  tagInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = tagInput.value.trim();
      if (value && state.currentTaggingId) {
        addTagToTodo(state.currentTaggingId, value);
        tagInput.value = "";
        renderTagSuggestions("");
      }
    }
  });
  dateClear.addEventListener("click", () => {
    if (state.currentDateSettingId) {
      removeDueDateFromTodo(state.currentDateSettingId);
      closeDatePicker();
    }
  });
  dateSave.addEventListener("click", () => {
    if (state.currentDateSettingId && dateInput.value) {
      setDueDateForTodo(state.currentDateSettingId, dateInput.value);
      closeDatePicker();
    }
  });
  document.addEventListener("click", (e) => {
    if (!datePicker.contains(e.target) && !e.target.closest(".date-btn")) {
      closeDatePicker();
    }
  });
  todosContainer.addEventListener("dragover", handleDragOver);
  todosContainer.addEventListener("drop", handleDrop);
}

function handleDragStart(e) {
  const todoElement = e.target.closest(".todo");
  if (!todoElement) return;
  state.draggedElement = todoElement;
  state.draggedId = todoElement.dataset.id;
  todoElement.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", todoElement.outerHTML);
  setTimeout(() => {
    if (todoElement.classList.contains("dragging")) {
      todoElement.style.opacity = "0.5";
    }
  }, 0);
}

function handleDragEnd(e) {
  const todoElement = e.target.closest(".todo");
  if (!todoElement) return;
  todoElement.classList.remove("dragging");
  todoElement.style.opacity = "";
  state.draggedElement = null;
  state.draggedId = null;
  document.querySelectorAll(".todo").forEach((el) => {
    el.classList.remove("drag-over-top", "drag-over-bottom");
  });
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  const afterElement = getDragAfterElement(todosContainer, e.clientY);
  const dragging = document.querySelector(".dragging");
  if (!dragging) return;

  document.querySelectorAll(".todo").forEach((el) => {
    el.classList.remove("drag-over-top", "drag-over-bottom");
  });

  if (afterElement == null) {
    const lastTodo = todosContainer.querySelector(
      ".todo:last-child:not(.dragging)"
    );
    if (lastTodo) {
      lastTodo.classList.add("drag-over-bottom");
    }
  } else {
    afterElement.classList.add("drag-over-top");
  }
}

function handleDrop(e) {
  e.preventDefault();
  if (!state.draggedId) return;
  const afterElement = getDragAfterElement(todosContainer, e.clientY);
  const afterId = afterElement ? afterElement.dataset.id : null;
  document.querySelectorAll(".todo").forEach((el) => {
    el.classList.remove("drag-over-top", "drag-over-bottom", "dragging");
  });

  reorderTodos(state.draggedId, afterId);
  state.draggedElement = null;
  state.draggedId = null;
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

function reorderTodos(draggedId, afterId) {
  saveToHistory();

  const draggedTodo = state.todos.find((todo) => todo.id === draggedId);
  if (!draggedTodo) return;
  state.todos = state.todos.filter((todo) => todo.id !== draggedId);
  if (afterId === null) {
    state.todos.push(draggedTodo);
  } else {
    const targetIndex = state.todos.findIndex((todo) => todo.id === afterId);
    if (targetIndex !== -1) {
      state.todos.splice(targetIndex, 0, draggedTodo);
    } else {
      state.todos.push(draggedTodo);
    }
  }

  state.todos.forEach((todo, index) => {
    todo.order = index;
  });
  saveTodos();
  render();
}

function addTodo(text) {
  saveToHistory();
  const newTodo = {
    id: Date.now().toString(),
    text: text,
    completed: false,
    starred: false,
    tags: [],
    dueDate: null,
    createdAt: new Date().toISOString(),
    order: state.todos.length,
  };

  state.todos.push(newTodo);
  saveTodos();
  render();
}

function toggleTodo(id) {
  saveToHistory();
  state.todos = state.todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  render();
  checkAllCompleted();
}

function deleteTodo(id) {
  saveToHistory();
  state.todos = state.todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

function toggleStar(id) {
  saveToHistory();
  state.todos = state.todos.map((todo) =>
    todo.id === id ? { ...todo, starred: !todo.starred } : todo
  );
  saveTodos();
  render();
}

function editTodo(id, newText) {
  if (!newText) {
    deleteTodo(id);
    return;
  }
  saveToHistory();
  state.todos = state.todos.map((todo) =>
    todo.id === id ? { ...todo, text: newText } : todo
  );
  saveTodos();
  render();
}

function addTagToTodo(id, tag) {
  saveToHistory();
  state.todos = state.todos.map((todo) => {
    if (todo.id === id && !todo.tags.includes(tag)) {
      return { ...todo, tags: [...todo.tags, tag] };
    }
    return todo;
  });

  if (!state.availableTags.includes(tag)) {
    state.availableTags.push(tag);
    localStorage.setItem("availableTags", JSON.stringify(state.availableTags));
  }
  saveTodos();
  render();
}

function removeTagFromTodo(id, tag) {
  saveToHistory();
  state.todos = state.todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, tags: todo.tags.filter((t) => t !== tag) };
    }
    return todo;
  });
  saveTodos();
  render();
}

function setDueDateForTodo(id, date) {
  saveToHistory();
  state.todos = state.todos.map((todo) =>
    todo.id === id ? { ...todo, dueDate: date } : todo
  );
  saveTodos();
  render();
}

function removeDueDateFromTodo(id) {
  saveToHistory();
  state.todos = state.todos.map((todo) =>
    todo.id === id ? { ...todo, dueDate: null } : todo
  );
  saveTodos();
  render();
}

function clearCompleted() {
  saveToHistory();
  state.todos = state.todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
}

function setFilter(filter) {
  state.filter = filter;
  render();
}

function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  saveTheme();
  applyTheme();
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

function saveToHistory() {
  const snapshot = JSON.parse(JSON.stringify(state.todos));
  state.history.push(snapshot);
  if (state.history.length > 10) {
    state.history.shift();
  }
  updateUndoButton();
}

function undoLastChange() {
  if (state.history.length === 0) return;
  const previousState = state.history.pop();
  state.todos = previousState;
  saveTodos();
  render();
  updateUndoButton();
}

function updateUndoButton() {
  undoBtn.disabled = state.history.length === 0;
}

function checkAllCompleted() {
  const hasActiveTodos = state.todos.some((todo) => !todo.completed);
  if (state.todos.length > 0 && !hasActiveTodos) {
    celebration.classList.remove("hidden");
    setTimeout(() => {
      celebration.classList.add("hidden");
    }, 5000);
  }
}

function getFilteredTodos() {
  let filtered = [...state.todos];

  switch (state.filter) {
    case "active":
      filtered = filtered.filter((todo) => !todo.completed);
      break;
    case "completed":
      filtered = filtered.filter((todo) => todo.completed);
      break;
    case "favorites":
      filtered = filtered.filter((todo) => todo.starred);
      break;
    case "all":
    default:
      break;
  }

  filtered.sort((a, b) => {
    if (a.order === undefined) a.order = 0;
    if (b.order === undefined) b.order = 0;
    return a.order - b.order;
  });

  return filtered;
}

function getDueDateStatus(dueDate) {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays <= 2) return "due-soon";
  return "normal";
}

function formatDueDate(dueDate) {
  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  if (diffDays <= 7) return `In ${diffDays} days`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function openTagModal(id) {
  finishCurrentEdit();
  closeDatePicker();
  state.currentTaggingId = id;
  tagModal.classList.remove("hidden");
  tagInput.value = "";
  tagInput.focus();
  renderTagSuggestions("");
}

function closeTagModal() {
  tagModal.classList.add("hidden");
  state.currentTaggingId = null;
}

function renderTagSuggestions(query) {
  const todo = state.todos.find((t) => t.id === state.currentTaggingId);
  if (!todo) return;

  const existingTags = todo.tags;
  const suggestions = state.availableTags
    .filter((tag) => !existingTags.includes(tag))
    .filter((tag) => !query || tag.toLowerCase().includes(query.toLowerCase()));

  tagSuggestions.innerHTML = suggestions
    .map(
      (tag) => `
    <div class="tag-suggestion" data-tag="${tag}">${tag}</div>
  `
    )
    .join("");

  tagSuggestions.querySelectorAll(".tag-suggestion").forEach((el) => {
    el.addEventListener("click", () => {
      addTagToTodo(state.currentTaggingId, el.dataset.tag);
      tagInput.value = "";
      renderTagSuggestions("");
    });
  });
}

function openDatePicker(id, event) {
  finishCurrentEdit();
  closeTagModal();
  state.currentDateSettingId = id;
  const todo = state.todos.find((t) => t.id === id);

  if (todo && todo.dueDate) {
    dateInput.value = todo.dueDate;
  } else {
    dateInput.value = "";
  }
  datePicker.classList.remove("hidden");
  const rect = event.target.closest(".date-btn").getBoundingClientRect();
  datePicker.style.top = `${rect.bottom + 5}px`;
  datePicker.style.left = `${rect.left}px`;
}

function closeDatePicker() {
  datePicker.classList.add("hidden");
  state.currentDateSettingId = null;
}

function createTodoElement(todo) {
  const todoDiv = document.createElement("div");
  todoDiv.className = "todo";
  todoDiv.dataset.id = todo.id;
  todoDiv.draggable = true;

  if (todo.completed) {
    todoDiv.classList.add("completed");
  }

  const dueDateStatus = getDueDateStatus(todo.dueDate);
  if (dueDateStatus === "overdue") {
    todoDiv.classList.add("overdue");
  } else if (dueDateStatus === "due-soon") {
    todoDiv.classList.add("due-soon");
  }

  todoDiv.addEventListener("dragstart", handleDragStart);
  todoDiv.addEventListener("dragend", handleDragEnd);
  const dragHandle = document.createElement("div");
  dragHandle.className = "drag-handle";
  dragHandle.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  `;

  const checkbox = document.createElement("div");
  checkbox.className = "todo-checkbox";
  checkbox.addEventListener("click", () => toggleTodo(todo.id));
  const content = document.createElement("div");
  content.className = "todo-content";
  const text = document.createElement("div");
  text.className = "todo-text";
  text.textContent = todo.text;
  text.addEventListener("dblclick", () => startEditing(todo.id, text));
  const meta = document.createElement("div");
  meta.className = "todo-meta";
  if (todo.tags.length > 0) {
    const tagsDiv = document.createElement("div");
    tagsDiv.className = "todo-tags";
    todo.tags.forEach((tag) => {
      const tagEl = document.createElement("span");
      tagEl.className = "tag";
      tagEl.innerHTML = `
        ${tag}
        <span class="tag-remove" data-tag="${tag}">×</span>
      `;
      tagEl.querySelector(".tag-remove").addEventListener("click", (e) => {
        e.stopPropagation();
        removeTagFromTodo(todo.id, tag);
      });
      tagsDiv.appendChild(tagEl);
    });
    meta.appendChild(tagsDiv);
  }

  if (todo.dueDate) {
    const dueDateEl = document.createElement("div");
    dueDateEl.className = "todo-due-date";
    if (dueDateStatus === "overdue") dueDateEl.classList.add("overdue");
    if (dueDateStatus === "due-soon") dueDateEl.classList.add("due-soon");

    dueDateEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      ${formatDueDate(todo.dueDate)}
    `;

    meta.appendChild(dueDateEl);
  }

  content.appendChild(text);
  if (meta.children.length > 0) {
    content.appendChild(meta);
  }

  const actions = document.createElement("div");
  actions.className = "todo-actions";

  const starBtn = document.createElement("button");
  starBtn.className = `todo-action star-btn ${todo.starred ? "starred" : ""}`;
  starBtn.title = "Star/Favorite";
  starBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  `;
  starBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
    toggleStar(todo.id);
  });
  const tagBtn = document.createElement("button");
  tagBtn.className = "todo-action tag-btn";
  tagBtn.title = "Add Tag";
  tagBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
      <line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>
  `;
  tagBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
    openTagModal(todo.id);
  });

  const dateBtn = document.createElement("button");
  dateBtn.className = "todo-action date-btn";
  dateBtn.title = "Set Due Date";
  dateBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  `;
  dateBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
    openDatePicker(todo.id, e);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "todo-action delete-btn";
  deleteBtn.title = "Delete Task";
  deleteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  `;
  deleteBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
    deleteTodo(todo.id);
  });

  actions.appendChild(starBtn);
  actions.appendChild(tagBtn);
  actions.appendChild(dateBtn);
  actions.appendChild(deleteBtn);
  todoDiv.appendChild(dragHandle);
  todoDiv.appendChild(checkbox);
  todoDiv.appendChild(content);
  todoDiv.appendChild(actions);

  return todoDiv;
}

function finishCurrentEdit() {
  if (state.currentEditingId) {
    const input = document.querySelector(".edit-input");
    if (input) {
      input.blur();
    }
    state.currentEditingId = null;
  }
}

function startEditing(id, textElement) {
  const todo = state.todos.find((t) => t.id === id);
  if (!todo || todo.completed) return;
  finishCurrentEdit();
  closeTagModal();
  closeDatePicker();
  state.currentEditingId = id;
  const input = document.createElement("input");
  input.type = "text";
  input.className = "edit-input";
  input.value = todo.text;

  textElement.replaceWith(input);
  input.focus();
  input.select();

  const finishEdit = () => {
    const newText = input.value.trim();
    if (newText && newText !== todo.text) {
      editTodo(id, newText);
    } else {
      render();
    }
    state.currentEditingId = null;
  };

  input.addEventListener("blur", finishEdit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      finishEdit();
    } else if (e.key === "Escape") {
      state.currentEditingId = null;
      render();
    }
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
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "no-todos";
    emptyMsg.textContent =
      state.filter === "all"
        ? "No tasks yet. Add one to get started!"
        : `No ${state.filter} tasks`;
    todosContainer.appendChild(emptyMsg);
  } else {
    filteredTodos.forEach((todo) => {
      const todoEl = createTodoElement(todo);
      todosContainer.appendChild(todoEl);
    });
  }
  updateUndoButton();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(state.todos));
}

function saveTheme() {
  localStorage.setItem("theme", state.theme);
}

function loadState() {
  const savedTodos = localStorage.getItem("todos");

  if (savedTodos) {
    const loadedTodos = JSON.parse(savedTodos);
    state.todos = loadedTodos.map((todo, index) => {
      return {
        ...todo,
        tags: todo.tags || [],
        dueDate: todo.dueDate || null,
        starred: todo.starred || false,
        order: todo.order !== undefined ? todo.order : index,
      };
    });
  } else {
    addDemoTasks();
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    state.theme = savedTheme;
  }

  const savedTags = localStorage.getItem("availableTags");
  if (savedTags) {
    state.availableTags = JSON.parse(savedTags);
  }
}
