
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

var ok = 0;
const dropdown = document.getElementById("classes");
const selector = document.querySelector("select");
dropdown.addEventListener("click", () => {
  selector.classList.add("active");
  dropdown.innerHTML = "Reset";
  if (ok === 1)
    options.forEach((option) => {
      option.style.backgroundColor = "#FFFFFF";
      option.style.color = "rgb(0,0,0)";
      option.style.pointerEvents = "auto";
    })
  new_list = [];
  ok = 1;
})

const options = document.querySelectorAll("option");
var new_list = [];
console.log(options);
options.forEach((option)=> {
  option.addEventListener("mousedown", () => {
    option.style.backgroundColor = "#1E90FF";
    option.style.color = "#FFFFFF";
    option.style.pointerEvents = "none";
    new_list.push(option.value);
    console.log(new_list);
  })
})

document.querySelector(".submit-btn").addEventListener("click", function() {
  document.getElementById("here").value = new_list;
  console.log(new_list);
})