// List Component for creating list DOM elements
export class ListComponent {

static create(list) {
  const listDiv = document.createElement('div');
  listDiv.className = 'bg-white rounded-lg shadow-sm border border-gray-200 list-item';
  listDiv.setAttribute('data-controller', 'list'); // Only list controller, no sortable
  listDiv.setAttribute('data-list-id', list.id); // Keep this for task sorting reference

  const tasksCount = list.tasks ? list.tasks.length : 0;
  const pendingTasksCount = list.tasks ? list.tasks.filter(task => !task.completed).length : 0;
  
  listDiv.innerHTML = `
    <!-- List Header -->
    <div class="px-6 py-4 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <h2 class="text-xl font-semibold text-gray-900 cursor-pointer" data-action="click->list#toggle">
            <span data-list-target="arrow" class="mr-2">▶</span>
            ${this.escapeHtml(list.name)}
            <span data-list-target="taskCount" class="text-sm text-gray-500 ml-2">(${tasksCount} tasks)</span>
          </h2>
        </div>
        <div class="text-sm text-gray-500">
          <span data-list-target="pendingCount" class="font-medium text-blue-600">${pendingTasksCount}</span> pending
        </div>
      </div>
    </div>

    <!-- Tasks Container (Initially Hidden) -->
    <div data-list-target="tasksContainer" class="hidden">
      <div class="px-6 py-4">
        <div class="tasks-container" 
             data-controller="sortable" 
             data-sortable-group-value="tasks"
             data-sortable-handle-value=".task-drag-handle"
             data-list-id="${list.id}">
          ${this.renderTasks(list.tasks || [])}
        </div>
        <!-- Add New Task Row -->
        ${this.createAddTaskRow(list.id)}
      </div>
    </div>
  `;

  return listDiv;
}

  static createAddTaskRow(listId) {
    return `
      <div class="py-3" data-controller="task" data-task-list-id-value="${listId}">
        <div class="flex items-center justify-center">
          <button 
            data-task-target="addTaskButton"
            data-action="click->task#showTaskForm"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
            + Add Task
          </button>
        </div>
        
        <!-- Hidden Task Form -->
        <div data-task-target="taskForm" class="hidden mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
              <input 
                type="text" 
                placeholder="Enter task name" 
                maxlength="80"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-task-target="taskNameInput">
              <div class="text-xs text-gray-500 mt-1 text-right">
                <span data-task-target="nameCharCount">0</span>/80
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea 
                placeholder="Enter task notes. This will be used to estimate the time to complete the task." 
                maxlength="500"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                data-task-target="taskNotesInput"
                rows="3"></textarea>
              <div class="text-xs text-gray-500 mt-1 text-right">
                <span data-task-target="notesCharCount">0</span>/500
              </div>
            </div>
            
            <div class="flex space-x-3 pt-2">
              <button 
                data-action="click->task#createTask"
                class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                Add Task
              </button>
              <button 
                data-action="click->task#hideTaskForm"
                class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static renderTasks(tasks) {
    if (!tasks || tasks.length === 0) {
      return '<div class="text-gray-500 text-sm py-2">No tasks yet</div>';
    }

    const sortedTasks = [...tasks].sort((a, b) => a.weight - b.weight);

    return sortedTasks.map(task => {
      const completedClass = task.completed ? 'line-through text-gray-500' : '';
      const estimatedTimeInfo = task.estimated_time ? `Estimated time: ${this.escapeHtml(task.estimated_time)}` : '';
      const assigneeInfo = task.assignee ? `Assigned: ${this.escapeHtml(task.assignee.name)}` : '';
      const dueDateInfo = task.limit_date ? `Due: ${this.formatDate(task.limit_date)}` : '';
      
      return `
        <div class="task-item flex items-center justify-between py-3 border-b border-gray-100" 
            data-controller="task"
            data-task-id-value="${task.id}" 
            data-task-weight-value="${task.weight}" 
            data-task-list-id-value="${task.list_id}">
          <div class="flex items-center space-x-3">
            <div class="task-drag-handle cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600" title="Drag to reorder">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
              </svg>
            </div>
            <input type="checkbox" 
                  ${task.completed ? 'checked' : ''} 
                  data-action="change->task#updateStatus"
                  class="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
            <div class="flex flex-col">
              <span class="${completedClass} cursor-pointer" 
                    data-action="click->task#edit">
                ${this.escapeHtml(task.name)}
              </span>
              ${task.notes ? `
                <div class="flex items-center space-x-1 mt-1">
                  <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" title="Has notes">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-xs text-gray-500">Has notes</span>
                </div>
              ` : ''}
            </div>
          </div>
          <div class="flex items-center space-x-2">
            ${estimatedTimeInfo ? `<span class="text-sm text-gray-500">${estimatedTimeInfo}</span>` : ''}
            ${assigneeInfo ? `<span class="text-sm text-gray-500">${assigneeInfo}</span>` : ''}
            ${dueDateInfo ? `<span class="text-sm text-red-500">${dueDateInfo}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
  }
}
