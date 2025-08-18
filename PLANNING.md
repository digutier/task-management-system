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
