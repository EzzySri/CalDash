class CreateEventAssignmentsTable < ActiveRecord::Migration
  def change
    create_table :event_assignments do |t|
      t.string :name, null: false
      t.string :location
      t.string :category
      t.decimal :start_unix, null: false
      t.decimal :end_unix, null: false
      t.decimal :lat
      t.decimal :lng
      t.string :description
      t.boolean :is_private, default: false

      t.timestamps
    end
    add_index :event_assignments, :start_unix
    add_index :event_assignments, :end_unix
  end
end