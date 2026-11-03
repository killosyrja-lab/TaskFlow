// =====================================
// TASKFLOW APPLICATION
// =====================================


// 1. SELECT HTML ELEMENTS

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const priorityInput = document.getElementById("priorityInput");

const taskList = document.getElementById("taskList");

const emptyMessage = document.getElementById("emptyMessage");

const totalTasksElement = document.getElementById("totalTasks");

const completedTasksElement = document.getElementById("completedTasks");

const pendingTasksElement = document.getElementById("pendingTasks");

const filterButtons = document.querySelectorAll(".filter-btn");


// 2. LOAD TASKS FROM LOCAL STORAGE

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem("taskflow_tasks");

        const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

        return Array.isArray(parsedTasks) ? parsedTasks : [];

    } catch (error) {
        console.error("Error loading tasks:", error);
        return [];
    }
}

let tasks = loadTasks();

let currentFilter = "all";


// 3. SAVE TASKS

function saveTasks() {

    localStorage.setItem(
        "taskflow_tasks",
        JSON.stringify(tasks)
    );

}


// 4. ADD NEW TASK

function addTask(title, priority) {

    const newTask = {

        id: Date.now() + Math.random(),

        title: title,

        priority: priority,

        completed: false

    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();

}


// 5. DELETE TASK

function deleteTask(id) {

    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });

    saveTasks();

    renderTasks();

}


// 6. COMPLETE OR UNCOMPLETE TASK

function toggleTask(id) {

    const task = tasks.find(function(task) {

        return task.id === id;

    });

    if (task) {

        task.completed = !task.completed;

    }

    saveTasks();

    renderTasks();

}


// 7. FILTER TASKS

function getFilteredTasks() {

    if (currentFilter === "pending") {

        return tasks.filter(function(task) {
            return !task.completed;
        });

    }

    if (currentFilter === "completed") {

        return tasks.filter(function(task) {
            return task.completed;
        });

    }

    return tasks;

}


// 8. UPDATE STATISTICS

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    totalTasksElement.textContent = total;

    completedTasksElement.textContent = completed;

    pendingTasksElement.textContent = pending;

}


// 9. DISPLAY TASKS

function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

        if (tasks.length === 0) {

            emptyMessage.textContent =
                "No tasks yet. Add your first task!";

        } else {

            emptyMessage.textContent =
                "No tasks found in this category.";

        }

    } else {

        emptyMessage.style.display = "none";

    }


    filteredTasks.forEach(function(task) {

        // CREATE TASK ELEMENT

        const li = document.createElement("li");

        li.classList.add("task-item");

        if (task.completed) {
            li.classList.add("completed");
        }


        // TASK INFORMATION

        const taskInfo = document.createElement("div");

        taskInfo.classList.add("task-info");


        // CHECKBOX

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.classList.add("task-checkbox");

        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {

            toggleTask(task.id);

        });


        // TASK TITLE

        const title = document.createElement("span");

        title.classList.add("task-title");

        title.textContent = task.title;


        // PRIORITY

        const priority = document.createElement("span");

        priority.classList.add("priority", task.priority);

        priority.textContent = task.priority;


        // DELETE BUTTON

        const deleteButton = document.createElement("button");

        deleteButton.classList.add("delete-btn");

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            deleteTask(task.id);

        });


        // APPEND ELEMENTS

        taskInfo.appendChild(checkbox);

        taskInfo.appendChild(title);

        li.appendChild(taskInfo);

        li.appendChild(priority);

        li.appendChild(deleteButton);

        taskList.appendChild(li);

    });


    updateStatistics();

}


// 10. FILTER BUTTONS

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        renderTasks();

    });

});


// 11. ADD TASK FORM

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = taskInput.value.trim();

    const priority = priorityInput.value;

    if (title === "") {
        return;
    }

    addTask(title, priority);

    taskInput.value = "";

    priorityInput.value = "Medium";

    taskInput.focus();

});


// 12. START APPLICATION

renderTasks();

console.log("TaskFlow successfully initialized!");