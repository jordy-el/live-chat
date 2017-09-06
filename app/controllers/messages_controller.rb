class MessagesController < ApplicationController

  def create
    @message = Message.new(message_params)
    if @message.save!
      ActionCable.server.broadcast 'messages', message: @message.message, user: @message.user
      render json: @message, status: :created
    else
      render status: :unprocessable_entity
    end
  end

  private

  def message_params
    params.require(:message).permit(:message, :user)
  end
end