json.array!(@event_assignments) do |event_assignment|
  json.extract! event_assignment, :id, :event_id, :user_id, :event_start_time, :event_end_time
  json.url event_assignment_url(event_assignment, format: :json)
end
