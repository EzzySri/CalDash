json.array!(@events) do |event|
  json.extract! event, :id, :event_name, :event_type, :event_location, :event_lat, :event_long, :event_length, :event_privacy
  json.url event_url(event, format: :json)
end
