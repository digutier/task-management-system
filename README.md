# Sistema de Gestión de Tareas - Desafío de programación (Saludtech)

## Objetivo: Desarrollar un pequeño servicio web para gestionar tareas (TODO list).

Things you may want to cover:

Prompt #1:
- Claude i have a mission for you. Create a new project in ruby on rails. I have a CLAUDE.md file passed as context you have to read it carefully and consider every detail/rules while creating this project. The PLANNING.md file basically has all the requirements for this project. If you have any question or doubts don't assume anything, just ask me and i will give you the answers. Do it.

Question #2:
Questions before I start:
Database: I see you have PostgreSQL configured. Should I proceed with PostgreSQL or would you prefer SQLite for development?
notify_to field: The planning shows notify_to -> Array of user ids. Should this be a simple array field, or do you want a separate notification/junction table for better relational integrity?
Weight field: For both Task and List models, what should be the logic for weight assignment? Should it auto-increment, or should users manually set it?
Styling: Any preference for CSS framework (Bootstrap, Tailwind) or should I use plain CSS with Rails' default styling?
Estimated_time field: The planning shows estimated_time -> date but this seems like it should be a duration rather than a date. Should this be hours/minutes, or did you mean something else?

Prompt #2
- Proceed with PostgreSQL. Make a simple array field, that array should contain users ids. For the moment let's do weight field auto-increment. CSS with Tailwind please. Lets assume for estimated_time as the date when the task will be done, instead of the time that takes to complete.
