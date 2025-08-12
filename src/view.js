export default class View {
    static dom;

    static setDOM = (dom) => {
        View.dom = dom;
    }
    
    // Render the available projects
    static render = () => {
        View.dom.innerHTML = `
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
    static renderProjects = (projects) => {
        // Place
    }

    // Default Project
    static renderAllTodos = (projects) => {
        const todos = projects.flatMap(project => {
            return project.todos;
        });

        View.dom.innerHTML = `
        <ul>
            ${todos.map(todo => {
                return `<li>${todo.title}</li>`
            }).join('')}
        </ul>
        `
        
    }
}