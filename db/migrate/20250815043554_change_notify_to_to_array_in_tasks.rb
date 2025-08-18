class ChangeNotifyToToArrayInTasks < ActiveRecord::Migration[8.0]
  def change
    change_column :tasks, :notify_to, :integer, array: true, default: [], using: 'CAST(CASE WHEN notify_to = \'\' THEN \'[]\' ELSE \'[]\' END AS integer[])'
  end
end
