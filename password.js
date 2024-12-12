function togglePasswordVisibility() {
  const password = document.querySelectorAll(".password");
  let passwordType = "";
  
  if(password[0].type === "password") {
  	
  passwordType = "text";
  	} else {
  passwordType = "password";
  	}
  
  for (let i = 0; i < password.length; i++) {
  password[i].type = passwordType;
}
}
