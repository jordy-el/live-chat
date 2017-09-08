App.messages = App.cable.subscriptions.create('MessagesChannel', {
  received: function(data) {
    const timeLeft = 600 - (moment().unix() - moment(data.created_at).unix());
    $('#message-list').append(this.createMessageNode(data.message, data.user, timeLeft));
    document.dispatchEvent(newMessage);
  },

  createMessageNode: function(message, user, timeLeft) {
  return '<li class="message" data-time-left="' + timeLeft + '"><a class="highlight-link">' + user + '</a><span>: </span><span class="message-body">' + message + '</span><div class="message-progress uk-inline uk-align-right"></div></li>';
  },
});