app/assets: contains info about styles, buttons, font, colors, icons, logos, etc. stuff that should be reutilized in the code. for this project we will not implement this.

app/controllers/concerns: here we define stuff like decorators and middleware stuff. Functions that can be used across different controllers like authentication, error handling, logs, json parsing, etc.

app/controllers/application_controller: the father controller that every other controller inherits. The index is being rendered in home_controller. It contains all logic for the main view. 

