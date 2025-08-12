export default class Project {
    static projects = [];

    static getAllProjects = () => {
        return Project.projects;
    }

    constructor(name) {
        this.name = name;
        this.todos = [];
        Project.projects.push(this);
    }

    addTodo = (todo) => {
        this.todos.push(todo);
    }
}