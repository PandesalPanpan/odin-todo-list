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
        createProjectBtn.addEventListener('click', View.handleCreateProject);

        const viewAllProjectTodosBtn = document.querySelector('#all-project-todos');
        viewAllProjectTodosBtn.addEventListener('click', View.handleViewAllProjectTodos);
    }

    static handleViewAllProjectTodos = (event) => {
        View.renderAllProjectTodos(Project.getAllProjects());
    }

    static handleCreateProject = (event) => {
        View.contentDOM.innerHTML = `
        <form id="create-project-form">
            <label for="project-name">
                <input type="text" id="project-name" name="project-name" required>
            </label>
            <button type="submit">Create Project</button>
        </form>
        `;
        // TODO: Save the new project
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