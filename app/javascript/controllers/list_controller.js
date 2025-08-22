import { Controller } from "@hotwired/stimulus";

// List controller manages individual list behavior (toggle, task count updates)
export default class extends Controller {
  static targets = ["tasksContainer", "arrow", "taskCount", "pendingCount"];
  static values = { id: Number };

  toggle() {
    const isHidden = this.tasksContainerTarget.classList.contains('hidden');
    
    if (isHidden) {
      this.tasksContainerTarget.classList.remove('hidden');
      this.arrowTarget.textContent = '▼';
    } else {
      this.tasksContainerTarget.classList.add('hidden');
      this.arrowTarget.textContent = '▶';
    }
  }

  updateTaskCount() {
    if (this.hasTaskCountTarget) {
      // Count actual DOM elements for real-time accuracy
      const taskElements = this.element.querySelectorAll('[data-task-id-value]');
      const taskCount = taskElements.length;
      this.taskCountTarget.textContent = `(${taskCount} tasks)`;
    }
  }

  updatePendingCount(taskCompleted) {
    if (this.hasPendingCountTarget) {
      const currentPending = parseInt(this.pendingCountTarget.textContent);
      
      if (taskCompleted) {
        // Task completed, decrease pending count
        this.pendingCountTarget.textContent = Math.max(0, currentPending - 1);
      } else {
        // Task unchecked, increase pending count
        this.pendingCountTarget.textContent = currentPending + 1;
      }
    }
  }

  recalculatePendingCount() {
    if (this.hasPendingCountTarget) {
      const taskElements = this.element.querySelectorAll('[data-task-id-value]');
      let pendingCount = 0;
      
      taskElements.forEach(taskElement => {
        const checkbox = taskElement.querySelector('input[type="checkbox"]');
        if (checkbox && !checkbox.checked) {
          pendingCount++;
        }
      });
      
      this.pendingCountTarget.textContent = pendingCount;
    }
  }
}
