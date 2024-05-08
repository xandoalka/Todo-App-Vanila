const createTaskButton = document.querySelector(".create-task");
const wrapper = document.querySelector(".wrapper");
const container = document.querySelector(".container");
const backButton = document.querySelector(".back-button");
const todoContainer = document.querySelector(".todo-container");
const todoDate = document.getElementById("todo-date");
const signingButton = document.querySelector(".signing-button");
const loginPage = document.querySelector(".loginPage");
const deleteButton = document.querySelector(".delete-task");
const showAll = document.querySelector(".show-all");

createTaskButton.addEventListener("click", function () {
  container.style.display = "none";

  wrapper.style.display = "block";
  wrapper.style.opacity = 0;
  wrapper.style.transition = "opacity 1.5s";

  setTimeout(() => {
    wrapper.style.opacity = 1;
  }, 10);
});

backButton.addEventListener("click", function () {
  wrapper.style.display = "none";

  container.style.display = "block";
  container.style.opacity = 0;
  container.style.transition = "opacity 1.5s";

  setTimeout(() => {
    container.style.opacity = 1;
  }, 10);
});

todoDate.addEventListener("change", function () {
  if (this.value === "") {
    loadTasks();
  } else {
    filterTasksByDate(this.value);
  }
});

document.querySelector(".form").addEventListener("submit", createTask);
document.addEventListener("DOMContentLoaded", loadTasks);
document.addEventListener("DOMContentLoaded", todayDate);

setInterval(deleteExpiredTasks, 3000);

function generateId() {
  return new Date();
}

function createTask() {
  const id = generateId();
  const taskvalue = document.getElementById("task").value;
  const categoryValue = document.getElementById("category").value;
  const startDateValue = document.getElementById("start-date").value;
  const endDateValue = document.getElementById("end-date").value;
  const startTimeValue = document.getElementById("start-time").value;
  const endTimeValue = document.getElementById("end-time").value;

  saveTaskToLocalStorage({
    id,
    taskvalue,
    categoryValue,
    startDateValue,
    endDateValue,
    startTimeValue,
    endTimeValue,
  });
}

function saveTaskToLocalStorage(taskData) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskData);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  todoContainer.innerHTML = "";

  tasks.forEach(renderTask);
}

function filterTasksByDate(selectedDate) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const filteredTasks = tasks.filter(
    (task) => task.startDateValue === selectedDate
  );

  todoContainer.innerHTML = "";

  filteredTasks.forEach(renderTask);
}

function deleteTask(taskId) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function todayDate() {
  let today = new Date().toISOString().split("T")[0];
  document.getElementById("start-date").value = today;
  document.getElementById("end-date").value = today;
}

function deleteExpiredTasks() {
  const now = new Date();
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => {
    const endTime = new Date(`${task.endDateValue}T${task.endTimeValue}`);
    return endTime > now;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function renderTask(taskData) {
  const task = document.createElement("div");
  task.classList.add("todo-item");
  task.id = taskData.id;

  const taskName = document.createElement("h4");
  taskName.textContent = taskData.taskvalue;
  task.appendChild(taskName);

  const time = document.createElement("p");
  time.textContent = `${taskData.startTimeValue} - ${taskData.endTimeValue}`;
  task.appendChild(time);

  const category = document.createElement("p");
  category.textContent = taskData.categoryValue;
  task.appendChild(category);

  const date = document.createElement("p");
  date.classList.add("todo-date");
  date.textContent = taskData.startDateValue;
  task.appendChild(date);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-task");
  const deleteIcon = document.createElement("img");
  deleteIcon.setAttribute("src", "assets/images/bin.png");
  deleteButton.appendChild(deleteIcon);
  deleteButton.addEventListener("click", () => deleteTask(taskData.id));
  task.appendChild(deleteButton);

  todoContainer.appendChild(task);
}