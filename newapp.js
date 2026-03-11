let todos = [];
let search = "";
let filter = "all"; // "all" | "active" | "done"

// DOM elements will be defined after DOMContentLoaded
let searchInput;
let input;
let addBtn;
let list;
let filterAllBtn;
let filterActiveBtn;
let filterDoneBtn;
let counter;
let clearCompletedBtn;

function addTodo(text) {
  text = text.trim();
  if (text === "") return;

  const todo = {
    id: Date.now(),
    text: text,
    done: false,
  };

  todos.push(todo);
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const saved = localStorage.getItem("todos");
  if (saved) {
    todos = JSON.parse(saved);
  }
}

function editTodo(id, newText) {
  newText = newText.trim();
  if (newText === "") return;

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      todos[i].text = newText;
    }
  }
}

function deleteTodo(id) {
  todos = todos.filter(function (todo) {
    return todo.id !== id;
  });
}

function toggleTodo(id) {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      todos[i].done = !todos[i].done;
    }
  }
}
function clearCompleted() {
  todos = todos.filter(function (t) {
    return t.done === false;
  });
}
function render() { 

  list.innerHTML = "";

  let visibleTodos = todos;


if (filter === "active") {
  visibleTodos = todos.filter(t => t.done === false);
} else if (filter === "done") {
  visibleTodos = todos.filter(t => t.done === true);
}

  visibleTodos = visibleTodos.filter(function (t) {
    return t.text.toLowerCase().includes(search);
  });

  for (let i = 0; i < visibleTodos.length; i++) {
    const t = visibleTodos[i];


    const li = document.createElement("li");
    if (t.done) {
  li.classList.add("done");
}
    li.textContent = (t.done ? "✅ " : "❌ ") + t.text + " ";
    // Toggle: li'ye tıklayınca
    li.addEventListener("click", function () {
      toggleTodo(t.id);
      saveTodos();
      render();
    });


// Düzenle butonu
const editBtn = document.createElement("button");
    editBtn.textContent = "Düzenle";
    editBtn.addEventListener("click", function (e) {
      e.stopPropagation(); // li click (toggle) çalışmasın
      const newText = prompt("Yeni metni girin:", t.text);
      if (newText !== null) {
  
        editTodo(t.id, newText);
        saveTodos();
        render();
      }
    });
    li.appendChild(editBtn);



    // Sil butonu
    const delBtn = document.createElement("button");
    delBtn.textContent = "Sil";

    delBtn.addEventListener("click", function (e) {
      e.stopPropagation(); // li click (toggle) çalışmasın
      deleteTodo(t.id);
      saveTodos();
      render();
    });

    li.appendChild(delBtn);
    list.appendChild(li);
  }

  const total = todos.length;
  let remaining = todos.filter(function (t) {
    return t.done === false;
  }).length;
  counter.textContent = "Toplam: " + total + " | Kalan: " + remaining;
}

document.addEventListener("DOMContentLoaded", function () {
  // DOM elements'i al
  searchInput = document.getElementById("searchInput");
  input = document.getElementById("todoInput");
  addBtn = document.getElementById("addBtn");
  list = document.getElementById("todoList");
  filterAllBtn = document.getElementById("filterAll");
  filterActiveBtn = document.getElementById("filterActive");
  filterDoneBtn = document.getElementById("filterDone");
  counter = document.getElementById("counter");
 clearCompletedBtn = document.getElementById("clearCompletedBtn");
  // Event listeners'ı ekle
  searchInput.addEventListener("input", function () {
    search = searchInput.value.toLowerCase();
    render();
  });

  filterAllBtn.addEventListener("click", function () {
    filter = "all";
    render();
  });

  filterActiveBtn.addEventListener("click", function () {
    filter = "active";
    render();
  });

  filterDoneBtn.addEventListener("click", function () {
    filter = "done";
    render();
  });

  // click handler for the button
  addBtn.addEventListener("click", function () {
    const text = input.value;
    addTodo(text);
    saveTodos();
    input.value = "";
    render();
  });

  clearCompletedBtn.addEventListener("click", function () {
  clearCompleted();
  saveTodos();
  render();
});

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      addBtn.click();
    }
  });

  loadTodos();
  render();
});