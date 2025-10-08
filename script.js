const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const streakCount = document.getElementById("streak-count");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let chart;

// Motivational quotes
const quotes = [
  "Push yourself, because no one else is going to do it for you.",
  "Dream it. Believe it. Build it.",
  "Small steps every day lead to big results.",
  "Discipline is the bridge between goals and accomplishment.",
  "Your only limit is your mind."
];
document.getElementById("motivation-quote").textContent = quotes[Math.floor(Math.random() * quotes.length)];

// Add Task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const date = taskDate.value;
  const time = taskTime.value;

  if (!text) return alert("Please enter a task!");
  if (!date || !time) return alert("Please select date and time!");

  const task = { text, date, time, completed: false };
  tasks.push(task);
  saveTasks();
  renderTasks();
  updateChart();
  clearInputs();
});

// Clear input fields
function clearInputs() {
  taskInput.value = "";
  taskDate.value = "";
  taskTime.value = "";
}

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("task-info");
    infoDiv.innerHTML = `<span>${task.text}</span>
                         <span class="task-time">${task.date} | ${task.time}</span>`;
    li.appendChild(infoDiv);

    li.addEventListener("click", (e) => {
      if (!e.target.classList.contains("delete-btn")) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateChart();
      }
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.classList.add("delete-btn");
    delBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
      updateChart();
    });

    li.appendChild(delBtn);
    taskList.appendChild(li);
  });

  updateSummary();
}

// Update chart and stats
function updateChart() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const ctx = document.getElementById("taskChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [{
        data: [completed, pending],
        backgroundColor: ["#5b86e5", "#f4f4f4"],
        borderWidth: 2
      }]
    },
    options: {
      cutout: "75%",
      plugins: { legend: { display: true, position: "bottom" } }
    }
  });
  document.getElementById("chartCenterText").textContent = `${percent}%`;
  streakCount.textContent = completed;
}

// Sidebar summary
function updateSummary() {
  document.getElementById("total-tasks").textContent = tasks.length;
  document.getElementById("completed-tasks").textContent = tasks.filter(t => t.completed).length;
  document.getElementById("pending-tasks").textContent = tasks.filter(t => !t.completed).length;
}

// Initial load
renderTasks();
updateChart();
