# Shared weight management logic for models with weight ordering
module WeightManageable
  extend ActiveSupport::Concern

  WEIGHT_INTERVAL = 10000

  class_methods do
    # Normalize all weights in the collection to 10000 intervals
    # Used when there's no space between adjacent weights
    def normalize_weights(scope = nil)
      collection = scope || all
      ordered_items = collection.order(:weight, :id)

      ordered_items.each_with_index do |item, index|
        new_weight = (index + 1) * WEIGHT_INTERVAL
        item.update_column(:weight, new_weight)
      end

      ordered_items.count
    end
  end

  # Calculate weight for new item (append at the end)
  def calculate_new_weight(scope = nil)
    collection = scope || self.class.all
    max_weight = collection.maximum(:weight) || 0
    max_weight + WEIGHT_INTERVAL
  end

  # Calculate weight when moving item between two positions
  # Returns the average weight, or triggers normalization if no space
  def calculate_weight_between(previous_item, next_item, scope = nil)
    prev_weight = previous_item&.weight || 0
    next_weight = next_item&.weight || (prev_weight + 2 * WEIGHT_INTERVAL)

    # Check if there's space for a weight between the two items
    if next_weight - prev_weight > 1
      # Calculate average weight
      (prev_weight + next_weight) / 2
    else
      # No space available, normalize all weights in the scope
      collection = scope || self.class.all
      normalized_count = self.class.normalize_weights(collection)

      # Recalculate position after normalization
      ordered_items = collection.order(:weight, :id).to_a
      prev_index = previous_item ? ordered_items.index(previous_item) : -1
      new_position = prev_index + 1

      # Return weight for the new position
      (new_position + 1) * WEIGHT_INTERVAL
    end
  end

  # Move item to a new position relative to other items
  def move_to_position(previous_item: nil, next_item: nil, scope: nil)
    if previous_item.nil? && next_item.nil?
      # Moving to the end
      self.weight = calculate_new_weight(scope)
    else
      # Moving between items
      self.weight = calculate_weight_between(previous_item, next_item, scope)
    end

    save!
    self.weight
  end

  # Get the previous item by weight
  def previous_item(scope = nil)
    collection = scope || self.class.all
    collection.where("weight < ?", weight).order(weight: :desc).first
  end

  # Get the next item by weight
  def next_item(scope = nil)
    collection = scope || self.class.all
    collection.where("weight > ?", weight).order(:weight).first
  end
end
