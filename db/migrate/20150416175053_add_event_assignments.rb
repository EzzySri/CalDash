class AddEventAssignments < ActiveRecord::Migration
  def change
    add_column :event_assignments, :repeat_type, :string
  end
end
