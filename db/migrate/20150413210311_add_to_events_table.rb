class AddToEventsTable < ActiveRecord::Migration
  def change
    add_column :events, :duration_in_miliseconds, :decimal
  end
end
