class EventAssignmentsController < ApplicationController

  include IceCube

  before_action :set_event_assignment, only: [:show, :edit, :update, :destroy]

  # GET /event_assignments
  # GET /event_assignments.json
  def index
    EventAssignment.all
    # repeat_type = params[:repeat_type]
    # date_in_unix = params[:date_in_unix]
    # date_start = Time.at(date_in_unix).beginning_of_day().to_datetime()
    # date_end = date_start.end_of_day()
    # if repeat_type == "once"
    #   @event_assignments = EventAssignment.where(:type => "once", :start_unix => date_start.to_i()..date_end.to_i())
    #   render json: @event_assignments, status: 200
    # end
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
  def optimize
    input_schedule = optimize_params[:events]
    
    # optmization magic here

    output_schedule = input_schedule.map do |event_params|

      if event_params[:repeat_type] != "once"

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
      e.update_attributes(
        mandatory: true,
        name: event_params[:name],
        category: event_params[:category],
        description: event_params[:event_description],
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
    @events = events_params.map do |event_params|
      
      event_assignment = EventAssignment.new
      event_assignment.update_attributes(
        :name => event_params[:name],
        :location => event_params[:location],
        :category => event_params[:category],
        :start_unix => event_params[:start_unix],
        :end_unix => event_params[:end_unix],
        :lat => event_params[:lat],
        :lng => event_params[:lng],
        :description => event_params[:description],
        :is_private => event_params[:is_private],
        :repeat_type => event_params[:repeat_type],
        :schedule => event_params[:schedule]
      )
      event_assignment
    end
    ActiveRecord::Base.transaction do
      if (validates = @events.map(&:save)).all?
        render json: {}, status: 200
      else
        render json: {}, status: 400
      end
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
      params.permit(:event_assignment => {}, :event_assignments => [:mandatory, :name, :category, :description, :lat, :lng, :location, :start_unix, :end_unix, :is_private, :repeat_type, :schedule])
    end

    def optimize_params
      params.permit(:event_assignment => {}, :events => [:mandatory, :name, :category, :description, :lat, :lng, :location, :start_unix, :end_unix, :before_unix, :after_unix, :is_private, :repeat_type, :repeat_days, {:repeat_days => []}, :repeat_begin, :repeat_end])
    end

    def weekdays
      [:sunday, :monday, :tuesday, :wednesday, :thursday, :friday, :saturday]
    end
end
