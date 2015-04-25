class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def pass_gon
    gon.rails_root = Rails.root.to_s()
    gon.image_tags = {
      meeting_icon: ActionController::Base.helpers.image_url("icon_briefcase.png"),
      hangout_icon: ActionController::Base.helpers.image_url("icon_bubbles.png"),
      work_icon: ActionController::Base.helpers.image_url("icon_imac.png"),
      play_icon: ActionController::Base.helpers.image_url("icon_joypad.png"),
      grooming_icon: ActionController::Base.helpers.image_url("icon_woman.png"),
      date_icon: ActionController::Base.helpers.image_url("icon_man.png"),
      shopping_icon: ActionController::Base.helpers.image_url("icon_package.png"),
      clubbing_icon: ActionController::Base.helpers.image_url("icon_speakers.png"),
      dining_icon: ActionController::Base.helpers.image_url("icon_wine.png")
    }
  end
end


