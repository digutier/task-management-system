Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Root route - main view of the task management system
  root "home#index"

  # RESTful API routes
  resources :users, only: [:index, :show, :create, :update]
  resources :lists, only: [:index, :show, :create, :update]
  resources :tasks, only: [:index, :show, :create, :update, :destroy]

  # Task detail view route
  get "tasks/:id/edit", to: "tasks#edit", as: :edit_task

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end
