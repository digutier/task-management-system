class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :name
      t.references :assignee, null: true, foreign_key: { to_table: :users }
      t.date :limit_date
      t.text :notify_to
      t.text :notes
      t.boolean :completed, default: false
      t.date :estimated_time
      t.references :list, null: false, foreign_key: true
      t.integer :weight

      t.timestamps
    end
  end
end
