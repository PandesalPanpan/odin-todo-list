export default class Project {
    static projects = [];

    static getAllProjects = () => {
        return Project.projects;
    }

    constructor(name, todos) {
        this.name = name;
        this.todos = todos;

        Project.projects.push(this);
    }
}