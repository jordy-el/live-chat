class StaticPagesController < ApplicationController
  def home
    @messages = Message.where('updated_at > ?', 10.minutes.ago)
  end
end
