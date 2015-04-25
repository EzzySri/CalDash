class AddFieldsToEventAssignments < ActiveRecord::Migration
  def change
    add_column :event_assignments, :mandatory, 'boolean USING CAST(mandatory AS boolean)'
  end
end
