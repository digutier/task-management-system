class Task < ApplicationRecord
  # Associations
  belongs_to :assignee, class_name: 'User', optional: true
  belongs_to :list

  # Validations
  validates :name, presence: true
  validates :list, presence: true

  # Callbacks
  before_create :set_weight

  # Scopes
  scope :completed, -> { where(completed: true) }
  scope :pending, -> { where(completed: false) }

  private

  # Auto-increment weight for new tasks within the same list
  def set_weight
    max_weight = list.tasks.maximum(:weight) || 0
    self.weight = max_weight + 1
  end
end
