App.messages = App.cable.subscriptions.create('MessagesChannel', {
  received: function(data) {
    $('#message-list').append(this.createMessageNode(data.message, data.user));
    document.dispatchEvent(newMessage);
  },

  createMessageNode: function(message, user) {
  return '<li class="message"><a class="highlight-link">' + user + '</a><span>: </span><span class="message-body">' + message + '</span></li>';
  },
});