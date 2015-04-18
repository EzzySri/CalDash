class ChangeMandatoryInEvents < ActiveRecord::Migration
  def change
    change_column :events, :mandatory, :boolean
  end
end
