require 'test_helper'

class EventAssignmentsControllerTest < ActionController::TestCase
  setup do
    @event_assignment = event_assignments(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:event_assignments)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create event_assignment" do
    assert_difference('EventAssignment.count') do
      post :create, event_assignment: { event_end_time: @event_assignment.event_end_time, event_id: @event_assignment.event_id, event_start_time: @event_assignment.event_start_time, user_id: @event_assignment.user_id }
    end

    assert_redirected_to event_assignment_path(assigns(:event_assignment))
  end

  test "should show event_assignment" do
    get :show, id: @event_assignment
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @event_assignment
    assert_response :success
  end

  test "should update event_assignment" do
    patch :update, id: @event_assignment, event_assignment: { event_end_time: @event_assignment.event_end_time, event_id: @event_assignment.event_id, event_start_time: @event_assignment.event_start_time, user_id: @event_assignment.user_id }
    assert_redirected_to event_assignment_path(assigns(:event_assignment))
  end

  test "should destroy event_assignment" do
    assert_difference('EventAssignment.count', -1) do
      delete :destroy, id: @event_assignment
    end

    assert_redirected_to event_assignments_path
  end
end
