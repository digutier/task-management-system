class ListsController < ApplicationController
  before_action :set_list, only: [:show, :update]

  # GET /lists
  # Fetches all lists with their tasks from the database and returns them as JSON.
  def index
    @lists = List.includes(tasks: :assignee).order(:weight)
    
    respond_to do |format|
      format.html { redirect_to root_path }
      format.json { render json: @lists, include: { tasks: { include: :assignee } } }
    end
  end

  # GET /lists/:id
  # Fetches a specific list by ID with its tasks and returns it as JSON.
  def show
    render json: @list, include: { tasks: { include: :assignee } }
  end

  # POST /lists
  # Creates a new list with the provided parameters.
  def create
    @list = List.new(list_params)

    if @list.save
      render json: @list, status: :created
    else
      render json: { errors: @list.errors }, status: :unprocessable_entity
    end
  end

  # PATCH /lists/:id
  # Updates an existing list with the provided parameters.
  def update
    if @list.update(list_params)
      render json: @list
    else
      render json: { errors: @list.errors }, status: :unprocessable_entity
    end
  end

  private

  def set_list
    @list = List.find(params[:id])
  end

  def list_params
    params.require(:list).permit(:name)
  end
end
