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
        projectList.addEventListener('click', event => console.log("Hello world"));

        const createProjectBtn = document.querySelector('#create-project-btn');
        createProjectBtn.addEventListener('click', event => console.log("create button"));
    }

    // Rendering the list of todos in a project
    static renderProjectNavigation = (projects) => {
        const projectList = document.querySelector('#project-list');
    
        projectList.innerHTML = `<ul>
            ${projects.map((project, index) => {
                return `<li class="project-list-item data-project-id=${index} data-project-name="${project.name}">
                    ${project.name}
                </li>`;s
            }).join('')}
        </ul>`
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