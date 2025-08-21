import Todo from "./todos";

export default class Project {
    static projects = [];

    static getAllProjects = () => {
        return Project.projects;
    }

    static findByUUID = (uuid) => {
        return Project.projects.find(project => project.uuid === uuid);
    }

    constructor(name) {
        this.uuid = crypto.randomUUID();
        this.name = name;
        this.todos = [];
        Project.projects.push(this);
    }

    addTodo = (todo) => {
        if (todo instanceof Todo === false) return;
        this.todos.push(todo);
    }
}