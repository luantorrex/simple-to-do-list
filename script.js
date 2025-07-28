let draggedItem = null;

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

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'New task';
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add';
    addBtn.className = 'add-btn';
    addBtn.addEventListener('click', () => {
        const value = input.value.trim();
        if (value) {
            ul.appendChild(createTaskLi(value));
            input.value = '';
            saveBoardState();
        }
    });
    section.appendChild(input);
    section.appendChild(addBtn);

    section.addEventListener('dragover', handleDragOver);
    section.addEventListener('dragenter', handleDragEnter);
    section.addEventListener('dragleave', handleDragLeave);
    section.addEventListener('drop', handleDrop);

    return section;
}

function saveBoardState() {
    const lists = document.querySelectorAll('.list');
    const data = Array.from(lists).map(list => {
        return {
            heading: list.querySelector('h2').textContent,
            items: Array.from(list.querySelectorAll('li span')).map(span => span.textContent)
        };
    });
    localStorage.setItem('boardState', JSON.stringify(data));
}

function loadBoardState() {
    const raw = localStorage.getItem('boardState');
    if (!raw) return false;
    try {
        const data = JSON.parse(raw);
        const board = document.querySelector('main.board');
        board.innerHTML = '';
        data.forEach(listData => {
            board.appendChild(createList(listData));
        });
    } catch (e) {
        console.error('Failed to load board state', e);
    }
    return true;
}

function initializeExistingBoard() {
    document.querySelectorAll('section.list').forEach(section => {
        const heading = section.querySelector('h2').textContent;
        const items = Array.from(section.querySelectorAll('li')).map(li => li.textContent);
        const newSection = createList({ heading, items });
        section.replaceWith(newSection);
    });
    saveBoardState();
}

function handleDragStart(e) {
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


document.addEventListener('DOMContentLoaded', () => {
    const loaded = loadBoardState();
    if (!loaded) {
        initializeExistingBoard();
    }
});
