class StaticPagesController < ApplicationController
  def home
    @messages = Message.where('updated_at > ?', 10.minutes.ago)
    @users = @messages.pluck(:user).to_a.uniq
  end
end
