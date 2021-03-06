class Event < ActiveRecord::Base
	has_many :event_assignments
	belongs_to :user

  def overlaps?(other) 
    self.start_unix < other.end_unix and self.end_unix > other.start_unix
  end

end
