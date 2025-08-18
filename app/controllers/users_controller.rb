class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update]

  # GET /users
  # Fetches all users from the database and returns them as JSON.
  def index
    @users = User.all
    
    respond_to do |format|
      format.html { redirect_to root_path }
      format.json { render json: @users }
    end
  end

  # GET /users/:id
  # Fetches a specific user by ID and returns it as JSON.
  def show
    render json: @user
  end

  # POST /users
  # Creates a new user with the provided parameters.
  def create
    @user = User.new(user_params)

    if @user.save
      render json: @user, status: :created
    else
      render json: { errors: @user.errors }, status: :unprocessable_entity
    end
  end

  # PATCH /users/:id
  # Updates an existing user with the provided parameters.
  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: { errors: @user.errors }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :job_title)
  end
end
