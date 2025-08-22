import { Controller } from "@hotwired/stimulus";
import { ApiService } from "services/api_service";

// Task controller manages individual task behavior
export default class extends Controller {
  static targets = ["taskForm", "taskNameInput", "taskNotesInput", "nameCharCount", "notesCharCount", "addTaskButton"];
  static values = { 
    id: Number, 
    listId: Number, 
    weight: Number 
  };

  connect() {
    // Add input event listeners for character counting
    if (this.hasTaskNameInputTarget) {
      this.taskNameInputTarget.addEventListener('input', () => this.updateNameCharCount());
    }
    if (this.hasTaskNotesInputTarget) {
      this.taskNotesInputTarget.addEventListener('input', () => this.updateNotesCharCount());
    }
  }

  // TODO refactor char count methods
  updateNameCharCount() {
    if (this.hasNameCharCountTarget) {
      const currentLength = this.taskNameInputTarget.value.length;
      const maxLength = this.taskNameInputTarget.maxLength;
      this.nameCharCountTarget.textContent = currentLength;
      
      // Change color based on length
      if (currentLength > maxLength * 0.9) {
        this.nameCharCountTarget.classList.add('text-red-500');
      } else {
        this.nameCharCountTarget.classList.remove('text-red-500');
      }
    }
  }

  updateNotesCharCount() {
    if (this.hasNotesCharCountTarget) {
      const currentLength = this.taskNotesInputTarget.value.length;
      const maxLength = this.taskNotesInputTarget.maxLength;
      this.notesCharCountTarget.textContent = currentLength;
      
      // Change color based on length
      if (currentLength > maxLength * 0.9) {
        this.notesCharCountTarget.classList.add('text-red-500');
      } else {
        this.notesCharCountTarget.classList.remove('text-red-500');
      }
    }
  }

  showTaskForm() {
    this.taskFormTarget.classList.remove('hidden');
    this.addTaskButtonTarget.classList.add('hidden');
    this.taskNameInputTarget.focus();
    
    // Initialize character counts when form is shown
    this.updateNameCharCount();
    this.updateNotesCharCount();
  }

  hideTaskForm() {
    this.taskFormTarget.classList.add('hidden');
    this.addTaskButtonTarget.classList.remove('hidden');
    this.clearForm();
  }

  clearForm() {
    this.taskNameInputTarget.value = '';
    this.taskNotesInputTarget.value = '';
    
    // Reset character counts
    this.updateNameCharCount();
    this.updateNotesCharCount();
  }

  async createTask() {
    const taskName = this.taskNameInputTarget.value.trim();
    const notes = this.taskNotesInputTarget.value.trim();
    
    if (taskName === '') {
      alert('Please enter a task name');
      this.taskNameInputTarget.focus();
      return;
    }

    try {
      const newTask = await ApiService.post('/tasks', {
        task: { 
          name: taskName,
          notes,
          list_id: this.listIdValue
        }
      });

      // Hide the form and clear inputs
      this.hideTaskForm();
      
      // Add task to DOM
      this.addTaskToDOM(newTask);
      
      // Notify list controller to update task count
      this.updateListCounts();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating task. Please try again.');
    }
  }

  async updateStatus(event) {
    const completed = event.target.checked;
    
    try {
      await ApiService.patch(`/tasks/${this.idValue}`, {
        task: { completed: completed }
      });

      // Update the UI immediately
      const taskNameElement = event.target.parentElement.querySelector('span');
      
      if (completed) {
        taskNameElement.classList.add('line-through', 'text-gray-500');
      } else {
        taskNameElement.classList.remove('line-through', 'text-gray-500');
      }

      // Update the pending count for this list
      this.updatePendingCount(completed);

    } catch (error) {
      console.error('Error:', error);
      alert('Error updating task. Please try again.');
      event.target.checked = !completed;
    }
  }

  updatePendingCount(taskCompleted) {
  
    const listElement = this.element.closest('.list-item');
    
    if (!listElement) {
      console.error('No list element found');
      return;
    }

    const listController = this.application.getControllerForElementAndIdentifier(listElement, 'list');
    
    if (listController) {
      listController.updatePendingCount(taskCompleted);
    } else {
      console.error('No list controller found');
    }
  }

  edit() {
    window.location.href = `/tasks/${this.idValue}/edit`;
  }

  addTaskToDOM(newTask) {
    // Find the tasks container for this list
    const tasksContainer = document.querySelector(`[data-list-id="${this.listIdValue}"]`);
    if (!tasksContainer) return;
    
    // Check if "No tasks yet" message exists and remove it
    const noTasksMessage = tasksContainer.querySelector('.text-gray-500');
    if (noTasksMessage && noTasksMessage.textContent === 'No tasks yet') {
      noTasksMessage.remove();
    }
    
    // Create task HTML
    const taskHTML = `
      <div class="task-item flex items-center justify-between py-3 border-b border-gray-100" 
          data-controller="task"
          data-task-id-value="${newTask.id}" 
          data-task-weight-value="${newTask.weight}" 
          data-task-list-id-value="${newTask.list_id}">
        <div class="flex items-center space-x-3">
          <div class="task-drag-handle cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600" title="Drag to reorder">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
            </svg>
          </div>
          <input type="checkbox" 
                ${newTask.completed ? 'checked' : ''} 
                data-action="change->task#updateStatus"
                class="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
          <div class="flex flex-col">
            <span class="${newTask.completed ? 'line-through text-gray-500' : ''} cursor-pointer" 
                  data-action="click->task#edit">
              ${this.escapeHtml(newTask.name)}
            </span>
            ${newTask.notes ? `
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
          ${newTask.assignee ? `<span class="text-sm text-gray-500">Assigned: ${this.escapeHtml(newTask.assignee.name)}</span>` : ''}
          ${newTask.limit_date ? `<span class="text-sm text-red-500">Due: ${this.formatDate(newTask.limit_date)}</span>` : ''}
          ${newTask.estimated_time ? `<span class="text-sm text-gray-500">Estimated time: ${this.escapeHtml(newTask.estimated_time)}</span>` : ''}
        </div>
      </div>
    `;
    
    // Insert the new task before the "Add New Task" row
    const addTaskRow = this.element;
    addTaskRow.insertAdjacentHTML('beforebegin', taskHTML);
    
    // Update local data in dashboard controller
    this.updateDashboardData(newTask);
  }

  updateListCounts() {
    const listElement = this.element.closest('[data-controller*="list"]');
    if (listElement) {
      const listController = this.application.getControllerForElementAndIdentifier(listElement, 'list');
      if (listController) {
        listController.updateTaskCount();
        listController.recalculatePendingCount();
      }
    }
  }

  updateDashboardData(newTask) {
    // Find the dashboard controller to update local data
    const dashboardElement = document.querySelector('[data-controller*="dashboard"]');
    const dashboard = this.application.getControllerForElementAndIdentifier(dashboardElement, 'dashboard');
    
    if (dashboard) {
      const list = dashboard.listsData.find(l => l.id === this.listIdValue);
      if (list) {
        if (!list.tasks) list.tasks = [];
        list.tasks.push(newTask);
      }
    }
  }

  // Utility methods
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
  }
}
