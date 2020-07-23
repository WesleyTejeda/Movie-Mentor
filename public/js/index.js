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
      $.post("/api/login", {
        username: username,
        password: password,
      })
        .then(function (err, status, xhr) {
          if(err.message === "Logged in"){
            window.location.replace("/user")
          }
          else if(err.responseJSON.message){
            $("#errorLogin").attr("style", "color: red;");
            $("#errorLogin").html(err.responseJSON.message);
            return;
          }
        })
        .catch(function (err) {
        });
    }
    signUpForm.on("submit", function (event) {
      event.preventDefault();
      var userData = {
        username: registerName.val().trim(),
        password: registerPassword.val().trim(),
      };
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
        .then(function (data, status, xhr) {
          window.location.replace("/user")
        })
        .catch(function(err) {
          console.log(err);
          $("#errorSignUp").attr("style", "color: red;")
          $("#errorSignUp").html(err.responseJSON.message);
        });
    }
  });