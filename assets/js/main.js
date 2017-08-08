$(document).ready(function() {
  $("#contact-form").off("submit");
  $("#contact-form").on("submit", function(event) {
    event.preventDefault();
    
    var name = $("#name").val();
    var email = $("#email").val();
    var subject = $("#subject").val();
    var message = $("#message").val();

    $("#name, #email, #message").removeClass("invalid-input");
    hideStatus();

    var nameEmpty = isFieldEmpty("name");
    var emailEmpty = isFieldEmpty("email");
    var messageEmpty = isFieldEmpty("message");

    var isAtLeastOneFieldBlank = nameEmpty || emailEmpty || messageEmpty;

    if (isAtLeastOneFieldBlank) {
      $("#status .status-box").append("The following fields must be filled out.<br />");
    }

    var emailInvalid = emailEmpty || !isEmailValid();

    if (isAtLeastOneFieldBlank || emailInvalid) {
      showStatus("error");
      return false;
    }

    // Send the email via AJAX.
    $.ajax({
      url: "https://getsimpleform.com/messages/ajax?form_api_token=ac32ba6210caca416bb14b80583c6407",
      data: {
        name: name,
        email: email,
        subject: subject,
        message: message
      },
      dataType: "json",
      success: function(result, status, xhr) {
        showStatus("success", "Message sent successfully.");
        document.getElementById("contact-form").reset();
      },
      error: function(xhr, status, error) {
        showStatus("error", error);
      }
    });
  });

  function isFieldEmpty(id) {
    var el = $("#" + id);
    if ($.trim(el.val()).length === 0) {
      el.addClass("invalid-input");
      return true;
    }
    return false;
  }

  function isEmailValid() {
    var email = $("#email").val();
    // Email regex found at http://www.w3resource.com/javascript/form/email-validation.php
    var valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    if (!valid) {
      $("#status .status-box").append("Email is invalid.");
    }
    return valid;
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function hideStatus() {
    $(".status-box").removeClass("success error")
    $(".status-box").html("");
  }

  function showStatus(status, message) {
    $("#status .status-box").addClass(status);
    if (message) {
      $("#status .status-box").html(message);
    }
    $("#status .status-box").append("<button class='close' data-behavior='close'>&times;</button>");
    $("[data-behavior='close']").off("click");
    $("[data-behavior='close']").on("click", function() {
      hideStatus();
    });
  }
});
