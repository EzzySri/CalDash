class DropEventAssignmentsTable < ActiveRecord::Migration
  def change
    drop_table :event_assignments
  end
end
