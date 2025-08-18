class TasksController < ApplicationController
  before_action :set_task, only: [:show, :edit, :update, :destroy]

  # GET /tasks
  # Fetches all tasks from the database and returns them as JSON.
  def index
    @tasks = Task.includes(:assignee, :list).order(:weight)
    render json: @tasks, include: [:assignee, :list]
  end

  # GET /tasks/:id
  # Fetches a specific task by ID and returns it as JSON.
  def show
    render json: @task, include: [:assignee, :list]
  end

  # GET /tasks/:id/edit
  # Shows the task edit form for detailed task configuration.
  def edit
    @users = User.all
    @lists = List.all
  end

  # POST /tasks
  # Creates a new task with the provided parameters.
  def create
    @task = Task.new(task_params)

    if @task.save
      render json: @task, include: [:assignee, :list], status: :created
    else
      render json: { errors: @task.errors }, status: :unprocessable_entity
    end
  end

  # PATCH /tasks/:id
  # Updates an existing task with the provided parameters.
  def update
    if @task.update(task_params)
      render json: @task, include: [:assignee, :list]
    else
      render json: { errors: @task.errors }, status: :unprocessable_entity
    end
  end

  # DELETE /tasks/:id
  # Deletes a specific task by ID.
  def destroy
    @task.destroy
    head :no_content
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:name, :assignee_id, :limit_date, :notes, :completed, :estimated_time, :list_id, notify_to: [])
  end
end
