// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

// Task Management System JavaScript Functions

// Global variables to store application data
let listsData = [];
let usersData = [];

// Load dashboard data from APIs
async function loadDashboard() {
  try {
    showLoadingState();
    
    // Fetch data from both API endpoints in parallel
    const [listsResponse, usersResponse] = await Promise.all([
      fetch('/lists.json'),
      fetch('/users.json')
    ]);

    if (!listsResponse.ok || !usersResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    listsData = await listsResponse.json();
    usersData = await usersResponse.json();

    // Render the dashboard
    renderDashboard();
    
  } catch (error) {
    console.error('Error loading dashboard:', error);
    showErrorState();
  }
}

// Show loading state
function showLoadingState() {
  document.getElementById('loading-state').classList.remove('hidden');
  document.getElementById('lists-container').classList.add('hidden');
  document.getElementById('empty-state').classList.add('hidden');
  document.getElementById('error-state').classList.add('hidden');
}

// Show error state
function showErrorState() {
  document.getElementById('loading-state').classList.add('hidden');
  document.getElementById('lists-container').classList.add('hidden');
  document.getElementById('empty-state').classList.add('hidden');
  document.getElementById('error-state').classList.remove('hidden');
}

// Render the dashboard with lists and tasks
function renderDashboard() {
  const listsContainer = document.getElementById('lists-container');
  const loadingState = document.getElementById('loading-state');
  const emptyState = document.getElementById('empty-state');

  loadingState.classList.add('hidden');

  if (listsData.length === 0) {
    emptyState.classList.remove('hidden');
    listsContainer.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  listsContainer.classList.remove('hidden');

  // Clear existing content
  listsContainer.innerHTML = '';

  // Render each list
  listsData.forEach(list => {
    const listElement = createListElement(list);
    listsContainer.appendChild(listElement);
  });
}

// Create HTML element for a list
function createListElement(list) {
  const listDiv = document.createElement('div');
  listDiv.className = 'bg-white rounded-lg shadow-sm border border-gray-200';
  listDiv.setAttribute('data-list-id', list.id);

  const tasksCount = list.tasks ? list.tasks.length : 0;
  
  listDiv.innerHTML = `
    <!-- List Header -->
    <div class="px-6 py-4 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900 cursor-pointer" onclick="toggleList(${list.id})">
          <span class="mr-2">▶</span>
          ${escapeHtml(list.name)}
          <span class="text-sm text-gray-500 ml-2">(${tasksCount} tasks)</span>
        </h2>
        <div class="text-sm text-gray-500">
          Weight: ${list.weight}
        </div>
      </div>
    </div>

    <!-- Tasks Container (Initially Hidden) -->
    <div id="list-${list.id}-tasks" class="hidden">
      <div class="px-6 py-4">
        <div class="space-y-3">
          ${renderTasks(list.tasks || [])}
          <!-- Add New Task Row -->
          <div class="py-3">
            <div id="add-task-${list.id}" class="flex items-center space-x-3">
              <input type="checkbox" disabled class="h-5 w-5 text-gray-300 rounded border-gray-300">
              <input 
                type="text" 
                placeholder="Add a to-do" 
                class="flex-1 border-none outline-none text-gray-600 placeholder-gray-400"
                onkeypress="handleNewTask(event, ${list.id})"
                id="new-task-input-${list.id}">
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return listDiv;
}

// Render tasks for a list
function renderTasks(tasks) {
  if (!tasks || tasks.length === 0) {
    return '<div class="text-gray-500 text-sm py-2">No tasks yet</div>';
  }

  return tasks.map(task => {
    const completedClass = task.completed ? 'line-through text-gray-500' : '';
    const assigneeInfo = task.assignee ? `Assigned: ${escapeHtml(task.assignee.name)}` : '';
    const dueDateInfo = task.limit_date ? `Due: ${formatDate(task.limit_date)}` : '';
    
    return `
      <div class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
        <div class="flex items-center space-x-3">
          <input type="checkbox" 
                 ${task.completed ? 'checked' : ''} 
                 onchange="updateTaskStatus(${task.id}, this.checked)"
                 class="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
          <span class="${completedClass} cursor-pointer" 
                onclick="window.location.href='/tasks/${task.id}/edit'">
            ${escapeHtml(task.name)}
          </span>
        </div>
        <div class="flex items-center space-x-2">
          ${assigneeInfo ? `<span class="text-sm text-gray-500">${assigneeInfo}</span>` : ''}
          ${dueDateInfo ? `<span class="text-sm text-red-500">${dueDateInfo}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
}

// Toggle list visibility
function toggleList(listId) {
  const tasksContainer = document.getElementById(`list-${listId}-tasks`);
  const arrow = document.querySelector(`[onclick="toggleList(${listId})"] span`);
  
  if (tasksContainer.classList.contains('hidden')) {
    tasksContainer.classList.remove('hidden');
    arrow.textContent = '▼';
  } else {
    tasksContainer.classList.add('hidden');
    arrow.textContent = '▶';
  }
}

// Create a new list
async function createNewList() {
  const listName = prompt("Enter list name:");
  if (!listName || listName.trim() === '') return;

  try {
    const response = await fetch('/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      },
      body: JSON.stringify({
        list: { name: listName.trim() }
      })
    });

    if (response.ok) {
      // Reload dashboard data
      await loadDashboard();
    } else {
      alert('Error creating list. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error creating list. Please try again.');
  }
}

// Handle new task creation
async function handleNewTask(event, listId) {
  if (event.key === 'Enter') {
    const input = event.target;
    const taskName = input.value.trim();
    
    if (taskName === '') return;

    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({
          task: { 
            name: taskName,
            list_id: listId
          }
        })
      });

      if (response.ok) {
        // Clear the input and reload dashboard data
        input.value = '';
        await loadDashboard();
      } else {
        alert('Error creating task. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating task. Please try again.');
    }
  }
}

// Update task completion status
async function updateTaskStatus(taskId, completed) {
  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      },
      body: JSON.stringify({
        task: { completed: completed }
      })
    });

    if (response.ok) {
      // Update the UI immediately
      const taskElement = document.querySelector(`input[onchange="updateTaskStatus(${taskId}, this.checked)"]`);
      const taskNameElement = taskElement.parentElement.nextElementSibling;
      
      if (completed) {
        taskNameElement.classList.add('line-through', 'text-gray-500');
      } else {
        taskNameElement.classList.remove('line-through', 'text-gray-500');
      }
    } else {
      alert('Error updating task. Please try again.');
      // Revert the checkbox state
      event.target.checked = !completed;
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error updating task. Please try again.');
    // Revert the checkbox state
    event.target.checked = !completed;
  }
}

// Delete task function
async function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) return;

  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      }
    });

    if (response.ok) {
      // Redirect back to main view
      window.location.href = '/';
    } else {
      alert('Error deleting task. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error deleting task. Please try again.');
  }
}

// Make functions globally available
window.loadDashboard = loadDashboard;
window.toggleList = toggleList;
window.createNewList = createNewList;
window.handleNewTask = handleNewTask;
window.updateTaskStatus = updateTaskStatus;
window.deleteTask = deleteTask;
