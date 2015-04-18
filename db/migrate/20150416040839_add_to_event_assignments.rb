class AddToEventAssignments < ActiveRecord::Migration
  def change
    add_column :event_assignments, :repeat_type, :string, default: "once"
    add_column :event_assignments, :repeat_begin, :decimal
    add_column :event_assignments, :repeat_end, :decimal
    add_column :event_assignments, :serialized_days_in_week, :integer, default: 0
    add_index :event_assignments, :repeat_begin
    add_index :event_assignments, :repeat_end
    add_index :event_assignments, [:repeat_begin, :repeat_end]
  end
end
