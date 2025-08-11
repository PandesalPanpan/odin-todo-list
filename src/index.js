import './styles.css';
import Todo from './todos.js';
import Project from './projects.js';

const content = document.querySelector('#content');
content.textContent = 'This is the content';

const test = new Todo('Old Title', 'Description', 'dueDate', 'priority');
const test2 = new Todo('Test 2', 'Sample Description', 'what Date', 'priority');

const project = new Project('Project Oblak', [test, test2]);

console.log(project);
console.log(project.todos[0].title)

// Create a function that grabs all todos in
// all existing projects and put them in a single project
