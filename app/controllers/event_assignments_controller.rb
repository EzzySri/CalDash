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

    sched = Sched.new(mandatory, flexible)
    final_schedule = sched.schedule
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


    class Sched
      attr_reader :curr_sched, :valids, :GAP, :final_length

      def initialize(mandatory, flexible)
        @curr_sched = mandatory.sort {|a, b| a.start_unix <=> b.start_unix }
        @flexible = flexible
        @GAP = 30 * 60
        @final_length = mandatory.length + flexible.length
        @best = [nil, Float::INFINITY]
        @count = 0
      end

      def can_place_event(event, start_time)
        old_start = event.start_unix
        old_end = event.end_unix
        event.start_unix = start_time
        event.end_unix = start_time + event.duration_in_miliseconds
        for other in @curr_sched
          if event.overlaps?(other)
            event.start_unix = old_start
            event.end_unix = old_end
            return false
          end
        end
        event.start_unix = old_start
        event.end_unix = old_end
        return true 
      end

      # call can_place to make sure this is valid
      def place_event(event, start_time)
        event.start_unix = start_time
        event.end_unix = start_time + event.duration_in_miliseconds
        placed = false
        @curr_sched.each_with_index do |e, i|
          if (i + 1 < @curr_sched.length and event.start_unix > e.start_unix and event.start_unix < @curr_sched[i + 1].start_unix)
            @curr_sched.insert(i + 1 , event)
            placed = true
            break
          end
        end
        if not placed
          @curr_sched.push(event)
        end
      end

      def unplace_event(event)
        @curr_sched.delete(event)
      end

      def create_assignmnet(event)
        e = EventAssignment.new(
          mandatory: true,
          name: event.name,
          category: event.category,
          description: event.description,
          lat: event.lat,
          lng: event.lng,
          location: event.location,
          is_private: event.is_private,
          repeat_type: "once",
          start_unix: event.start_unix,
          end_unix: event.end_unix
        )
        return e
      end

      def schedule
        if (@flexible.blank?) 
          return @curr_sched.map {|x| create_assignmnet(x)}
        else
          found = schedule_helper(@flexible)
          return @best[0].map {|x| create_assignmnet(x)}
        end
      end

      def schedule_helper(events)
        if events.length == 0 
          return true
        end

        event = events[0]
        start = event.after_unix
        end_time = event.before_unix
        has_placed = false

        while start + event.duration_in_miliseconds <= end_time
          if can_place_event(event, start)
            has_placed = true
            place_event(event, start)
            distance = distance_hueristic
            if distance < @best[1] # if the distance is already too long, prune
              valid = schedule_helper(events.drop(1))
              if valid and @curr_sched.length == @final_length
                distance_approx = distance_hueristic
                if distance_approx < @best[1]
                  puts distance_approx
                  @best = [Marshal.load(Marshal.dump(@curr_sched)), distance_approx]
                end
              end
            end
            unplace_event(event)
          end
          start += @GAP
        end

        return has_placed
      end

      def toRads(deg)
        Math::PI / 180 * deg
      end

      def distance_hueristic
        sum = 0
        radius = 6371
        @curr_sched.each_with_index do |e, i|
          if (i + 1 < @curr_sched.length)
            other = @curr_sched[i + 1]
            lat1 = toRads(e.lat)
            lat2 = toRads(other.lat)
            delta_lat = toRads(other.lat - e.lat)
            delta_long = toRads(other.lng - e.lng)

            a = (Math.sin(delta_lat / 2) ** 2 +
                 Math.cos(lat1)**2 * Math.cos(lat2) * Math.sin(delta_long / 2)**2)
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            sum += radius * c
          end
        end
        return sum
      end

      def gaps_hueristic
        @curr_sched.each_with_index do |e, i|
          gaps = 0
          if (i + 1 < @curr_sched.length)
            gaps += @curr_sched[i + 1].start_unix + e.end_unix 
          end
          return gaps
        end
      end
    end

end
