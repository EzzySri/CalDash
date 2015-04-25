class ChangeMandatoryInEvents < ActiveRecord::Migration
  def change
    change_column :events, :mandatory, 'boolean USING CAST(mandatory AS boolean)'
  end
end
