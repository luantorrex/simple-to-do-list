let draggedItem = null;
let categories = {};
let currentCategory = null;
let defaultBoardState = [];

function createTaskLi(text) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
    delBtn.addEventListener('click', () => {
        li.remove();
        saveBoardState();
    });
    li.appendChild(delBtn);

    li.setAttribute('draggable', 'true');
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragend', handleDragEnd);
    return li;
}

function createList(listData) {
    const section = document.createElement('section');
    section.className = 'list';

    const heading = document.createElement('h2');
    heading.textContent = listData.heading;
    section.appendChild(heading);

    const ul = document.createElement('ul');
    listData.items.forEach(text => {
        ul.appendChild(createTaskLi(text));
    });
    section.appendChild(ul);

    section.addEventListener('dragover', handleDragOver);
    section.addEventListener('dragenter', handleDragEnter);
    section.addEventListener('dragleave', handleDragLeave);
    section.addEventListener('drop', handleDrop);

    return section;
}

function gatherBoardState() {
    const lists = document.querySelectorAll('.list');
    return Array.from(lists).map(list => ({
        heading: list.querySelector('h2').textContent,
        items: Array.from(list.querySelectorAll('li span')).map(span => span.textContent)
    }));
}

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
    if (currentCategory) {
        localStorage.setItem('selectedCategory', currentCategory);
    }
}

function saveBoardState() {
    categories[currentCategory] = gatherBoardState();
    saveCategories();
}

function switchCategory(name) {
    if (currentCategory) {
        saveBoardState();
    }
    currentCategory = name;
    const board = document.querySelector('main.board');
    board.innerHTML = '';
    const data = categories[name] || JSON.parse(JSON.stringify(defaultBoardState));
    categories[name] = data;
    data.forEach(listData => board.appendChild(createList(listData)));
    highlightActiveCategory();
    saveCategories();
}

function highlightActiveCategory() {
    document.querySelectorAll('#category-list li').forEach(li => {
        li.classList.toggle('active', li.dataset.name === currentCategory);
    });
}

function renderCategoryList() {
    const ul = document.getElementById('category-list');
    ul.innerHTML = '';
    Object.keys(categories).forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        li.dataset.name = name;
        if (name === currentCategory) li.classList.add('active');
        li.addEventListener('click', () => switchCategory(name));
        ul.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // capture default board from the HTML
    defaultBoardState = Array.from(document.querySelectorAll('section.list')).map(section => ({
        heading: section.querySelector('h2').textContent,
        items: Array.from(section.querySelectorAll('li')).map(li => li.textContent)
    }));

    categories = JSON.parse(localStorage.getItem('categories')) || { 'Default': JSON.parse(JSON.stringify(defaultBoardState)) };
    currentCategory = localStorage.getItem('selectedCategory') || 'Default';

    renderCategoryList();
    switchCategory(currentCategory);

    document.getElementById('add-category-btn').addEventListener('click', () => {
        const input = document.getElementById('new-category-input');
        const name = input.value.trim();
        if (name && !categories[name]) {
            categories[name] = JSON.parse(JSON.stringify(defaultBoardState));
            renderCategoryList();
            switchCategory(name);
            input.value = '';
        }
    });

    const input = document.getElementById('new-task-input');
    const addBtn = document.getElementById('add-task-btn');
    addBtn.addEventListener('click', () => {
        const value = input.value.trim();
        if (value) {
            const firstList = document.querySelector('.board .list');
            if (firstList) {
                firstList.querySelector('ul').appendChild(createTaskLi(value));
                input.value = '';
                saveBoardState();
            }
        }
    });
});

function handleDragStart() {
    draggedItem = this;
    this.classList.add('dragging');
}

function handleDragEnd() {
    this.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter() {
    this.classList.add('drag-over');
}

function handleDragLeave() {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    if (draggedItem) {
        this.querySelector('ul').appendChild(draggedItem);
        draggedItem = null;
        saveBoardState();
    }
}
