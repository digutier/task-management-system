require_relative "../services/llm_service"

class TasksController < ApplicationController
  before_action :set_task, only: [ :show, :edit, :update, :destroy ]

  # GET /tasks
  # Fetches all tasks from the database and returns them as JSON.
  def index
    @tasks = Task.includes(:assignee, :list).order(:weight)
    render json: @tasks, include: [ :assignee, :list ]
  end

  # GET /tasks/:id
  # Fetches a specific task by ID and returns it as JSON.
  def show
    render json: @task, include: [ :assignee, :list ]
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

    # Rails.logger.info "Calling LLM service for time estimation"
    # if @task.notes.present?
    #   estimated_time = LlmService.estimate_task_time(@task.name, @task.notes)
    #   @task.estimated_time = estimated_time if estimated_time
    # end

    if @task.save
      render json: @task, include: [ :assignee, :list ], status: :created
    else
      render json: { errors: @task.errors }, status: :unprocessable_entity
    end
  end

  # PATCH /tasks/:id
  # Updates an existing task with the provided parameters.
  # Supports weight repositioning and list changes for drag-and-drop functionality.
  def update
    old_notes = @task.notes_was
    if weight_position_params.present?
      # Drag & drop operations - return JSON
      handle_weight_repositioning
    elsif params[:task] && params[:task].key?(:completed) && params[:task].keys.length == 1
      Rails.logger.info "Treating as checkbox update"
      if @task.update(task_params)
        render json: @task, include: [ :assignee, :list ]
      else
        render json: { errors: @task.errors }, status: :unprocessable_entity
      end
    elsif @task.update(task_params)
      if task_params[:notes].present? && task_params[:notes] != old_notes
        Rails.logger.info "Calling LLM service for time estimation"
        estimated_time = LlmService.estimate_task_time(@task.name, task_params[:notes])
        @task.update(estimated_time: estimated_time) if estimated_time
      else
        Rails.logger.info "Skipping LLM estimation - notes unchanged or not present"
      end

  redirect_to root_path, notice: "Task updated successfully!"
    else
      # Validation errors - render edit form
      Rails.logger.info "Validation errors, rendering edit form"
      @users = User.all
      @lists = List.all
      render :edit, status: :unprocessable_entity
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

  def weight_position_params
    params.permit(:previous_id, :next_id, :list_id)
  end

  # Handle weight repositioning for drag-and-drop
  # Supports both reordering within the same list and moving between lists
  def handle_weight_repositioning
    target_list_id = params[:list_id] || @task.list_id
    target_list = List.find(target_list_id)

    previous_task = params[:previous_id].present? ? Task.find(params[:previous_id]) : nil
    next_task = params[:next_id].present? ? Task.find(params[:next_id]) : nil

    begin
      if target_list_id.to_i != @task.list_id
        # Moving to a different list
        new_weight = @task.move_to_list(
          target_list,
          previous_task: previous_task,
          next_task: next_task
        )
      else
        # Reordering within the same list
        new_weight = @task.move_to_position(
          previous_item: previous_task,
          next_item: next_task,
          scope: @task.list.tasks.where.not(id: @task.id)
        )
      end

      render json: {
        id: @task.id,
        weight: new_weight,
        list_id: @task.list_id,
        message: "Task position updated successfully"
      }
    rescue => e
      render json: {
        errors: { weight: [ "Failed to update position: #{e.message}" ] }
      }, status: :unprocessable_entity
    end
  end
end
