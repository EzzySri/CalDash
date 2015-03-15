class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :event_name
      t.integer :event_type
      t.string :event_location
      t.decimal :event_lat, {:precision=>10, :scale=>6}
      t.float :event_long, {:precision=>10, :scale=>6}
      t.integer :event_length
      t.integer :event_privacy

      t.timestamps null: false
    end
  end
end
