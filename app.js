class Todo{
    constructor(task){
        this.task = task;
        this.completed = false;
    }
}

class UI{
    static displayTodos(){
        const todos = Store.getTodos();

        todos.forEach(todo => UI.addToList(todo));
    }

    static addToList(todo){
        const list = document.querySelector('.todo-list');
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo');

        todoItem.innerHTML = `
            <li class="todo-item">${todo.task}</li>
            <button class="complete-btn"><i class="fas fa-check"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        if(todo.completed && !todoItem.classList.contains('completed')){
            todoItem.classList.add('completed');
        }

        list.appendChild(todoItem);
    }

    static filterTodos(e){
        const list = document.querySelector('.todo-list').childNodes;
        list.forEach(todo => {
            switch(e.target.value){
                case "all":
                    todo.style.display = 'flex';
                    break;
                case "completed":
                    if(todo.classList.contains('completed')){
                        todo.style.display = 'flex'
                    }else{
                        todo.style.display = 'none'
                    }
                    break;
                case "uncompleted":
                    if(!todo.classList.contains('completed')){
                        todo.style.display = 'flex'
                    }else{
                        todo.style.display = 'none'
                    }
                    break;
            }
        })
    }

    static completeTodo(el){
        const todos = Store.getTodos();
        const todo = el.parentElement;
        todo.classList.toggle('completed');
        Store.completeTodo(todo);
    }

    static deleteTodo(el){
        const todo = el.parentElement;
        todo.classList.add('fall');
        todo.addEventListener('transitionend', () => todo.remove());
        Store.removeTodo(todo);
    }
}

class Store{
    static getTodos(){
        let todos;
        if(localStorage.getItem('todos') === null){
            todos = [];
        }else{
            todos = JSON.parse(localStorage.getItem('todos'));
        }

        return todos;
    }

    static addTodo(todo){
        const todos = Store.getTodos();
        todos.push(todo);

        localStorage.setItem('todos', JSON.stringify(todos));
    }

    static completeTodo(todo){
        const todos = Store.getTodos();
        const todoItem = todo.children[0].textContent;

        todos.forEach((todo, index) => {
            if(todo.task === todoItem){
                todos[index].completed = !todos[index].completed;
            }
        })

        localStorage.setItem('todos', JSON.stringify(todos));
    }

    static removeTodo(todo){
        const todos = Store.getTodos();
        const todoItem = todo.children[0].textContent;
        todos.forEach((todo, index) => {
            if(todo.task === todoItem){
                todos.splice(index, 1)
            }
        })
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayTodos);
document.querySelector('#todo-form').addEventListener('submit', e => {
    e.preventDefault();

    let newTodo = document.querySelector('.todo-input');

    if(newTodo.value === ''){
        alert('Adicione uma tarefa.');
    }else{
        const todo = new Todo(newTodo.value);

        UI.addToList(todo);
        Store.addTodo(todo);
    }

    newTodo.value = ''
})

document.querySelector('.todo-list').addEventListener('click', e => {
    const item = e.target;
    if(item.classList.contains('complete-btn')){
        UI.completeTodo(item);
    }
    if(item.classList.contains('delete-btn')){
        UI.deleteTodo(item);
    }
})

document.querySelector('.todo-filter').addEventListener('click', UI.filterTodos)
