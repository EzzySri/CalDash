class EventAssignmentsController < ApplicationController
  before_action :set_event_assignment, only: [:show, :edit, :update, :destroy]

  # GET /event_assignments
  # GET /event_assignments.json
  def index
    @event_assignments = EventAssignment.all
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

    # Never trust parameters from the scary internet, only allow the white list through.
    def event_assignment_params
      params.require(:event_assignment).permit(:event_id, :user_id, :event_start_time, :event_end_time)
    end
end
