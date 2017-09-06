class StaticPagesController < ApplicationController
  def home
    @messages = Message.last(15)
  end
end
