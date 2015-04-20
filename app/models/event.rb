class Event < ActiveRecord::Base
	has_many :event_assignments
	belongs_to :user, foreign_key: :created_by

  def overlaps?(other) 
    self.end_unix > other.start_unix and self.start_unix < other.end_unix
  end

end
