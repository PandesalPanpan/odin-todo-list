import Project from "./projects";

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
            <button id="create-project-btn" type="button">Create New Project</button>
            <button id="all-project-todos" type="button">View All Todos</button>
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

        // TODO: Form Submit of Create Project should be event delegated
        // Listen to contentDOM submits
        View.contentDOM.addEventListener('submit', View.handleContentSubmit);
    }

    static handleContentClick = (event) => {
        if (event.target.id === 'create-todo') View.handleViewCreateTodoForm(event);
    }

    static handleContentSubmit = (event) => {
        event.preventDefault();
        if (event.target.id === 'create-todo-form') View.handleSubmitCreateTodo(event)
            
        // Check if the submit is for create-project-form
        if (event.target.id === 'create-project-form') View.handleSubmitCreateProject(event);
    }

    static handleViewCreateTodoForm = (event) => {
        View.contentDOM.innerHTML = `
        <form id="create-todo-form" data-project-uuid="${event.target.dataset.projectUuid}">
            <label for="todo-title">
                <input type="text" id="todo-title" name="todo-title" required>
            </label>
            <button type="submit">Create Todo</button>
        </form>
        `
    
    }

    static handleSubmitCreateTodo = (event) => {
        console.log(event.target.dataset.projectUuid);
        // TODO: Create the todo and push it to the todos of project
    }

    static handleViewAllProjectTodos = (event) => {
        View.renderAllProjectTodos(Project.getAllProjects());
    }

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

    static renderProjectTodos = (project) => {
        View.contentDOM.innerHTML = `
        <button type="button" id="create-todo" data-project-uuid="${project.uuid}">Create New Todo</button>
        <ul>
            ${project.todos.map(todo => {
                return `<li>${todo.title}</li>`
            }).join('')}
        </ul>
        `
    }

    // Default Project
    static renderAllProjectTodos = (projects) => {
        const todos = projects.flatMap(project => {
            return project.todos;
        });

        
        View.contentDOM.innerHTML = `<ul>
            ${todos.map(todo => {
                return `<li>${todo.title}</li>`
            }).join('')}
        </ul>
        `
        
    }
}