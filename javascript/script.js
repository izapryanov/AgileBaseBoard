 // Get references to key elements
const kanbanContainer = document.getElementById('kanban-container');
const addBtn = document.getElementById('add-btn');
const addMenu = document.getElementById('add-menu');
const addColumnOptionBtn = document.getElementById('add-column-option-btn');
const addItemOptionBtn = document.getElementById('add-item-option-btn');
const createItemModal = document.getElementById('create-item-modal');
const createNewItemBtn = document.getElementById('create-new-item-btn');
const cancelCreateItemBtn = document.getElementById('cancel-create-item-btn');
const newItemInput = document.getElementById('new-item-input');
const sandwichBtn = document.getElementById("sandwich-btn");
const sandwichMenu = document.getElementById("sandwich-menu");
const helpBtn = document.getElementById("help-btn");
const gitHubBtn = document.getElementById("github-btn");
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");
const clearBtn = document.getElementById("clear-board-btn");
const feedbackBtn = document.getElementById("feedback-btn");

let columnCounter = 3;
let itemCounter = 1;
let draggingItem = null;
let draggingColumn = null;
let placeholder = null;

// Confirmation modal elements for columns
const columnModal = document.getElementById('column-confirmation-modal');
const confirmDeleteColumnBtn = document.getElementById('confirm-delete-column-btn');
const cancelDeleteColumnBtn = document.getElementById('cancel-delete-column-btn');
let columnToDelete = null;

// Confirmation modal elements for items
const itemModal = document.getElementById('item-confirmation-modal');
const confirmDeleteItemBtn = document.getElementById('confirm-delete-item-btn');
const cancelDeleteItemBtn = document.getElementById('cancel-delete-item-btn');
let itemToDelete = null;

// Confirmation modal elements for board clear
const clearBoardModal = document.getElementById('confirm-clear-modal');
const confirmClearBoardBtn = document.getElementById('confirm-clear-board-btn');
const cancelClearBoardBtn = document.getElementById('cancel-clear-board-btn');


/**
 * Attaches drag, drop, and touch listeners to all existing columns.
 */
const initializeColumnListeners = () => {
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        const header = column.querySelector('.column-header');
        
        // Remove existing listeners to prevent duplicates
        if (header) {
            header.removeEventListener('dragstart', handleColumnDragStart);
            header.removeEventListener('dragend', handleColumnDragEnd);
            header.removeEventListener('touchstart', handleColumnTouchStart);
            // Remove dblclick listener if present
            column.removeEventListener('dblclick', handleColumnDoubleClick);
        }
        column.removeEventListener('dragover', handleItemDragOver);
        column.removeEventListener('drop', handleItemDrop);

        // Add new listeners for columns
        if (header) {
            header.addEventListener('dragstart', handleColumnDragStart);
            header.addEventListener('dragend', handleColumnDragEnd);
            
            // Touch events for columns
            header.addEventListener('touchstart', handleColumnTouchStart);
            // Add dblclick to create a new empty item in the column
            column.addEventListener('dblclick', handleColumnDoubleClick);
        }
        
        // Item dragging within columns
        column.addEventListener('dragover', handleItemDragOver);
        column.addEventListener('drop', handleItemDrop);
    });

    // Add dragover/drop listeners to the container for column reordering
    kanbanContainer.removeEventListener('dragover', handleColumnDragOver);
    kanbanContainer.removeEventListener('drop', handleColumnDrop);
    kanbanContainer.addEventListener('dragover', handleColumnDragOver);
    kanbanContainer.addEventListener('drop', handleColumnDrop);
};

/**
 * Handles the dragstart event for a column.
 * @param {Event} e The drag event.
 */
const handleColumnDragStart = e => {
    draggingColumn = e.target.closest('.column');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggingColumn.id);
    setTimeout(() => {
        draggingColumn.classList.add('is-dragging');
        
        // Create a placeholder and insert it
        placeholder = document.createElement('div');
        placeholder.classList.add('column-placeholder');
        // Insert placeholder before the dragging column
        kanbanContainer.insertBefore(placeholder, draggingColumn);
    }, 0);
};

/**
 * Handles the dragover event on the container to reorder columns.
 * This function now only runs if a column is actively being dragged.
 * @param {Event} e The drag event.
 */
const handleColumnDragOver = e => {
    e.preventDefault();
    // This is the crucial check to ensure this function only runs for columns
    if (!draggingColumn) return;
    
    const target = e.target;
    const targetColumn = target.closest('.column');
    
    if (placeholder) {
        if (targetColumn && targetColumn !== draggingColumn) {
            const rect = targetColumn.getBoundingClientRect();
            const isBefore = e.clientX < rect.left + rect.width / 2;
            
            if (isBefore) {
                kanbanContainer.insertBefore(placeholder, targetColumn);
            } else {
                kanbanContainer.insertBefore(placeholder, targetColumn.nextSibling);
            }
        }
    }
};

/**
 * Handles the drop event on the container to reorder columns.
 * @param {Event} e The drop event.
 */
const handleColumnDrop = e => {
    e.preventDefault();
    if (draggingColumn && placeholder) {
        // Place the dragging column where the placeholder is
        kanbanContainer.insertBefore(draggingColumn, placeholder);
        // Remove the placeholder
        placeholder.remove();
        draggingColumn.classList.remove('is-dragging');
        draggingColumn = null;
        placeholder = null;
    }
};

/**
 * Handles the dragend event for a column.
 * @param {Event} e The drag event.
 */
const handleColumnDragEnd = e => {
    if (draggingColumn) {
        draggingColumn.classList.remove('is-dragging');
    }
    if (placeholder) {
        placeholder.remove();
    }
    draggingColumn = null;
    placeholder = null;
};

/**
 * Handles the touchstart event for a column header.
 * @param {Event} e The touch event.
 */
const handleColumnTouchStart = e => {
    e.preventDefault(); // Prevents default browser behavior like scrolling
    draggingColumn = e.target.closest('.column');
    if (!draggingColumn) return;

    draggingColumn.classList.add('is-dragging');

    // Create a placeholder and insert it
    placeholder = document.createElement('div');
    placeholder.classList.add('column-placeholder');
    draggingColumn.parentNode.insertBefore(placeholder, draggingColumn);

    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const initialRect = draggingColumn.getBoundingClientRect();

    draggingColumn.style.position = 'absolute';
    draggingColumn.style.width = initialRect.width + 'px';
    draggingColumn.style.height = initialRect.height + 'px';
    draggingColumn.style.left = initialRect.left + 'px';
    draggingColumn.style.top = initialRect.top + 'px';
    draggingColumn.style.zIndex = '999';
    
    const onTouchMove = (e) => {
        const currentTouch = e.touches[0];
        const deltaX = currentTouch.clientX - startX;
        const deltaY = currentTouch.clientY - startY;

        draggingColumn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        
        const elemBelow = document.elementFromPoint(currentTouch.clientX, currentTouch.clientY);
        const targetColumn = elemBelow ? elemBelow.closest('.column') : null;

        if (targetColumn && targetColumn !== draggingColumn) {
            const rect = targetColumn.getBoundingClientRect();
            const isBefore = currentTouch.clientX < rect.left + rect.width / 2;
            if (isBefore) {
                kanbanContainer.insertBefore(placeholder, targetColumn);
            } else {
                kanbanContainer.insertBefore(placeholder, targetColumn.nextSibling);
            }
        }
    };

    const onTouchEnd = () => {
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
        
        // Place the column where the placeholder is
        if (placeholder) {
            kanbanContainer.insertBefore(draggingColumn, placeholder);
            placeholder.remove();
        }

        // Cleanup
        draggingColumn.classList.remove('is-dragging');
        draggingColumn.style.position = '';
        draggingColumn.style.width = '';
        draggingColumn.style.height = '';
        draggingColumn.style.left = '';
        draggingColumn.style.top = '';
        draggingColumn.style.transform = '';
        draggingColumn.style.zIndex = '';
        draggingColumn = null;
        placeholder = null;
    };

    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
};

/**
 * Handles the dragover event for a column to reorder items.
 * @param {Event} e The drag event.
 */
const handleItemDragOver = e => {
    e.preventDefault();
    const draggingItem = document.querySelector('.kanban-item.is-dragging');
    if (draggingItem) {
        const targetColumn = e.target.closest('.column');
        if (targetColumn) {
            const afterElement = getDragAfterElement(targetColumn, e.clientY);
            if (afterElement == null) {
                targetColumn.appendChild(draggingItem);
            } else {
                targetColumn.insertBefore(draggingItem, afterElement);
            }
            updateColumnPlaceholders();
        }
    }
};

/**
 * Handles the drop event for a column to reorder items.
 * @param {Event} e The drop event.
 */
const handleItemDrop = e => {
    e.preventDefault();
    // This is handled by the dragover event, so no action needed here.
};

/**
 * Determines the element to place the dragged item after.
 * @param {HTMLElement} column The column element.
 * @param {number} y The y-coordinate of the mouse/touch.
 * @returns {HTMLElement | null} The element to place the new item after.
 */
const getDragAfterElement = (column, y) => {
    const draggableItems = [...column.querySelectorAll('.kanban-item:not(.is-dragging)')];
    return draggableItems.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
};


/**
 * Attaches drag and touch listeners to all existing items.
 */
const initializeItemListeners = () => {
  const items = document.querySelectorAll('.kanban-item');

  items.forEach(item => {
    const content = item.querySelector('.kanban-item-content');
    const delBtn = item.querySelector('.delete-item-btn');

    // --- Prevent drag when interacting with editable text
    content.addEventListener('mousedown', () => {
      item.draggable = false;
    });
    content.addEventListener('mouseup', () => {
      item.draggable = true;
    });
    content.addEventListener('mouseleave', () => {
      item.draggable = true;
    });

    // --- Prevent drag when clicking delete button
    delBtn.addEventListener('mousedown', () => {
      item.draggable = false;
    });
    delBtn.addEventListener('mouseup', () => {
      item.draggable = true;
    });
    delBtn.addEventListener('mouseleave', () => {
      item.draggable = true;
    });

    // Your normal drag events
    item.addEventListener('dragstart', handleItemDragStart);
    item.addEventListener('dragend', handleItemDragEnd);
  });
};

/**
 * Handles the dragstart event for a mouse.
 * @param {Event} e The drag event.
 */
const handleItemDragStart = e => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => e.target.classList.add('is-dragging'), 0);
};

/**
 * Handles the dragend event for a mouse.
 * @param {Event} e The drag event.
 */
const handleItemDragEnd = e => {
    e.target.classList.remove('is-dragging');
};

/**
 * Handles the touchstart event for an item.
 * @param {Event} e The touch event.
 */
const handleItemTouchStart = e => {
    draggingItem = e.target.closest('.kanban-item');
    if (draggingItem) {
        e.preventDefault();
        draggingItem.classList.add('is-dragging');
        const touch = e.touches[0];
        const initialRect = draggingItem.getBoundingClientRect();
        
        // Set the initial position and style for dragging
        draggingItem.style.position = 'absolute';
        draggingItem.style.width = initialRect.width + 'px';
        draggingItem.style.left = initialRect.left + 'px';
        draggingItem.style.top = initialRect.top + 'px';
        
        const onTouchMove = (e) => {
            const currentTouch = e.touches[0];
            draggingItem.style.left = currentTouch.clientX - initialRect.width / 2 + 'px';
            draggingItem.style.top = currentTouch.clientY - initialRect.height / 2 + 'px';
            
            const elemBelow = document.elementFromPoint(currentTouch.clientX, currentTouch.clientY);
            const targetColumn = elemBelow ? elemBelow.closest('.column') : null;
            if (targetColumn) {
                const afterElement = getDragAfterElement(targetColumn, currentTouch.clientY);
                if (afterElement == null) {
                    targetColumn.appendChild(draggingItem);
                } else {
                    targetColumn.insertBefore(draggingItem, afterElement);
                }
            }
        };

        const onTouchEnd = () => {
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
            
            // Cleanup styles
            draggingItem.classList.remove('is-dragging');
            draggingItem.style.position = '';
            draggingItem.style.width = '';
            draggingItem.style.left = '';
            draggingItem.style.top = '';
            draggingItem = null;
        };

        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
    }
};

/**
 * Creates a new column element.
 */
const createNewColumn = () => {
    columnCounter++;
    const newColumn = document.createElement('div');
    newColumn.id = `new-column-${columnCounter}`;
    newColumn.classList.add('column');
    newColumn.innerHTML = `
        <div class="column-header" draggable="true">
            <h2 contenteditable="true" class="column-title">New Column</h2>
            <button class="delete-column-btn">
                <!-- Trash can icon for deleting a column -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    `;
    kanbanContainer.appendChild(newColumn);
    initializeColumnListeners();
    initializeDeleteColumnButtons();
    updateColumnPlaceholders();
};

//Update column placeholder
function updateColumnPlaceholders() {
    document.querySelectorAll('.column').forEach(column => {
        if (column.querySelectorAll('.kanban-item').length === 0) {
        column.classList.add('empty');
        } else {
        column.classList.remove('empty');
        }
    });
}

/**
 * Creates a new kanban item with a delete button and given text.
 * The new item's content is now also editable.
 */
        
const createNewKanbanItem = (itemText, targetColumn = null) => {
    // Create a new kanban item and append it to the given column (or the first column if none provided)
    itemCounter++;
    const newItem = document.createElement('div');
    newItem.id = `item-${itemCounter}`;
    newItem.classList.add('kanban-item');
    newItem.draggable = true;
    newItem.innerHTML = `

                <span class="kanban-item-content" contenteditable="true" data-placeholder="Start typing here">${itemText}</span>
                <button class="delete-item-btn">
                    <!-- Trash can icon for deleting an item -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>

    `;
    // Decide which column to append to
    const columnToAppend = targetColumn || kanbanContainer.querySelector('.column');
    if (columnToAppend) {
        columnToAppend.appendChild(newItem);
        // Re-initialize listeners so the new item behaves like others
        initializeItemListeners();
        initializeDeleteItemButtons();
    }
    return newItem;
};


/**
 * Handles double-clicks on a column to add a new empty item to that column.
 * Ignores double-clicks that happen on existing items or on column headers/buttons.
 */
const handleColumnDoubleClick = (e) => {
    const column = e.currentTarget;
    if (!column) return;

    // If double-click happened on an item or header or delete buttons, ignore it
    if (e.target.closest('.kanban-item') ||
        e.target.closest('.column-header') ||
        e.target.closest('.delete-item-btn') ||
        e.target.closest('.delete-column-btn')) {
    return;
    }

    // Create an empty (editable) item in this column
    const newItem = createNewKanbanItem('', column);

    // Focus the editable span after adding
    newItem.querySelector('.kanban-item-content').focus();

    updateColumnPlaceholders();
};

        
/**
 * Attaches click listeners to all column delete buttons.
 */
const initializeDeleteColumnButtons = () => {
    const deleteButtons = document.querySelectorAll('.delete-column-btn');
    deleteButtons.forEach(button => {
        // Remove old listener to avoid duplicates on new columns
        button.removeEventListener('click', handleDeleteColumnClick);
        button.addEventListener('click', handleDeleteColumnClick);
    });
};

/**
 * Attaches click listeners to all item delete buttons.
 */
const initializeDeleteItemButtons = () => {
    const deleteButtons = document.querySelectorAll('.delete-item-btn');
    deleteButtons.forEach(button => {
        // Remove old listener to avoid duplicates on new items
        button.removeEventListener('click', handleDeleteItemClick);
        button.addEventListener('click', handleDeleteItemClick);
    });
};

/**
 * Handles the click event for a column delete button.
 * @param {Event} e The click event.
 */
const handleDeleteColumnClick = e => {
    columnToDelete = e.currentTarget.closest('.column');
    columnModal.style.display = 'flex';
};

/**
 * Handles the click event for an item delete button.
 * @param {Event} e The click event.
 */
const handleDeleteItemClick = e => {
    itemToDelete = e.currentTarget.closest('.kanban-item');
    itemModal.style.display = 'flex';
};

// Event listener for the "Yes, delete it" button for columns
confirmDeleteColumnBtn.addEventListener('click', () => {
    if (columnToDelete) {
        columnToDelete.remove();
        columnToDelete = null;
    }
    columnModal.style.display = 'none';
});

// Event listener for the "No, keep it" button for columns
cancelDeleteColumnBtn.addEventListener('click', () => {
    columnModal.style.display = 'none';
    columnToDelete = null;
});

// Event listener for the "Yes, delete it" button for items
confirmDeleteItemBtn.addEventListener('click', () => {
    if (itemToDelete) {
        itemToDelete.remove();
        itemToDelete = null;
        updateColumnPlaceholders(); 
    }
    itemModal.style.display = 'none';
    
});

// Event listener for the "No, keep it" button for items
cancelDeleteItemBtn.addEventListener('click', () => {
    itemModal.style.display = 'none';
    itemToDelete = null;
});

// Hide modal if the user clicks outside of the modal content
columnModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        columnModal.style.display = 'none';
        columnToDelete = null;
    }
});

// Hide modal if the user clicks outside of the modal content
itemModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        itemModal.style.display = 'none';
        itemToDelete = null;
    }
});

// --- New Button Logic ---
// Toggle the add menu when the main button is clicked
addBtn.addEventListener('click', () => {
    addMenu.style.display = addMenu.style.display === 'flex' ? 'none' : 'flex';
});

// Add a new column when the option is selected
addColumnOptionBtn.addEventListener('click', () => {
    createNewColumn();
    addMenu.style.display = 'none';
});

// Show the create item modal when the option is selected
addItemOptionBtn.addEventListener('click', () => {
    createItemModal.style.display = 'flex';
    addMenu.style.display = 'none';
});

// Handle the creation of a new item from the modal
createNewItemBtn.addEventListener('click', () => {
    const itemText = newItemInput.value.trim();
    if (itemText) {
        createNewKanbanItem(itemText);
        newItemInput.value = ''; // Clear the input field
        createItemModal.style.display = 'none';
        updateColumnPlaceholders();
    }
});

// Cancel the item creation modal
cancelCreateItemBtn.addEventListener('click', () => {
    newItemInput.value = ''; // Clear the input field
    createItemModal.style.display = 'none';
});

// Hide the item creation modal if user clicks outside
createItemModal.addEventListener('click', (e) => {
    if (e.target.id === 'create-item-modal') {
        createItemModal.style.display = 'none';
        newItemInput.value = '';
    }
});

//Show the sandwitch button menu
sandwichBtn.addEventListener("click", () => {
    sandwichMenu.style.display = sandwichMenu.style.display === "flex" ? "none" : "flex";
});

//Open readme.md when help button is clicked
helpBtn.addEventListener("click", () => {
    window.open("https://github.com/izapryanov/AgileBaseBoard/blob/main/README.md", "_blank");
});

//Open GitHub project page for Agile Base Board
gitHubBtn.addEventListener("click", () => {
    window.open("https://github.com/izapryanov/AgileBaseBoard", "_blank");
});

//Open feedback form
feedbackBtn.addEventListener("click", () =>{
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSdVyhnGg3mFAXMetWCYGsaE7bcYXUvR2nf6sE9rDDxddEWapQ/viewform?usp=header", "_blank");
})

//Handle export board 
exportBtn.addEventListener("click", () => {
    const boardTitle = document.getElementById('board-title').innerText.trim();

    // Collect column titles in order
    const columns = Array.from(document.querySelectorAll('.kanban-container .column'))
        .map(column => column.querySelector('.column-title').innerText.trim());

    // Collect all items with their column reference
    const items = [];
    Array.from(document.querySelectorAll('.kanban-container .column')).forEach(column => {
        const columnTitle = column.querySelector('.column-title').innerText.trim();
        Array.from(column.querySelectorAll('.kanban-item')).forEach(item => {
            const text = item.querySelector('.kanban-item-content').innerText.trim();
            items.push({ text, column: columnTitle });
        });
    });

    // Construct flat JSON object
    const boardData = {
        title: boardTitle,
        columns: columns,
        items: items
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(boardData, null, 4);

    // Trigger download
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${boardTitle.replace(/\s+/g, '_')}_board.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

//Handle import board
importBtn.addEventListener("click", () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';

    fileInput.addEventListener('change', event => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);

                // Clear existing board
                kanbanContainer.innerHTML = '';
                columnCounter = 0;
                itemCounter = 0;

                // Set board title
                const boardTitleElem = document.getElementById('board-title');
                boardTitleElem.innerText = data.title || 'Agile Base Board';

                const columnsMap = {};

                // Create columns in order using existing function
                data.columns.forEach(colTitle => {
                    createNewColumn(); // increments columnCounter
                    const newColumn = kanbanContainer.lastElementChild;
                    const titleElem = newColumn.querySelector('.column-title');
                    titleElem.innerText = colTitle;
                    columnsMap[colTitle] = newColumn;
                });

                // Add items using existing function
                data.items.forEach(item => {
                    const targetColumn = columnsMap[item.column] || kanbanContainer.querySelector('.column');
                    createNewKanbanItem(item.text, targetColumn);
                });

                // Re-initialize listeners for drag/drop, delete buttons, placeholders
                initializeBoard();
                

            } catch (err) {
                alert('Failed to import board: ' + err.message);
            }
        };

        reader.readAsText(file);
    });

    fileInput.click();
    sandwichMenu.style.display = "none";
});

//Handle clear board
//Hanlde clear board menu item click
clearBtn.addEventListener("click", () => {
  sandwichMenu.style.display = "none";
  clearBoardModal.style.display = 'flex';
});

//Handle clear board confirm
confirmClearBoardBtn.addEventListener("click", () => {
    const params = new URLSearchParams(window.location.search);
    const importURL = params.get('import');
    if (importURL) {
        importBoardFromURL(importURL);
    } else {
        kanbanContainer.innerHTML = ` <!-- To Do Column -->
            <div id="todo-column" class="column">
                <div class="column-header" draggable="true">
                    <h2 contenteditable="true" class="column-title">To Do</h2>
                    <button class="delete-column-btn">
                        <!-- Trash can icon for deleting a column -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
                <!-- Placeholder item -->
                <div id="item-1" draggable="true" class="kanban-item">
                    <span class="kanban-item-content" contenteditable="true" data-placeholder="Start typing here"></span>
                    <button class="delete-item-btn">
                        <!-- Trash can icon for deleting an item -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- In Progress Column -->
            <div id="in-progress-column" class="column">
                <div class="column-header" draggable="true">
                    <h2 contenteditable="true" class="column-title">In Progress</h2>
                    <button class="delete-column-btn">
                        <!-- Trash can icon for deleting a column -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Done Column -->
            <div id="done-column" class="column">
                <div class="column-header" draggable="true">
                    <h2 contenteditable="true" class="column-title">Done</h2>
                    <button class="delete-column-btn">
                        <!-- Trash can icon for deleting a column -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>`;
        initializeBoard();
    }
    clearBoardModal.style.display = 'none';

});

//Handle clear board cancel
cancelClearBoardBtn.addEventListener("click", () => {
    clearBoardModal.style.display = 'none';
});

// Hide menu when clicking outside
document.addEventListener("click", (e) => {
    if (!sandwichBtn.contains(e.target) && !sandwichMenu.contains(e.target)) {
        sandwichMenu.style.display = "none";
    }
});

//Import from a JSON export stored on GitHub via raw github link
function importBoardFromURL(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not OK');
            return response.json();
        })
        .then(data => {
            // Clear existing board
            kanbanContainer.innerHTML = '';
            columnCounter = 0;
            itemCounter = 0;

            // Set board title
            const boardTitleElem = document.getElementById('board-title');
            boardTitleElem.innerText = data.title || 'Agile Base Board';

            const columnsMap = {};

            // Create columns
            data.columns.forEach(colTitle => {
                createNewColumn(); 
                const newColumn = kanbanContainer.lastElementChild;
                const titleElem = newColumn.querySelector('.column-title');
                titleElem.innerText = colTitle;
                columnsMap[colTitle] = newColumn;
            });

            // Add items
            data.items.forEach(item => {
                const targetColumn = columnsMap[item.column] || kanbanContainer.querySelector('.column');
                createNewKanbanItem(item.text, targetColumn);
            });

            // Reinitialize listeners
            initializeBoard();
        }).catch(err => alert('Failed to import board: ' + err.message));
}

//Attach the URL param listener to the DOM
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const importURL = params.get('import');
    if (importURL) {
        importBoardFromURL(importURL);
    }
});

// Initial setup for the existing elements
const initializeBoard = () =>{
    initializeItemListeners();
    initializeColumnListeners();
    initializeDeleteColumnButtons();
    initializeDeleteItemButtons();
    updateColumnPlaceholders();
}

initializeBoard();