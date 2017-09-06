function main() {

  // Message creation API
  const messageURL = 'http://localhost:3000/api/messages';

  // Icons for username input
  const userIcon = {
    locked: '<span id="user-locked-status" class="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>',
    unlocked: '<span id="user-locked-status" class="uk-form-icon uk-form-icon-flip" uk-icon="icon: unlock"></span>'
  };

  // Init username variable
  let username;

  // Return new message node
  function createMessageNode(message, user) {
    return `
        <li>
            <a>${user}</a><span>: </span>
            <span>${message}</span>
        </li>
    `;
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

  // Function for checking cookie and enabling/disabling forms accordingly
  function evaluateUsername() {
    if (getUsername()) {
      username = getUsername();
      disableUserForm();
      enableMessageForm();
    } else {
      enableUserForm();
      disableMessageForm();
    }
  }

  // Evaluate user name immediately
  evaluateUsername();

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
    if (message.length !== 0) {
      submitMessage(message, username)
      .then((response) => {
        const message = response.data.message;
        $('#message-list').append(createMessageNode(message, username));
        validateMessageForm();
        $input.val('');
      })
      .catch((e) => {
        UIkit.notification('Your message is too long!', {status: 'danger', pos: 'top-right', timeout: 1500});
        invalidateMessageForm();
      });
    } else {
      UIkit.notification('Your message is too short!', {status: 'danger', pos: 'top-right', timeout: 1500});
      invalidateMessageForm();
    }
    return false
  });
}

$(document).ready(main);
