class List < ApplicationRecord
  include WeightManageable

  # Associations
  has_many :tasks, dependent: :destroy

  # Validations
  validates :name, presence: true

  # Callbacks
  before_create :set_weight

  private

  # Auto-increment weight for new lists using 10000 intervals
  def set_weight
    self.weight = calculate_new_weight
  end
end
