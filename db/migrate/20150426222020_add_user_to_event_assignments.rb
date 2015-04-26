class AddUserToEventAssignments < ActiveRecord::Migration
  def change
    add_column :event_assignments, :user_id, :integer
  end
end
