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
}