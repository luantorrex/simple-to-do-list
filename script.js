let draggedItem = null;

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

document.addEventListener('DOMContentLoaded', setupDragAndDrop);
