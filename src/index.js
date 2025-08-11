import './styles.css';
import Todo from './todos.js';
import Project from './projects.js';

const test = new Todo('Old Title', 'Description', 'dueDate', 'priority');
const test2 = new Todo('Test 2', 'Sample Description', 'what Date', 'priority');

const project = new Project('Project Oblak', [test, test2]);

console.log(project);
console.log(project.todos[0].title)
