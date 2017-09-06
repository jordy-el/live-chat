class Message < ApplicationRecord
  validates :message, presence: true, length: { maximum: 140 }
  validates :user, presence: true, length: { maximum: 20 }
end
