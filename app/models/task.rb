class Task < ApplicationRecord
  include WeightManageable

  # Associations
  belongs_to :assignee, class_name: "User", optional: true
  belongs_to :list

  # Validations
  validates :name, presence: true
  validates :list, presence: true
  validates :estimated_time, length: { maximum: 100 }, allow_blank: true

  # Callbacks
  before_create :set_weight

  # Scopes
  scope :completed, -> { where(completed: true) }
  scope :pending, -> { where(completed: false) }

  # Move task to a different list with proper weight calculation
  def move_to_list(new_list, previous_task: nil, next_task: nil)
    self.list = new_list

    # Calculate weight within the new list's task scope
    new_list_tasks = new_list.tasks.where.not(id: self.id)
    move_to_position(
      previous_item: previous_task,
      next_item: next_task,
      scope: new_list_tasks
    )
  end

  private

  # Auto-increment weight for new tasks within the same list using 10000 intervals
  def set_weight
    self.weight = calculate_new_weight(list.tasks)
  end
end
