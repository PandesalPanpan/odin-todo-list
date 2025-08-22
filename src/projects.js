import Todo from "./todos";

export default class Project {
    static projectStorage = 'odinTodoApp'

    static fromJSON = (data) => {
        const project = new Project(data.name, true);
        project.uuid = data.uuid;
        project.todos = data.todos.map(todoData => {
            const todo = new Todo(
                todoData.title,
                todoData.description,
                todoData.dueDate,
                todoData.priority
            )
            return todo;
        })

        return project;
    }

    static getAllProjects = () => {
        const data = JSON.parse(localStorage.getItem(Project.projectStorage) || '{"projects":[]}');
        return data.projects.map(projectData => Project.fromJSON(projectData));
    }

    static saveAllProjects = (projects) => {
        const data = {
            projects: projects.map(project => project.toJSON())
        };
        localStorage.setItem(Project.projectStorage, JSON.stringify(data));
    }

    static findByUUID = (uuid) => {
        return Project.getAllProjects().find(project => project.uuid === uuid);
    }
    constructor(name, skipSave = false) {
        this.uuid = crypto.randomUUID();
        this.name = name;
        this.todos = [];
        if (!skipSave) this.save();
    }

    toJSON = () => {
        return {
            uuid: this.uuid,
            name: this.name,
            todos: this.todos.map(todo => ({
                uuid: todo.uuid,
                title: todo.title,
                description: todo.description,
                dueDate: todo.dueDate,
                priority: todo.priority
            }))
        }
    }

    save = () => {
        const allProjects = Project.getAllProjects();
        const existingIndex = allProjects.findIndex(p => p.uuid === this.uuid);

        if (existingIndex >= 0) {
            allProjects[existingIndex] = this;
        } else {
            allProjects.push(this);
        }

        Project.saveAllProjects(allProjects);
    }

    addTodo = (todo) => {
        if (todo instanceof Todo === false) return;
        this.todos.push(todo);
        this.save();
    }
}