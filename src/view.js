import Project from "./projects";
import Todo from "./todos";

export default class View {
    static rootDOM;
    static contentDOM;

    static setRootDOM = (dom) => {
        View.rootDOM = dom;
    }

    // Add the static initializer
    static initialize = (dom) => {
        View.setRootDOM(dom);
        View.rootDOM.innerHTML = `
        <div class="sidebar">
            <div class="main-buttons">
                <button id="create-project-btn" type="button">Create New Project</button>
                <button id="all-project-todos" type="button">View All Todos</button>
            </div>
            <div id="project-list">
            </div>

        </div>
        <div id="content"></div>
        `
        View.contentDOM = document.querySelector('#content');
        View.attachEventListener();
    }

    static attachEventListener = () => {
        // Event Delegation for Project list List
        const projectList = document.querySelector('#project-list')
        projectList.addEventListener('click', View.handleNavigateProject);

        const createProjectBtn = document.querySelector('#create-project-btn');
        createProjectBtn.addEventListener('click', View.handleViewCreateProject);

        const viewAllProjectTodosBtn = document.querySelector('#all-project-todos');
        viewAllProjectTodosBtn.addEventListener('click', View.handleViewAllProjectTodos);

        View.contentDOM.addEventListener('click', View.handleContentClick);
        View.contentDOM.addEventListener('submit', View.handleContentSubmit);
    }

    static handleViewAllProjectTodos = (event) => {
        View.renderAllProjectTodos(Project.getAllProjects());
    }

    static handleContentClick = (event) => {
        if (event.target.id === 'create-todo') {
            View.handleViewCreateTodoForm(event)
            return;
        }

        if (event.target.classList.contains("todo-list-item") || (event.target.closest('li')?.classList.contains("todo-list-item"))) {
            View.handleViewTodoDetail(event);
            return;
        };

        if (event.target.id === "cancel-edit-form") {
            View.handleCancelEdit(event);
            return;
        }

    }

    static handleCancelEdit = (event) => {
        // Render the todos of the project
        const project = Project.findByUUID(event.target.closest('form').dataset.projectUuid)
        // If not found then return an error
        if (!project) {
            console.error("Cannot return to non-existing project");
            return;
        }

        View.renderProjectTodos(project);
    }

    static handleViewTodoDetail = (event) => {
        const projectUuid = event.target.dataset.projectUuid ?? event.target.closest('li').dataset.projectUuid;
        const todoUuid = event.target.dataset.todoUuid ?? event.target.closest('li').dataset.todoUuid;

        const project = Project.findByUUID(projectUuid)

        if (!project) {
            console.error('Project not found with UUID');
            return;
        };

        const todo = project.todos.find(todo => {
            return todo.uuid === event.target.dataset.todoUuid || event.target.closest('li').dataset.todoUuid;
        })

        if (!todo) {
            console.error(`${todo} is not found`);
            return;
        }

        if (!(todo instanceof Todo)) {
            console.error("Todo is an array or does not exist");
            return;
        }

        // Edit in detail
        View.contentDOM.innerHTML = `
        <form id="edit-todo-form" data-project-uuid="${project.uuid}" data-todo-uuid="${todo.uuid}"">
            <label for="todo-title">Title
                <input value="${todo.title ?? ''}" type="text" id="todo-title" name="todo-title" required>
            </label>
            <label for="todo-description">Description
                <input value="${todo.description ?? ''}" type="text" id="todo-description" name="todo-description">
            </label>
            <label for="todo-due-date">Due Date
                <input value="${todo.dueDate ?? ''}" type="date" id="todo-due-date" name="todo-due-date">
            </label>
            <label for="todo-priority">Priority
                <input ${todo.priority ? 'checked' : ''} type="checkbox" id="todo-priority" name="todo-priority">
            </label>
            <button type="submit">Update Todo</button>
            <button id="cancel-edit-form" type="button">Cancel</button>
        </form>
        `


    }

    static handleContentSubmit = (event) => {
        event.preventDefault();
        if (event.target.id === 'create-todo-form') {
            View.handleSubmitCreateTodo(event);
            return;
        }

        // Check if its the edit-todo-form
        if (event.target.id === 'edit-todo-form') {
            View.handleSubmitEditTodo(event);
            return;
        }

        // Check if the submit is for create-project-form
        if (event.target.id === 'create-project-form') {
            View.handleSubmitCreateProject(event);
            return;
        }

    }


    /* Todo Form */
    static handleViewCreateTodoForm = (event) => {
        View.contentDOM.innerHTML = `
        <form id="create-todo-form" data-project-uuid="${event.target.dataset.projectUuid}">
            <label for="todo-title">Title
                <input type="text" id="todo-title" name="todo-title" required>
            </label>
            <label for="todo-description">Description
                <input type="text" id="todo-description" name="todo-description">
            </label>
            <label for="todo-due-date">Due Date
                <input type="date" id="todo-due-date" name="todo-due-date">
            </label>
            <label for="todo-priority">Priority
                <input type="checkbox" id="todo-priority" name="todo-priority">
            </label>
            <button type="submit">Create Todo</button>
        </form>
        `
    }

    static handleSubmitEditTodo = (event) => {
        console.log(event.target.dataset.projectUuid);
        // Get project instance
        const project = Project.findByUUID(event.target.dataset.projectUuid);

        if (!project) {
            console.error("Project not found");
            return;
        }

        // Get Todo inside the project
        const todo = project.todos.find(todo => todo.uuid === event.target.dataset.todoUuid);

        if (!todo) {
            console.error("Todo not found");
            return;
        }

        if (!(todo instanceof Todo)) {
            console.error(`${todo} is not a Todo Object`);
            return;
        }

        // Edit the changes
        const formData = new FormData(event.target);
        todo.title = formData.get('todo-title');
        todo.description = formData.get('todo-description');
        todo.dueDate = formData.get('todo-due-date');
        todo.priority = formData.get('todo-priority');

        // Manually save
        project.save();

        // Go back to project todo list
        View.renderProjectTodos(project);
    }

    static handleSubmitCreateTodo = (event) => {
        const project = Project.findByUUID(event.target.dataset.projectUuid);

        if (project === undefined) {
            console.log("Project is not found");
            return;
        }

        const formData = new FormData(event.target);
        const todoTitle = formData.get('todo-title');
        const todoDescription = formData.get('todo-description');
        const todoDueDate = formData.get('todo-due-date');
        const todoPriority = formData.get('todo-priority');

        const todo = new Todo(todoTitle, todoDescription, todoDueDate, todoPriority);
        project.addTodo(todo);

        View.renderProjectTodos(project);

    }

    /* Project Form */
    static handleViewCreateProject = (event) => {
        View.contentDOM.innerHTML = `
        <form id="create-project-form">
            <label for="project-name">
                <input type="text" id="project-name" name="project-name" required>
            </label>
            <button type="submit">Create Project</button>
        </form>
        `;
    }

    static handleSubmitCreateProject = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const projectName = formData.get('project-name');

        // Validate Form
        // Check if it is not null
        if (!projectName) return;

        // Create a New project
        const newProject = new Project(projectName);
        // Rerender the project navigation
        View.renderProjectNavigation(Project.getAllProjects());
        // Render the project todos
        View.renderProjectTodos(newProject);
    }

    static handleNavigateProject = (event) => {
        const projectDOM = event.target.closest('.project-list-item');
        if (!projectDOM) {
            return;
        }

        const project = Project.findByUUID(projectDOM.dataset.projectUuid);

        if (project === undefined) {
            return;
        }

        // Replace the #main with all the todos
        View.renderProjectTodos(project);
    }

    // Rendering the list of todos in a project
    static renderProjectNavigation = (projects) => {
        const projectList = document.querySelector('#project-list');

        projectList.innerHTML = `<ul>
            ${projects.map((project, index) => {
            return `<li class="project-list-item" data-project-uuid="${project.uuid}">
                    ${project.name}
                </li>`;
        }).join('')}
        </ul>`
    }

    // Takes a single project instance
    static renderProjectTodos = (project) => {
        View.contentDOM.innerHTML = `
        <button type="button" id="create-todo" data-project-uuid="${project.uuid}">Create New Todo</button>
        <ul class="todo-list">
            ${project.todos.map(todo => {
            return `<li class="todo-list-item" data-todo-uuid="${todo.uuid}" data-project-uuid="${project.uuid}">
                ${View.renderTodoCard(todo)}
                </li>`
        }).join('')}
        </ul>
        `
    }

    // Takes Multiple Projects
    static renderAllProjectTodos = (projects) => {
        const todosWithProject = projects.flatMap(project =>
            project.todos.map(todo => ({ todo, projectUuid: project.uuid }))
        )

        View.contentDOM.innerHTML = `<ul class="todo-list">
        ${todosWithProject.map(({ todo, projectUuid }) => {
            return `<li class="todo-list-item" data-todo-uuid="${todo.uuid}" data-project-uuid="${projectUuid}">
            ${View.renderTodoCard(todo)}
            </li>`
        }).join('')}
        </ul>`;

    }

    static renderTodoCard = (todo) => {
        return `<div class="card-todo">
        <h4>${todo.title}</h4>
        <div class="date-and-priority">
            <p>Due: ${todo.dueDate}</p>
            <div>Priority <input type="checkbox" ${todo.priority ? 'checked' : ''}></div>
        </div>
        </div>`
    }
}