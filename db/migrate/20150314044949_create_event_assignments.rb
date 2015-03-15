class CreateEventAssignments < ActiveRecord::Migration
  def change
    create_table :event_assignments do |t|
      t.integer :event_id
      t.integer :user_id
      t.datetime :event_start_time
      t.datetime :event_end_time

      t.timestamps null: false
    end
  end
end
