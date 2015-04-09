class Event < ActiveRecord::Base
	has_many :event_assignments
	belongs_to :user, foreign_key: :created_by
end
