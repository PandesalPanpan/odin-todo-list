export default class View {
    constructor(container) {
        // Receive the DOM container
        this.dom = container;
    }

    // Render the available projects
    render = () => {
        this.dom.textContent = 'Hello World?';
    }

    // Rendering the list of todos in a project
    renderProjects = (projects) => {
        let text = '';
        projects.forEach(project => {
            text += project.name + ' ';
        });
        
        this.dom.textContent = `${text}`;
    }

    // Default Project
    renderAllTodos = (projects) => {
        const todos = projects.flatMap(project => {
            return project.todos;
        });

        this.dom.innerHTML = `
        <ul>
            ${todos.map(todo => {
                return `<li>${todo.title}</li>`
            }).join('')}
        </ul>
        `
        
    }
}