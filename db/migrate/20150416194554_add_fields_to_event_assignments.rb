class AddFieldsToEventAssignments < ActiveRecord::Migration
  def change
    add_column :event_assignments, :mandatory, :boolean
  end
end
