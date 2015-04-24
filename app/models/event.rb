class Event < ActiveRecord::Base
	has_many :event_assignments
	belongs_to :user, foreign_key: :created_by

  def overlaps?(other) 
    self.start_unix < other.end_unix and self.end_unix > self.start_unix
  end

end
