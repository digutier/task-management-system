import { Controller } from "@hotwired/stimulus";
import Sortable from "sortablejs";
import { ApiService } from "services/api_service";

// Sortable controller manages drag and drop functionality for tasks only
export default class extends Controller {
  static values = { 
    group: String,
    handle: String
  };

  connect() {
    this.initializeSortable();
  }

  disconnect() {
    if (this.sortable) {
      this.sortable.destroy();
    }
  }

  initializeSortable() {
    const options = {
      animation: 150,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      onEnd: this.handleSortEnd.bind(this)
    };

    // Set group for cross-container dragging
    if (this.groupValue) {
      options.group = this.groupValue;
    }

    // Set drag handle
    if (this.handleValue) {
      options.handle = this.handleValue;
    }

    this.sortable = new Sortable(this.element, options);
  }

  async handleSortEnd(event) {
    // Only handle task sorting
    if (this.groupValue === 'tasks') {
      await this.handleTaskSort(event);
    }
  }

  async handleTaskSort(event) {
    const taskElement = event.item;
    const taskId = taskElement.getAttribute('data-task-id-value');
    
    // Get the new list ID from the target container
    const newListId = event.to.getAttribute('data-list-id');
    const previousElement = event.item.previousElementSibling;
    const nextElement = event.item.nextElementSibling;
    
    const previousId = previousElement ? previousElement.getAttribute('data-task-id-value') : null;
    const nextId = nextElement ? nextElement.getAttribute('data-task-id-value') : null;
    
    if (!taskId) {
      console.error('No task ID found on element:', taskElement);
      return;
    }
    
    if (!newListId) {
      console.error('No list ID found on target container:', event.to);
      return;
    }
    
    try {
      const params = new URLSearchParams();
      params.append('list_id', newListId);
      if (previousId) params.append('previous_id', previousId);
      if (nextId) params.append('next_id', nextId);
      
      const result = await ApiService.patch(`/tasks/${taskId}`, null, params);
      
      // Update the task's data attributes
      taskElement.setAttribute('data-task-weight-value', result.weight);
      taskElement.setAttribute('data-task-list-id-value', result.list_id);

      // Update task counts and pending counts for both lists
      this.updateTaskCounts(event);
      
    } catch (error) {
      console.error('Error updating task position:', error);
      console.error('Error details:', { taskId, newListId, previousId, nextId });
    }
  }

  updateTaskCounts(event) {
    // Update task count for source list
    const sourceList = event.from.closest('.list-item');
    if (sourceList) {
      const sourceController = this.application.getControllerForElementAndIdentifier(sourceList, 'list');
      if (sourceController) {
        sourceController.updateTaskCount();
        sourceController.recalculatePendingCount();
      }
    }
  
    // Update task count for target list (if different)
    const targetList = event.to.closest('.list-item');
    if (targetList && targetList !== sourceList) {
      const targetController = this.application.getControllerForElementAndIdentifier(targetList, 'list');
      if (targetController) {
        targetController.updateTaskCount();
        targetController.recalculatePendingCount();
      }
    }
  }
}
