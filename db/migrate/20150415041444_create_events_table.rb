class CreateEventsTable < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :name, null: false
      t.string :mandatory, null: false
      t.string :location
      t.string :category
      t.decimal :start_unix
      t.decimal :end_unix
      t.decimal :after_unix
      t.decimal :before_unix
      t.decimal :duration_in_miliseconds
      t.decimal :lat
      t.decimal :lng
      t.string :description
      t.boolean :is_private, default: false

      t.timestamps
    end
    add_index :events, :start_unix
    add_index :events, :end_unix
    add_index :events, :before_unix
    add_index :events, :after_unix
  end
end
