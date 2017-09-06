App.messages = App.cable.subscriptions.create('MessagesChannel', {
  received: function(data) {
    $('#message-list').append(this.createMessageNode(data.message, data.user));
    document.dispatchEvent(newMessage);
  },

  createMessageNode: function(message, user) {
  return '<li><a>' + user + '</a><span>: </span><span>' + message + '</span></li>';
  },
});