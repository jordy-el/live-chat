require 'test_helper'

class MessageTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end

  def setup
    @message = Message.new(user: 'Example User', message: 'Example Message')
  end

  test 'saves valid message' do
    assert @message.save!
  end

  test 'allows only 140 characters' do
    @message.message = (1..141).map { 'a' }.join ''
    assert_not @message.save
  end

  test 'allows maximum 20 character username' do
    @message.user = (1..21).map { 'a' }.join ''
    assert_not @message.save
  end
end
