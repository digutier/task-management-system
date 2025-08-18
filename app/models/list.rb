class List < ApplicationRecord
  # Associations
  has_many :tasks, dependent: :destroy

  # Validations
  validates :name, presence: true

  # Callbacks
  before_create :set_weight

  private

  # Auto-increment weight for new lists
  def set_weight
    self.weight = (List.maximum(:weight) || 0) + 1
  end
end
