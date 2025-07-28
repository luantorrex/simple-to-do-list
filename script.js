let draggedItem = null;

function saveBoardState() {
    const lists = document.querySelectorAll('.list');
    const data = Array.from(lists).map(list => {
        return {
            heading: list.querySelector('h2').textContent,
            items: Array.from(list.querySelectorAll('li')).map(li => li.textContent)
        };
    });
    localStorage.setItem('boardState', JSON.stringify(data));
}

function loadBoardState() {
    const raw = localStorage.getItem('boardState');
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        const board = document.querySelector('main.board');
        board.innerHTML = '';
        data.forEach(listData => {
            const section = document.createElement('section');
            section.className = 'list';
            const heading = document.createElement('h2');
            heading.textContent = listData.heading;
            section.appendChild(heading);
            const ul = document.createElement('ul');
            listData.items.forEach(text => {
                const li = document.createElement('li');
                li.textContent = text;
                ul.appendChild(li);
            });
            section.appendChild(ul);
            board.appendChild(section);
        });
    } catch (e) {
        console.error('Failed to load board state', e);
    }
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

function setupDragAndDrop() {
    document.querySelectorAll('.list li').forEach(item => {
        item.setAttribute('draggable', 'true');
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    document.querySelectorAll('.list').forEach(list => {
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('dragenter', handleDragEnter);
        list.addEventListener('dragleave', handleDragLeave);
        list.addEventListener('drop', handleDrop);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadBoardState();
    setupDragAndDrop();
    saveBoardState();
});
