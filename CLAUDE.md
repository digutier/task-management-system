### 🔄 Project Awareness & Context
- **Always read `PLANNING.md`** at the start of a new conversation to understand the project's goals, models, styles, and constraints.
- **Use consistent naming conventions, file structure, and architecture patterns** as described in this file.

### 🧱 Code Structure & Modularity
- **Never create a file longer than 300 lines of code.** If a file approaches this limit, refactor by splitting it into modules or helper files.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.
  For services this looks like:
    - `*_controller.rb` - Definition of HTTP endpoints and requests handling
    - `*.rb` - Model definitions that will be used
- **Use clear, ordered, consistent imports** (prefer relative imports within packages).
- **Models** should be created in `app/models`. Each model should be created in a single file.
- **Controllers** should be created in `app/controllers`. Each controller should be created in a single file.
- **Views** should be created in `app/views`. Each view should be created in a single file.
- **Helpers** are reusable methods that should be inside app/helpers folder.
- **Routes** should be organized in `config/routes.rb` following RESTful conventions when possible.
- **Database migrations** should be created in `db/migrate/` to track all database schema changes over time.

### 📎 Style & Conventions
- **Use Ruby** as the primary language.
- **Use Ruby Style Guide** and **Rails Style Guide** when creating code.
- Create parameter validations defined inside `PLANNING.md` when creating a controller.
- Write **functions or controllers documentation** using the following style:
  ```ruby
  # GET /users
  # Fetches all users from the database and returns them as JSON.
  def index
    @users = User.all
    render json: @users
  end
  ```

### 📚 Documentation & Explainability
- **Update `README.md`** when new features are added, dependencies change, or setup steps are modified.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add an inline `# Reason:` comment** explaining the why, not just the what.

### 🧠 AI Behavior Rules
- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate gems or functions** – only use known, verified Ruby gems.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- **Never delete or overwrite existing code** unless explicitly instructed.
