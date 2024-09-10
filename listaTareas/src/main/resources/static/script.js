// Info date
const dateNumber = document.getElementById('dateNumber');
const dateText = document.getElementById('dateText');
const dateMonth = document.getElementById('dateMonth');
const dateYear = document.getElementById('dateYear');

// Tasks Container
const tasksContainer = document.getElementById('tasksContainer');

const setDate = () => {
    const date = new Date();
    dateNumber.textContent = date.toLocaleString('es', { day: 'numeric' });
    dateText.textContent = date.toLocaleString('es', { weekday: 'long' });
    dateMonth.textContent = date.toLocaleString('es', { month: 'short' });
    dateYear.textContent = date.toLocaleString('es', { year: 'numeric' });
};

// Función para obtener todas las tareas del backend
const fetchTasks = () => {
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task', 'roundBorder');
                taskElement.textContent = task.name;

                // Si la tarea está marcada como completada, agrega la clase 'done'
                if (task.completed) {
                    taskElement.classList.add('done');
                }

                // Añade evento para cambiar el estado de la tarea al hacer clic
                taskElement.addEventListener('click', changeTaskState);

                tasksContainer.appendChild(taskElement);
            });
        });
};

// Llama a esta función cuando se cargue la página
document.addEventListener('DOMContentLoaded', fetchTasks);


const changeTaskState = event => {
    event.target.classList.toggle('done');

    // Obtener el estado actual de la tarea
    const isCompleted = event.target.classList.contains('done');
    const taskName = event.target.textContent;

    // Actualizar el estado de la tarea en la base de datos
    fetch(`/tasks/${taskName}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: taskName, completed: isCompleted }),
    });
};


// Añadir una tarea al DOM
const addTaskToDOM = task => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task', 'roundBorder');
    taskElement.textContent = task.name;

    // Crear el botón de eliminar
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('deleteButton');
    deleteButton.onclick = () => deleteTask(task.id, taskElement);  // Llama a la función de eliminación
    taskElement.appendChild(deleteButton);

    tasksContainer.prepend(taskElement);
};


// Añadir una nueva tarea
const addNewTask = event => {
    event.preventDefault();
    const { value } = event.target.taskText;
    if (!value) return;

    // Enviar la tarea al backend
    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: value, completed: false }),
    })
    .then(response => response.json())
    .then(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.prepend(taskElement);
        event.target.reset();
    });
};



// Eliminar tarea
const deleteTask = (id, taskElement) => {
    if (!confirm("¿Seguro que deseas eliminar esta tarea?")) return;

    fetch(`/tasks/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        taskElement.remove();  // Eliminar la tarea del DOM
    })
    .catch(error => console.error('Error al eliminar la tarea:', error));
};
// Crear el elemento visual de la tarea
const createTaskElement = (task) => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task', 'roundBorder');
    taskElement.textContent = task.name;
    taskElement.setAttribute('data-id', task.id);

    // Si la tarea está completada, agregar la clase 'done' para que se pinte de rojo
    if (task.completed) {
        taskElement.classList.add('done');
    }

    taskElement.addEventListener('click', () => {
        taskElement.classList.toggle('done');
        const completed = taskElement.classList.contains('done');

        // Actualizar el estado de la tarea en el backend
        fetch(`/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }),
        });
    });

    return taskElement;
};


// Ordenar tareas completadas y no completadas
const order = () => {
    const done = [];
    const toDo = [];
    tasksContainer.childNodes.forEach(el => {
        el.classList.contains('done') ? done.push(el) : toDo.push(el);
    });
    return [...toDo, ...done];
};

const renderOrderedTasks = () => {
    order().forEach(el => tasksContainer.appendChild(el));
};


setDate();
