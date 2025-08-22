class User < ApplicationRecord
  # Associations
  has_many :assigned_tasks, class_name: "Task", foreign_key: "assignee_id", dependent: :nullify

  # Validations
  validates :name, presence: true
  validates :job_title, presence: true
end
