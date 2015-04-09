class EventAssignment < ActiveRecord::Base
	belongs_to :user
	belongs_to :event
	belongs_to :event_assignment
end
