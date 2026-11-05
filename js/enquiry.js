// js/enquiry.js
// Validates the enquiry form and shows personalised response.

const form = document.getElementById("enquiry-form");
const responseBox = document.getElementById("enquiry-response");

// Readable names for the values stored 
const warehouseNames = {
  "cape-town": "Cape Town (Montague Gardens)",
  "johannesburg": "Johannesburg (Chloorkop)"
};

const typeLabels = {
  volunteer: "Becoming a volunteer",
  donor: "Donating food or funds",
  partner: "Registering as a beneficiary organisation"
};

// Error helpers 

// Writes a message under a field and marks its group as invalid
function showError(id, message) {
  const errorSpan = document.getElementById(id + "-error");
  errorSpan.textContent = message;
  errorSpan.closest(".form-group").classList.add("has-error");
}

// Removes every error message from form
function clearErrors() {
  form.querySelectorAll(".error-message").forEach(function (span) {
    span.textContent = "";
    span.closest(".form-group").classList.remove("has-error");
  });
}

// Clears one field's error as soon as user edits it
function clearGroup(event) {
  const group = event.target.closest(".form-group");
  if (group) {
    group.classList.remove("has-error");
    group.querySelector(".error-message").textContent = "";
  }
}
form.addEventListener("input", clearGroup);
form.addEventListener("change", clearGroup);

// Validation 

// Checks every field and returns true only if all of them are valid.
function validateForm() {
  clearErrors();
  let isValid = true;

  // Full name
  const fullName = document.getElementById("full-name").value.trim();
  if (fullName.length < 2) {
    showError("full-name", "Please enter your full name (at least 2 characters).");
    isValid = false;
  } else if (!/^[\p{L}][\p{L}' -]*$/u.test(fullName)) {
    showError("full-name", "Names can only contain letters, spaces, hyphens and apostrophes.");
    isValid = false;
  }

  // Email
  const email = document.getElementById("email").value.trim();
  if (email === "") {
    showError("email", "Please enter your email address.");
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("email", "Please enter a valid email address, for example name@example.com.");
    isValid = false;
  }

  // Phone
  const phone = document.getElementById("phone").value.replace(/\s/g, "");
  if (phone === "") {
    showError("phone", "Please enter your phone number.");
    isValid = false;
  } else if (!/^0\d{9}$/.test(phone)) {
    showError("phone", "Enter a 10-digit number starting with 0, for example 0821234567.");
    isValid = false;
  }

  // Enquiry type
  if (document.getElementById("enquiry-type").value === "") {
    showError("enquiry-type", "Please choose what you are interested in.");
    isValid = false;
  }

  // Warehouse
  if (!form.querySelector('input[name="warehouse"]:checked')) {
    showError("warehouse", "Please choose your closest warehouse.");
    isValid = false;
  }

  // Group size
  const groupValue = document.getElementById("group-size").value;
  const groupSize = Number(groupValue);
  if (groupValue === "") {
    showError("group-size", "Please enter a number of people.");
    isValid = false;
  } else if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > 50) {
    showError("group-size", "Please enter a whole number from 1 to 50.");
    isValid = false;
  }

  // Message
  const message = document.getElementById("message").value.trim();
  if (message.length < 10) {
    showError("message", "Please tell us a little more (at least 10 characters).");
    isValid = false;
  } else if (message.length > 500) {
    showError("message", "Please keep your message under 500 characters.");
    isValid = false;
  }

  // Consent checkbox must be ticked
  if (!document.getElementById("consent").checked) {
    showError("consent", "Please tick the box so we can contact you.");
    isValid = false;
  }

  return isValid;
}

//  Response 

// Chooses the reply text based on the enquiry type, warehouse and group size
function getReplyText(data) {
  const warehouse = warehouseNames[data.warehouse];

  if (data.type === "volunteer") {
    if (data.groupSize >= 10) {
      return "Groups of 10 or more are booked as group volunteering sessions. " +
             "A coordinator at our " + warehouse + " warehouse will contact you " +
             "within 3 working days to agree on a date.";
    }
    return "Volunteering is free. Shifts at our " + warehouse + " warehouse are " +
           "confirmed by a coordinator, who will contact you within 3 working days " +
           "with the available times.";
  }

  if (data.type === "donor") {
    return "Thank you for wanting to donate. Our team will contact you within " +
           "3 working days to arrange drop-off or collection at our " + warehouse +
           " warehouse and to explain how your donation will be recorded.";
  }

  // Anything else is a beneficiary organisation registration
  return "Beneficiary organisations are vetted before joining the network. " +
         "We will email the application requirements to " + data.email +
         " within 5 working days. Any handling fees will be explained in the " +
         "application pack, and you would collect food from our " + warehouse + " warehouse.";
}

// Builds the response box on the page
function showResponse(data) {
  responseBox.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = "Thank you, " + data.fullName.split(" ")[0] + "!";

  const reply = document.createElement("p");
  reply.textContent = getReplyText(data);

  // Summary list of what visitor submitted
  const list = document.createElement("ul");
  const items = [
    "Enquiry type: " + typeLabels[data.type],
    "Closest warehouse: " + warehouseNames[data.warehouse],
    "Number of people: " + data.groupSize,
    "We will reply to: " + data.email
  ];
  items.forEach(function (text) {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });

  responseBox.append(heading, reply, list);
  responseBox.hidden = false;
  responseBox.focus();
  responseBox.scrollIntoView({ behavior: "smooth", block: "center" });
}

//Submit

form.addEventListener("submit", function (event) {
  // Stop page from reloading
  event.preventDefault();

  if (!validateForm()) {
    responseBox.hidden = true;
    // Move cursor to first field with problem
    const firstBad = form.querySelector(".has-error input, .has-error select, .has-error textarea");
    if (firstBad) {
      firstBad.focus();
    }
    return;
  }

  // Collect valid answers
  const data = {
    fullName: document.getElementById("full-name").value.trim(),
    email: document.getElementById("email").value.trim(),
    type: document.getElementById("enquiry-type").value,
    warehouse: form.querySelector('input[name="warehouse"]:checked').value,
    groupSize: Number(document.getElementById("group-size").value)
  };

  showResponse(data);
  form.reset();
});