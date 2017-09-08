class StaticPagesController < ApplicationController
  def home
    last_messages = Message.where('updated_at > ?', 10.minutes.ago)
    @messages = last_messages.select(:message, :user, :created_at)
    @users = last_messages.pluck(:user).uniq
  end
end
