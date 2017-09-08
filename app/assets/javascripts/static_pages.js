//TODO Implement [alert on new message, auto-highlighting on new message, message length limit, user length limit]

const newMessage = new Event('newMessage');

function main() {

  // Icons for username input
  const userIcon = {
    locked: '<span id="user-locked-status" class="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>',
    unlocked: '<span id="user-locked-status" class="uk-form-icon uk-form-icon-flip" uk-icon="icon: unlock"></span>'
  };

  // Init username variable
  let username;

  // Close username prompt overlay
  function closeOverlay() {
    $('.messages-overlay').fadeOut();
  }

  // Open username prompt overlay
  function openOverlay() {
    $('.messages-overlay').fadeIn();
  }

  // Submit message to server
  function submitMessage(message, user) {
    return axios.post(messageURL, { message: { message, user }, authenticity_token });
  }

  // User form functions
  function disableUserForm() {
    const $wrapper = $('#username-form-wrapper');
    const $usernameForm = $('#username-form');
    const $icon = $('#user-locked-status');
    const $submit = $('#user-submit');
    $usernameForm.val(username);
    $usernameForm.addClass('uk-disabled');
    $icon.remove();
    $wrapper.addClass('username-saved');
    $wrapper.prepend(userIcon.locked);
    $submit.addClass('uk-disabled');
    $submit.hide();
  }
  function enableUserForm() {
    const $wrapper = $('#username-form-wrapper');
    const $usernameForm = $('#username-form');
    const $icon = $('#user-locked-status');
    const $submit = $('#user-submit');
    $usernameForm.removeClass('uk-disabled');
    $icon.remove();
    $wrapper.removeClass('username-saved');
    $wrapper.prepend(userIcon.unlocked);
    $submit.removeClass('uk-disabled');
    $submit.show();
  }

  // Message form functions
  function disableMessageForm() {
    $messageForm = $('#message-input');
    $submit = $('#message-submit');
    $messageForm.addClass('uk-disabled');
    $submit.addClass('uk-disabled');
  }
  function enableMessageForm() {
    $messageForm = $('#message-input');
    $submit = $('#message-submit');
    $messageForm.removeClass('uk-disabled');
    $submit.removeClass('uk-disabled');
  }
  function invalidateMessageForm() {
    $messageForm = $('#message-input');
    $messageForm.addClass('uk-form-danger');
  }
  function validateMessageForm() {
    $messageForm = $('#message-input');
    $messageForm.removeClass('uk-form-danger');
  }

  // Cookie getter and setter
  function getUsername() {
    return Cookies.get('username');
  }
  function setUsername(value) {
    Cookies.set('username', value);
  }

  // Check cookie and enable/disable forms accordingly
  function evaluateUsername() {
    if (getUsername()) {
      username = getUsername();
      disableUserForm();
      enableMessageForm();
      closeOverlay();
    } else {
      enableUserForm();
      disableMessageForm();
      openOverlay();
    }
  }

  // Check if user is at bottom of message list
  function userAtBottom() {
    const element = $('#message-box')[0];
    return element.scrollHeight - element.scrollTop - 45 === element.clientHeight;
  }

  // Scroll to bottom of message list
  function scrollToBottom() {
    $('#messages-bottom')[0].scrollIntoView();
  }

  // Tell user there is new messages
  function alertMessages() {
    //TODO Implement new message alerts to scroll down
  }

  // Return user list HTML element
  function createUserItem(user) {
    return '<li class="user-list-item"><a class="highlight-link">' + user + '</a></li>';
  }

  // Render full user list
  function renderUserList() {
    $('.user-list-item').remove();
    userList.forEach((u) => {
      $('#user-list').append(createUserItem(u));
    })
  }

  // Evaluate user name immediately
  evaluateUsername();

  // Scroll to bottom immediately
  scrollToBottom();

  // Listener for enter inside username input
  $('#username-form').keypress(function(event) {
    if (event.which === 13) {
      $('#user-submit').trigger('click');
      $(this).trigger('blur');
      return false;
    }
  });

  // Listener for username submit
  $('#user-submit').click(function() {
    username = $('#username-form').val();
    setUsername(username);
    evaluateUsername();
  });

  // Listener for enter key inside message input
  $('#message-input').keypress(function(event) {
    if (event.which === 13) {
      $('#message-submit').trigger('click');
      return false;
    }
  });

  // Listener for message submit
  $('#message-submit').click(function() {
    $input = $('#message-input');
    const message = $input.val();
    if (message.length !== 0 && message.length <= 140) {
      $input.val('');
      submitMessage(message, username)
      .then(() => {
        validateMessageForm();
      })
      .catch(() => {
        UIkit.notification('Connection Error', {status: 'danger', pos: 'top-right', timeout: 1500});
        invalidateMessageForm();
      });
    } else if (message.length === 0) {
      UIkit.notification('Your message is too short!', {status: 'danger', pos: 'top-right', timeout: 1500});
      invalidateMessageForm();
    } else if (message.length > 140) {
      UIkit.notification('Your message is too long!', {status: 'danger', pos: 'top-right', timeout: 1500});
      invalidateMessageForm();
    }
    return false
  });

  // Listener for new message incoming
  $(document).on('newMessage', function() {
    const $latestMessage = $('#message-list').children().last();
    const latestMessageUsername = $latestMessage.last().children().first().text();
    if (!userList.includes(latestMessageUsername)) userList.push(latestMessageUsername);
    renderUserList();
    if (userAtBottom() || latestMessageUsername === username) {
      scrollToBottom();
    } else {
      alertMessages();
    }
  });

  // Listener for scrolldown arrow
  $('#scroll-down').click(function() {
    scrollToBottom();
  });

  // Listener for highlight link click
  $(document).on('click', '.highlight-link', function() {
    $highlightSelector = $('.highlight-link:contains(' + $(this).text() + ')');
    if (!$highlightSelector.hasClass('highlighted')) {
      $highlightSelector.addClass('highlighted');
    } else {
      $highlightSelector.removeClass('highlighted');
    }
  });

  const messageCountdown = setInterval(function() {
    $('.message').each(function() {
      const $node = $(this);
      const timeLeft = Number($node.data('time-left'));
      renderUserList();
      if (timeLeft > 0) {
        $node.data('time-left', timeLeft - 1);
      } else {
        $node.remove();
      }
    });
  }, 1000);
}

$(document).ready(main);
