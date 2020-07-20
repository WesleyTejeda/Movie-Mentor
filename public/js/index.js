//Build out functionality
$(document).ready(function () {
    var loginForm = $(".login");
    var signUpForm = $(".signup");
    var usernameInput = $("#loginUsername");
    var passwordInput = $("#loginPassword");
    var registerName = $("#signUpUsername");
    var registerPassword = $("#signUpPassword");
    loginForm.on("submit", function (event) {
      event.preventDefault();
      var userData = {
        username: usernameInput.val().trim(),
        password: passwordInput.val().trim(),
      };
      if (!userData.username || !userData.password) {
        return;
      }
      loginUser(userData.username, userData.password);
      usernameInput.val("");
      passwordInput.val("");
    });
    function loginUser(username, password) {
      $.get("/api/login", {
        username: username,
        password: password,
      })
        .then(function () {
          window.location.replace("/users");
          // If there's an error, log the error
        })
        .catch(function (err) {
          console.log(err);
        });
    }
    signUpForm.on("submit", function (event) {
      event.preventDefault();
      var userData = {
        username: registerName.val().trim(),
        password: registerPassword.val().trim(),
      };
      console.log(userData);
      if (!userData.username || !userData.password) {
        return;
      }
      registerUser(userData.username, userData.password);
      usernameInput.val("");
      passwordInput.val("");
    });
    function registerUser(username, password) {
      $.post("/api/signup", {
        username: username,
        password: password,
      })
        .then(function (data) {
          console.log("Signed up")
        })
        .catch(handleLoginErr);
    }
    function handleLoginErr(err) {
      $("#alert .msg").text(err.responseJSON);
      $("#alert").fadeIn(500);
    }
  });