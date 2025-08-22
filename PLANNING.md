### 🔄 Project Goal
- **Task Management System** is a small app that simulates list of tasks where the user can add, delete, edit, and mark as completed the tasks. 

### 📋 Models and attributes (tables)
- **User**:
  - id -> primary key unique
  - name -> string / mandatory
  - job_title -> string / mandatory
- **Task**:
  - id -> primary key unique / mandatory
  - name -> string / mandatory
  - assignee -> user id foreign key (User table)
  - limit_date -> date
  - notify_to -> Array of user ids
  - notes -> string
  - completed -> boolean (default false)
  - estimated_time -> date
  - list -> id foreign key (List table)
  - weight -> number
- **List**:
  - id -> primary key unique
  - name -> string
  - weight -> number

### Endpoints
- **User**:
  - POST
  - GET
  - PATCH

- **Task**:
  - POST
  - GET
  - PATCH
  - DELETE

- **List**:
  - POST
  - PATCH
  - GET

### Project Idea
- This is like an admin view of the lists and tasks. It means that i can see literally all of them, for all users. This app does not manage sessions or something like that.
- Main view:
  - The main view will have a header with a button with title `+ New list` that adds a new list, a center title called `To-dos`
  - In the body of the main view we will have multiple lists (that starts collapsed) that will contain a list of all tasks associated to that list. When pressing the button to expand, the list will show all tasks with their title and a checkbox that can mark as completed when pressing (PATCH method). At the end of the list a button called `Add a to-do` will add a new task. It will basically show a new row of task with empty name where the user will enter the task name. If entered correctly, the task will be created with POST only using the name, id, list and weight fields.
  - When clicking the `+ New list` button, a new list appears at the bottom of the main view with the correspondant weight.
- Task view:
  - The task view is reached only by clicking a task into the list.
  - There, the user can config the following fields from the task model:
    - `assignee` with title `Assigned to`
    - `limit_date` with title `Due to`
    - `notify_to` with title `When done, notify`
    - `notes` with title `Notes`
  - A trash button can DELETE the task and redirect to the main view with the task deleted

### New feature:
- Let's reimagine the weight field for tasks and lists. We need a new feature that allows the user to drag and drop both lists and tasks and update the weight value in real time, that means whenever the user drops the element to a different spot. There is a problem with this: if we have too many tasks or lists then we would have to update each one of them whenever a task/list is being moved which is inefficient. The solution to this is that we will apply weights in the order of 10000 for each created task/list, and when an element is moved between two, the new weight will be the average of the weights between the new spot. With this solution, only one element will be patched. If there is no available weight between two spots, then we will normalize all entries and reapply their weight in the order 10000 from 0 to n*10000. I want you to implement this drag and drop feature, weight reinvention and patch rules when moving an entity to another spot.