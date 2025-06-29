
document.getElementById("todo-form").addEventListener("submit", addTask);

function priorityOrder(priority) {
  switch (priority.toLowerCase()) {
    case "priority: high":
      return 1;
    case "priority: medium":
      return 2;
    case "priority: low":
      return 3;
    default:
      return 4;
  }
};

function addTask(event) {
  event.preventDefault();
  const todo = document.getElementById("task-name").value.trim();
  const date = document.getElementById("task-date").value;
  const priority = document.getElementById("task-priority").value;

  if(date < new Date().toISOString().split("T")[0]){
    alert("Date cannot be in the past");
    return;
  }

  saveToLocalStorage(todo, date, priority);
  renderTasks();
  document.getElementById("todo-form").reset();
}

function deleteTask(index) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos.splice(index, 1);
  localStorage.removeItem("todos");
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTasks();
}

function toggleComplete(index) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos[index].completed = !todos[index].completed;
  localStorage.removeItem("todos");
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTasks();
}

function saveToLocalStorage(todo, date, priority) {
  const todoList = JSON.parse(localStorage.getItem("todos")) || [];
  todoList.push({
    name: todo,
    date: date,
    priority: priority,
    completed: false,
  });
  localStorage.setItem("todos", JSON.stringify(todoList));
}

function renderTasks() {
  filterTodaysTasks();
  filterFutureTasks();
  filterCompletedTasks();
}

function filterTodaysTasks() {
  const todos = JSON.parse(localStorage.getItem("todos"));
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];

  const todaysTasks = todos
    .map((task, index) => ({ ...task, originalIndex: index }))
    .filter((task) => task.date === formattedToday && !task.completed)
    .sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority));
  renderTodaysTasks(todaysTasks);
}

function filterFutureTasks() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const formattedToday = new Date().toISOString().split("T")[0];

  const futureTasks = todos
    .map((task, index) => ({ ...task, originalIndex: index }))
    .filter((task) => task.date > formattedToday && !task.completed)
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB; 
      }
      return priorityOrder(a.priority) - priorityOrder(b.priority);
    });

  renderFutureTasks(futureTasks);
}


function filterCompletedTasks() {
  const todos = JSON.parse(localStorage.getItem("todos"));
  const completedTasks = todos
    .map((task, index) => ({ ...task, originalIndex: index }))
    .filter((task) => task.completed);

  renderCompletedTasks(completedTasks);
}

function renderTodaysTasks(todaysTasks) {
  const todayTasks = document.getElementById("today-tasks");
  todayTasks.innerHTML = "";
  todayTasks.append(...todaysTasks.map(createTaskElement));
}

function renderFutureTasks(futureTasks) {
  const futuresTasks = document.getElementById("future-tasks");
  futuresTasks.innerHTML = "";
  futuresTasks.append(...futureTasks.map(createTaskElement));
}

function renderCompletedTasks(completedTasks) {
  const completeTasks = document.getElementById("completed-tasks");
  completeTasks.innerHTML = "";
  completeTasks.append(...completedTasks.map(createTaskElement));
}

function createTaskElement(task, index) {
  const taskElement = document.createElement("li");
  taskElement.classList.add("task-item");
  if (task.completed) taskElement.classList.add("completed");

  taskElement.innerHTML = `
    <div class="task-info">
      <span class="task-name">${index+1}. ${task.name}</span>
      <span class="task-date">${task.date}</span>
      <span class="task-priority">${task.priority}</span>
    </div>
    <div class="task-buttons">
      <button onclick="deleteTask(${task.originalIndex})">🗑️</button>
      <button onclick="toggleComplete(${task.originalIndex})" style="${task.completed ?"display: none" : ""}">
        ${task.completed ? "✅" : "✔️"}
      </button>
    </div>
  `;
  return taskElement;
}

renderTasks();
