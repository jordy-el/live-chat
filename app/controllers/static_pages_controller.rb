class StaticPagesController < ApplicationController
  def home
    @messages = Message.last(10)
  end
end
