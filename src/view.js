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
            <button type="button">Create New Project</button>
            <div class="project-list">
            </div>

        </div>
        <div id="content"></div>
        `
        View.contentDOM = document.querySelector('#content');
    }
    
    // Render the available projects
    static render = () => {
        View.rootDOM.innerHTML = `
        <div class="container">
            <div class="sidebar">
                <button>
                Create Project
                </button>
                <div class="project-list">

                </div>
            </div>
            <div id="main">
            </div>
        </div>
        `
    }

    // Rendering the list of todos in a project
    static renderProjectNavigation = (projects) => {
        const projectList = document.querySelector('.project-list');
    
        projectList.innerHTML = `<ul>
            ${projects.map(project => {
                return `<li>
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