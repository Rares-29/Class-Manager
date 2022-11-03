function verifyPassword(value)
{
    const pw = value;
    const message = document.getElementById("message");
      if (pw.length < 8) {
        message.style.display = "block";
        message.innerHTML = "Password must have at least 8 characters";
    } else {
        message.style.display = "none";
    }
}

function matchingPassword(value)
{
  var pw = document.getElementById("password").value;
  var pw2 = value;
    message2 = document.getElementById("message2");
 if (pw !== pw2) {
    message2.style.display = "block";
    message2.innerHTML = "Password must match!"
 } else {
    message2.style.display = "none";
 }
}
