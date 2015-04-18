class ChangeEventAssignments < ActiveRecord::Migration
  def change
    remove_column :event_assignments, :repeat_type
    remove_column :event_assignments, :repeat_begin
    remove_column :event_assignments, :repeat_end
    remove_column :event_assignments, :serialized_days_in_week
    add_column :event_assignments, :schedule, :string
  end
end