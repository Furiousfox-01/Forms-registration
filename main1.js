function validateField(input, checkClass) {
  if (input) {
    const classList = input.classList;
    return classList.contains(checkClass);
  }
  return false;
}

function sub() {
  const formFields = [
    "name",
    "email",
    "cntnum",
    "userName",
    "password",
    "pan",
    "edu",
    "gen",
  ];

  const isValid = formFields.every((fieldName) => {
    const input = document.getElementById(fieldName);
    const isFieldValid = validateField(input, "is-valid");
    console.log(fieldName, isFieldValid);
    return isFieldValid;
  });

  if (!isValid) {
    alert(
      "Registration failed. Please verify every field is filled and matching its constraints."
    );
    return;
  }

  const fullName = document.getElementById("name");
  const email = document.getElementById("email");
  const contactnum = document.getElementById("cntnum");
  const Dob = document.getElementById("birthday");
  const gen = document.getElementById("gen");
  const genvalue = gen.options[gen.selectedIndex];
  const edu = document.getElementById("edu");
  const eduvalue = edu.options[edu.selectedIndex];
  const pan = document.getElementById("pan");
  const occu = document.getElementById("occu");
  const userName = document.getElementById("userName");
  const password = document.getElementById("password");
  const imageInput = document.getElementById("image");
  const file = imageInput.files[0];
  const size = file ? file.size : null;
  if (!file) {
    alert("Please upload an image.");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const base64Data = event.target.result;
    const formData = {
      fullName: fullName.value,
      email: email.value,
      contactnumber: contactnum.value,
      Dob: Dob.value,
      gender: genvalue.text,
      education: eduvalue.text,
      occupation: occu.value,
      pan: pan.value,
      username: userName.value.toLowerCase(),
      password: password.value,
      imageData: base64Data,
      imageSiz: size,
    };

    saveFormData(formData);
    clearFormFields();
  };
}

function clearFormFields() {
  const form = document.querySelector("form");
  alert("data stored successfully");
  form.reset();
  const inputs = form.querySelectorAll(".form-control");
  inputs.forEach((input) => {
    input.classList.remove("is-valid", "is-invalid");
    const feedbackElement = input.nextElementSibling;
    if (feedbackElement) {
      feedbackElement.textContent = "";
    }
  });
}

function saveFormData(formData) {
  let storedFormData = JSON.parse(localStorage.getItem("formData")) || [];

  if (!Array.isArray(storedFormData)) {
    storedFormData = [];
  }

  storedFormData.push(formData);
  localStorage.setItem("formData", JSON.stringify(storedFormData));
  console.log(storedFormData);
}

//=============================printing values==========================\

function displayFormData(formDataArray) {
  const dataList = document.querySelector(".dataList");
  dataList.innerHTML = "";

  const fragment = document.createDocumentFragment();
  const listItem = document.createElement("li");
  listItem.classList.add("list-group-item");

  for (const formData of formDataArray) {
    const listGroup = document.createElement("ul");
    listGroup.classList.add("list-group");
    const container = document.createElement("br");

    for (const [property, value] of Object.entries(formData)) {
      const currentItem = listItem.cloneNode();

      currentItem.innerHTML = `<strong>${property}: </strong>${
        property === "imageData" ? "" : value
      }`;

      if (property === "imageData") {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        const image = document.createElement("img");
        image.src = value;
        image.alt = "Submitted Image";
        image.style.height = "150px";
        image.style.width = "auto";
        imageContainer.appendChild(image);
        currentItem.appendChild(imageContainer);
      }

      listGroup.appendChild(currentItem);
    }

    fragment.appendChild(listGroup);
    fragment.appendChild(container);
  }

  dataList.appendChild(fragment);
}

//===========================Event listener=================================================

function normalizeSize(sizeStr) {
  console.log(sizeStr);
  let size = Number(sizeStr.substring(0, sizeStr.length - 2));
  if (sizeStr.toLowerCase().endsWith("kb")) {
    return size * 1000;
  } else if (sizeStr.toLowerCase().endsWith("mb")) {
    return size * 1000 * 1000;
  } else {
    return size;
  }
}

function endsWithKbOrMb(text) {
  console.log(text)
  return text.includes("mb") || text.includes("kb");
}

function startsWithLetter(str) {
  return /^[a-zA-Z]/.test(str);
}

function search() {
  var test = "age";
  const searchText = document.getElementById("searchText").value;
  if (startsWithLetter(searchText)) test = "name";
  else if (endsWithKbOrMb(searchText.toLowerCase())) test = "img";
  const storedFormData = JSON.parse(localStorage.getItem("formData")) || [];
  console.log(test);
  let results;
  switch (test) {
    case "img":
      const searchBytes = normalizeSize(searchText);
      results = storedFormData.filter(
        (data) => parseInt(data.imageSiz) <= searchBytes
      );
      console.log(results);
      break;

    case "name":
      results = storedFormData.filter((data) =>
        data.fullName.toLowerCase().includes(searchText.toLowerCase())
      );
      break;

    case "age":
      const ageLimit = parseInt(searchText, 10);
      results = storedFormData.filter((data) => {
        const dob = new Date(data.Dob);
        const now = new Date();
        const diffTime = now - dob; // current milliseconds count from birth
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= ageLimit;
      });
      break;
  }
  displayFormData(results);
}

//=======================  clearing local storage ======================

// function clearLocal() {
//   localStorage.clear();
//   console.log(JSON.parse(localStorage.getItem("formData")));
// }

//======================== setting those validation========

function setValidation(input, isValid, feedbackText) {
  if (isValid) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
  }

  const feedbackElement =
    input.id == "password"
      ? document.getElementById("password-feedback")
      : input.nextElementSibling;
  feedbackElement.classList.remove("invalid-feedback");
  feedbackElement.classList.remove("valid-feedback");

  if (isValid) {
    feedbackElement.classList.add("valid-feedback");
    feedbackElement.textContent = feedbackText;
  } else {
    feedbackElement.classList.add("invalid-feedback");
    feedbackElement.textContent = feedbackText;
  }
}

//======================= oninput ======================
function validateName(input) {
  var mess;

  const isValid = /^[a-zA-Z]+$/.test(String(input.value));
  if (isValid) {
    mess = `Hi!! ${input.value}`;
  } else {
    mess = "Invalid must have only alphabets";
  }
  setValidation(input, isValid, mess);
}

function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const isValid = regex.test(String(email.value).toLowerCase());
  setValidation(email, isValid, isValid ? "Looks good" : "Enter valid Email");
}

function validateNum(num) {
  const regex = /^[6-9]\d{9}$/;
  const isValid = regex.test(String(num.value));
  setValidation(num, isValid, isValid ? "valid" : "Invalid");
}

function validUser(user) {
  const regex = /^[^0-9][^\s]*$/;
  const inputValue = user.value.toLowerCase();
  var isValid = regex.test(inputValue);
  const storedFormData = JSON.parse(localStorage.getItem("formData")) || [];
  const existingData = storedFormData.find(
    (data) => data.username.toLowerCase() === inputValue
  );
  let mess;
  if (existingData) {
    if (user.value) mess = "Username already taken";
    isValid = false;
  } else {
    mess = isValid ? "Valid" : "Invalid, Please check once";
  }
  setValidation(user, isValid, mess);
}

function validPass(pass) {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,15}$/;
  const isValid = regex.test(String(pass.value));
  setValidation(
    pass,
    isValid,
    isValid
      ? "Valid password"
      : "must contain 8-15 char(1-symbol,1-upp,1-low,1-num)"
  );
}

function validPan(pan) {
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const isValid = regex.test(String(pan.value));
  setValidation(pan, isValid, isValid ? "valid" : "Invalid ");
}

function validDOB(dob) {
  var year = new Date(dob.value).getFullYear();
  const isValid = year >= 1950 && year <= 2010;
  setValidation(
    dob,
    isValid,
    isValid ? "Valid" : "The year should be between 1950 to 2010 "
  );
}

function validImage(img) {
  const file = img.files[0];
  const size = file.size;
  const maxSize = 2 * 1024 * 1024;
  if (size > maxSize) {
    alert("Image size exceeds 2MB limit. Please choose a smaller image.");
    img.value = "";
    return;
  }
}
function validOccu(occu){
  const regex = /^[a-zA-Z]+(?:\s+[a-zA-Z]+)?$/;
  const isValid = regex.test(String(occu.value));
    setValidation(
      occu,
      isValid,
      isValid ? "Valid" : "must contain only alphabets"
    );
  
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const passwordIcon = document.querySelector("#password-icon .bi");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordIcon.classList.remove("bi-eye");
    passwordIcon.classList.add("bi-eye-slash");
  } else {
    passwordInput.type = "password";
    passwordIcon.classList.remove("bi-eye-slash");
    passwordIcon.classList.add("bi-eye");
  }
}

function updateEdu(edu) {
  setValidation(edu, true, "done");
}

function updateGen(gen) {
  setValidation(gen, true, "done");
}
