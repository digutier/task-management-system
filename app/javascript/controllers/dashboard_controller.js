import { Controller } from "@hotwired/stimulus";
import { ApiService } from "services/api_service";
import { ListComponent } from "components/list_component";

// Dashboard controller manages the overall dashboard state and rendering
export default class extends Controller {
  static targets = ["listsContainer", "loadingState", "emptyState", "errorState", "newListInput"];

  // Global data storage
  listsData = [];
  usersData = [];

  connect() {
    this.loadDashboard();
  }

  async loadDashboard() {
    try {
      this.showLoadingState();
      
      // Fetch data from both API endpoints in parallel
      const [listsResponse, usersResponse] = await Promise.all([
        ApiService.get('/lists.json'),
        ApiService.get('/users.json')
      ]);

      this.listsData = listsResponse;
      this.usersData = usersResponse;

      // Render the dashboard
      this.renderDashboard();
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      this.showErrorState();
    }
  }

  renderDashboard() {
    this.hideLoadingState();

    if (this.listsData.length === 0) {
      this.showEmptyState();
      return;
    }

    this.hideEmptyState();
    this.showListsContainer();

    // Clear existing content
    this.listsContainerTarget.innerHTML = '';

    // Sort lists by weight before rendering
    const sortedLists = [...this.listsData].sort((a, b) => a.weight - b.weight);

    // Render each list
    sortedLists.forEach(list => {
      const listElement = this.createListElement(list);
      this.listsContainerTarget.appendChild(listElement);
    });

  }

  createListElement(list) {
    return ListComponent.create(list);
  }

  handleNewListKeydown(event) {
    if (event.key === 'Enter') {
      this.createNewList();
    }
  }

  async createNewList() {
    const listName = this.newListInputTarget.value.trim();
    if (!listName) return;
  
    try {
      const newList = await ApiService.post('/lists', {
        list: { name: listName }
      });
  
      // Add tasks array if not present
      newList.tasks = newList.tasks || [];
      
      // Add to local data and DOM
      this.addNewListToDOM(newList);
      
      // Clear the input field
      this.newListInputTarget.value = '';
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating list. Please try again.');
    }
  }

  addNewListToDOM(newList) {
    // If there were no lists before, hide empty state and show container
    if (this.listsData.length === 0) {
      this.hideEmptyState();
      this.showListsContainer();
    }
    
    // Add to local data
    this.listsData.push(newList);
    
    // Create and append the new list element
    const listElement = this.createListElement(newList);
    this.listsContainerTarget.appendChild(listElement);

  }

  // State management methods
  showLoadingState() {
    this.loadingStateTarget.classList.remove('hidden');
    this.listsContainerTarget.classList.add('hidden');
    this.emptyStateTarget.classList.add('hidden');
    this.errorStateTarget.classList.add('hidden');
  }

  hideLoadingState() {
    this.loadingStateTarget.classList.add('hidden');
  }

  showErrorState() {
    this.loadingStateTarget.classList.add('hidden');
    this.listsContainerTarget.classList.add('hidden');
    this.emptyStateTarget.classList.add('hidden');
    this.errorStateTarget.classList.remove('hidden');
  }

  showEmptyState() {
    this.emptyStateTarget.classList.remove('hidden');
    this.listsContainerTarget.classList.add('hidden');
  }

  hideEmptyState() {
    this.emptyStateTarget.classList.add('hidden');
  }

  showListsContainer() {
    this.listsContainerTarget.classList.remove('hidden');
  }
}
