module EventAssignmentsHelper
  class Bucket
    # ALL TIME IS IN SECONDS
    def initialize(start, end_)
      @holding = []
      @start = start
      @end = end_
      @availabilites = {}
      @GAP = 30 * 60
    end

    def in?(event) 
      if event.start_unix and event.end_unix
        return @start <= event.start_unix && @end >= event.end_unix
      else
        return @start <= event.before_unix && @end <= event.after_unix
      end
    end

    def can_place(event, start)
      length = event.duration_in_miliseconds / 1000
      while length > 0 
        if not availabilites[start] 
          return false
        end
        start += @GAP
        length -= @GAP
      end
    end

    def place_event(event, start)
      length = event.duration_in_miliseconds / 1000
      while length > 0
        availabilites[start] = event
        start += @GAP
        length -= @GAP
      end
    end

    def unfix_event(event, start)
      length = event.duration_in_miliseconds / 1000
      while length > 0
        availabilites[start] = false
        start += @GAP
      end
    end

    def schedule
      time = @start
      @availabilites = {}
      while time < @end
        availabilites[time] = false
        time += @GAP
      end
      return schedule_helper(@holding, availabilites)
    end

    def schedule_helper(events, availabilites)
      if events.length == 0 
        return true
      end
      event = events[0]
      start = event.before_unix
      end_time = event.end_unix
      has_placed = false
      valid = false
      while (not valid) && start < end_time
        if can_place(event, start)
          place_event(event, start)
          valid = schedule_helper(events.drop(1), availabilites)
          if not valid
            unfix_event(events, start)
          end
        end
        start += @GAP
      end
      return valid
    end

  end

  def optimizer(mandatory, flexible)
    mandatory.sort_by {|e| e.start_unix}

    for e in mandatory
      for j in mandatory
        if can_organize and e != j and e.overlaps?(j)
          return false
        end
      end
    end

    buckets = []
    mandatory.each_with_index do |event, i|
      if i + 1 < mandatory.length
        buckets.push(Bucket(event.end_unix, mandatory[i + 1].start_unix))
      else
        buckets.push(Bucket(event.end_unix, nil))
      end
    end

    # Fill in buckets
    flexible.each do |event|
      for bucket in buckets
        if bucket.in?(flexible)
          bucket.holding.push(flexible)
        end
      end
    end

    buckets.each do |b|
      if not b.schedule
        return false 
      end
    end
  end
end
