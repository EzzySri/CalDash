class EventAssignmentsController < ApplicationController

  include IceCube

  before_action :set_event_assignment, only: [:show, :edit, :update, :destroy]

  # GET /event_assignments
  # GET /event_assignments.json
  def index
    if params[:size]
      @event_assignments = EventAssignment.order(:created_at).limit(params[:size])
    else
      @event_assignments = EventAssignment.all
    end
    render json: {event_assignments: @event_assignments}, status: 200
  end

  # GET /event_assignments/1
  # GET /event_assignments/1.json
  def show
  end

  # GET /event_assignments/new
  def new
    @event_assignment = EventAssignment.new
  end

  # GET /event_assignments/1/edit
  def edit
  end

  # POST /event_assignments
  # POST /event_assignments.json
  def create
    @event_assignment = EventAssignment.new(event_assignment_params)

    respond_to do |format|
      if @event_assignment.save
        format.html { redirect_to @event_assignment, notice: 'Event assignment was successfully created.' }
        format.json { render :show, status: :created, location: @event_assignment }
      else
        format.html { render :new }
        format.json { render json: @event_assignment.errors, status: :unprocessable_entity }
      end
    end
  end


  def check_valid
    input_schedule = optimize_params_without_repeats[:events]
    mandatory = input_schedule.select {|e| e[:mandatory]}
    mandatory = mandatory.map {|e| Event.new(e)}
    flexible = input_schedule.select {|e| not e[:mandatory]}
    flexible = flexible.map {|e| Event.new(e)}

    tentative_schedule, buckets = is_valid_schedule(mandatory, flexible)

    def convert(tup)
      "#{tup[0]},#{tup[1]}"
    end

    final_schedule = []

    if tentative_schedule
      key = "AIzaSyDjnrRIi5yQf28IQT5VDc2li0DZMfpC0xQ"
      tentative_schedule.each_with_index do |piece, i|
        bucket = buckets[i]
        request = { 
          origin: convert(piece[:start]),
          destination: convert(piece[:end]),
          waypoints: piece[:waypoints].map {|x| convert(x)}.join("|"),
          optimizeWaypoints: true,
          travelMode: "walking",
          key: key
        }

        url = "https://maps.googleapis.com/maps/api/directions/json?" + request.to_query
        parsed_url = URI.parse(url)
        http = Net::HTTP.new(parsed_url.host, parsed_url.port)
        http.use_ssl = true
        request = Net::HTTP::Get.new(parsed_url.request_uri)
        response = http.request(request)
        response_obj = JSON.parse(response.body)
        order = response_obj["routes"][0]["waypoint_order"]
        ordered_assignments = bucket.schedule_with_order(order)
        final_schedule += ordered_assignments
      end
    end

    render json: {schedules: [final_schedule]}
  end


  def fetch_day_events
    date_in_unix = params[:date_in_unix].to_i
    @event_assignments = fetch_events(date_in_unix)

    render json: {:event_assignments => @event_assignments}, status: 200
  end

  def batch_fetch_events
    date_start = params[:date_start].to_i
    date_end = params[:date_end].to_i
    
    if date_start >= date_end
      render json: {}, status: 400
    end

    first_date = Time.at(date_start).beginning_of_day().to_datetime()
    last_date = Time.at(date_end).beginning_of_day().to_datetime()
    @event_assignments = {}
    while first_date <= last_date
      @event_assignments[first_date.to_i] = fetch_events(first_date.to_i)
      first_date = first_date + 1.day
    end
    render json: {:event_assignments => @event_assignments}, status: 200
  end

  # dummy function for testing front-test
  def save_schedule

    #input_schedule = optimize_params[:events]

    output_schedule = input_schedule.map do |event_params|

      if not event_params[:repeat_type].blank? and event_params[:repeat_type] != "once"
        date_start = Time.at(event_params[:repeat_begin]).beginning_of_day()
        date_end = Time.at(event_params[:repeat_end]).end_of_day()
        s = Schedule.new(date_start)
        s.end_time = date_end
        
        if event_params[:repeat_type] == "daily"
          s.add_recurrence_rule(Rule.daily)
        elsif event_params[:repeat_type] == "weekly"
          days = []
          weekdays.each_with_index do |item, index| 
            if params[:repeat_days].include?(index)
              days << item
            end
          end
          s.add_recurrence_rule(Rule.weekly(1).day(*days))
        end
      else
        s = nil
      end

      e = EventAssignment.new()
      e.assign_attributes(
        mandatory: true,
        name: event_params[:name],
        category: event_params[:category],
        description: event_params[:description],
        lat: event_params[:lat],
        lng: event_params[:lng],
        location: event_params[:location],
        is_private: event_params[:is_private],
        repeat_type: event_params[:repeat_type],
        start_unix: event_params[:start_unix],
        end_unix: event_params[:end_unix],
        schedule: s.to_yaml()
      )
      e
    end
    render json: {schedules: [output_schedule]}
  end

  def batch_create
    events_params = event_assignments_params[:event_assignments]
    
    date_start = Time.at(params[:date_in_unix]).beginning_of_day().to_datetime()
    date_end = date_start.end_of_day()
    
    @events = events_params.map do |event_params|
      
      event_assignment = EventAssignment.new
      event_assignment.assign_attributes(
        :name => event_params[:name],
        :location => event_params[:location],
        :category => event_params[:category],
        :start_unix => event_params[:start_unix],
        :end_unix => event_params[:end_unix],
        :lat => event_params[:lat],
        :lng => event_params[:lng],
        :mandatory => event_params[:mandatory],
        :description => event_params[:description],
        :is_private => event_params[:is_private],
        :repeat_type => event_params[:repeat_type],
        :schedule => event_params[:schedule]
      )
      event_assignment
    end
    begin
      # EventAssignment.destroy_all(:repeat_type => "once", :start_unix => date_start.to_i()..date_end.to_i()).to_a()
      ActiveRecord::Base.transaction do
        if (validates = @events.map(&:save)).all?
          render json: {}, status: 200
        else
          render json: {}, status: 400
        end
      end
    rescue => e
    end
  end

  # PATCH/PUT /event_assignments/1
  # PATCH/PUT /event_assignments/1.json
  def update
    respond_to do |format|
      if @event_assignment.update(event_assignment_params)
        format.html { redirect_to @event_assignment, notice: 'Event assignment was successfully updated.' }
        format.json { render :show, status: :ok, location: @event_assignment }
      else
        format.html { render :edit }
        format.json { render json: @event_assignment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /event_assignments/1
  # DELETE /event_assignments/1.json
  def destroy
    @event_assignment.destroy
    respond_to do |format|
      format.html { redirect_to event_assignments_url, notice: 'Event assignment was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_event_assignment
      @event_assignment = EventAssignment.find(params[:id])
    end

    def fetch_events(date_in_unix)
      date_start = Time.at(date_in_unix).beginning_of_day().to_datetime()
      date_end = date_start.end_of_day()
      
      event_assignments = EventAssignment.where(:repeat_type => "once", :start_unix => date_start.to_i()..date_end.to_i())
      
      EventAssignment.where(:repeat_type => "weekly").each do |recur_schedule|
        if Schedule.from_yaml(recur_schedule.schedule).occurs_between(date_start, date_end)
          event_assignments << recur_schedule
        end
      end
      event_assignments
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def event_assignment_params
      params.require(:event_assignment).permit(:event_id, :user_id, :event_start_time, :event_end_time)
    end

    def event_assignments_params
      params.permit(:date_in_unix, :event_assignment => {}, :event_assignments => [:mandatory, :name, :category, :description, :lat, :lng, :location, :start_unix, :end_unix, :is_private, :repeat_type, :schedule])
    end

    def optimize_params
      params.permit(:event_assignment => {}, :events => [:mandatory, :name, :category, :description, :lat, :lng, :location, :start_unix, :end_unix, :before_unix, :after_unix, :is_private, :repeat_type, :repeat_days, :duration_in_miliseconds, {:repeat_days => []}, :repeat_begin, :repeat_end])
    end

    def optimize_params_without_repeats
      params.permit(:event_assignment => {}, :events => [:mandatory, :name, :category, :description, :lat, :lng, :location, :start_unix, :end_unix, :before_unix, :after_unix, :is_private, :duration_in_miliseconds])
    end


    def weekdays
      [:sunday, :monday, :tuesday, :wednesday, :thursday, :friday, :saturday]
    end

    class Bucket
      # ALL TIME IS IN SECONDS
      def initialize(start, end_, start_event, end_event)
        @start_event = start_event
        @end_event = end_event
        @holding = []
        @start = start
        @end = end_
        @availabilites = {} # time to val. val is false if free. otherwise event at that time
        @GAP = 30 * 60

        # FIXME hack to deal with the last bucket
        if @end.nil?
          date = Time.at(start)
          date += (24 - date.hour).hours
          @end = date.to_i
        end
      end

      def in?(event) 
        return @start <= event.before_unix && @end >= event.after_unix
      end

      def can_place(event, start)
        length = event.duration_in_miliseconds
        while length > 0 
          if @availabilites[start] 
            return false
          end
          start += @GAP
          length -= @GAP
        end
        return true
      end

      def place_event(event, start)
        length = event.duration_in_miliseconds 
        while length > 0
          @availabilites[start] = event
          start += @GAP
          length -= @GAP
        end
      end

      def unfix_event(event, start)
        length = event.duration_in_miliseconds
        while length > 0
          @availabilites[start] = false
          start += @GAP
        end
      end

      def init_work
        time = @start
        @availabilites = {}
        while time < @end
          @availabilites[time] = false
          time += @GAP
        end
      end
      
      def create_assignmnet(event)
        e = EventAssignment.new()
        e.update_attributes(
          mandatory: true,
          name: event.name,
          category: event.category,
          description: event.description,
          lat: event.lat,
          lng: event.lng,
          location: event.location,
          is_private: event.is_private,
          #repeat_type: event.repeat_type,
          start_unix: event.start_unix,
          end_unix: event.end_unix
        )
        if not e.save
          byebug
        end
        return e
      end


      def schedule
        init_work()
        return schedule_helper(@holding)
      end

      def schedule_with_order(order)
        init_work()
        new_holding = []
        for i in order
          new_holding.push(@holding[i])
        end
        @holding = new_holding
        schedule_helper(@holding)

        current_event_index = 0
        seen_start = false
        prev = false
        final = [create_assignmnet(@start_event)]
        for time in @availabilites.keys.sort
          curr = @availabilites[time]
          if curr != prev 
            if seen_start
              event = @holding[current_event_index]
              event.start_unix = seen_start
              event.end_unix = time
              assignment = create_assignmnet(event)
              final.push(assignment)
              seen_start = false
              current_event_index += 1
            else
              seen_start = time
            end
          end
          prev = curr
        end
        byebug
        return final
      end


      def schedule_helper(events)
        if events.length == 0 
          return true
        end
        event = events[0]
        start = event.after_unix
        end_time = event.before_unix
        has_placed = false
        valid = false
        while (not valid) && start < end_time
          if can_place(event, start)
            place_event(event, start)
            valid = schedule_helper(events.drop(1))
            if not valid
              unfix_event(events, start)
            end
          end
          start += @GAP
        end
        return valid
      end

      def holding
        @holding
      end

    end

    def is_valid_schedule(mandatory, flexible)
      mandatory.sort_by {|e| e.start_unix}

      for e in mandatory
        for j in mandatory
          if e != j and e.overlaps?(j)
            return false
          end
        end
      end

      buckets = []
      mandatory.each_with_index do |event, i|
        if i + 1 < mandatory.length
          buckets.push(Bucket.new(event.end_unix, mandatory[i + 1].start_unix, event, mandatory[i + 1]))
        else
          buckets.push(Bucket.new(event.end_unix, nil, event, nil))
        end
      end

      # Fill in buckets
      flexible.each do |event|
        for bucket in buckets
          if bucket.in?(event)
            bucket.holding.push(event)
          end
        end
      end

      buckets.each do |b|
        if not b.schedule
          return false 
        end
      end

      final = []
      mandatory.each_with_index do |start, i|
        tmp = {}
        tmp[:start] = [start.lat, start.lng]
        tmp[:waypoints] = buckets[i].holding.map {|e| [e.lat, e.lng]}
        if i + 1 < mandatory.length
          tmp[:end] = [mandatory[i + 1].lat, mandatory[i + 1].lng]
        else
          # FIXME
          tmp[:end] = [mandatory[0].lat, mandatory[1].lng]
        end
        final.push(tmp)
      end
      return [final, buckets]
    end

end
