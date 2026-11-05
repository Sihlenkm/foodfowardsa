// js/contact.js
// Validates the contact form, then builds email the visitor can send.

// The address that receives the email. Change this to your own address.
const RECIPIENT = "sihlengiwenm@gmail,com";

const contactForm = document.getElementById("contact-form");
const contactResponse = document.getElementById("contact-response");

// Error helpers 

function showContactError(id, message) {
  const span = document.getElementById(id + "-error");
  span.textContent = message;
  span.closest(".form-group").classList.add("has-error");
}

function clearContactErrors() {
  contactForm.querySelectorAll(".error-message").forEach(function (span) {
    span.textContent = "";
    span.closest(".form-group").classList.remove("has-error");
  });
}

// Clear a field's error as soon as visitor edits it
function clearContactGroup(event) {
  const group = event.target.closest(".form-group");
  if (group) {
    group.classList.remove("has-error");
    group.querySelector(".error-message").textContent = "";
  }
}
contactForm.addEventListener("input", clearContactGroup);
contactForm.addEventListener("change", clearContactGroup);

// Validation 

function validateContactForm() {
  clearContactErrors();
  let isValid = true;

  // Name
  const name = document.getElementById("c-full-name").value.trim();
  if (name.length < 2) {
    showContactError("c-full-name", "Please enter your full name (at least 2 characters).");
    isValid = false;
  } else if (!/^[\p{L}][\p{L}' -]*$/u.test(name)) {
    showContactError("c-full-name", "Names can only contain letters, spaces, hyphens and apostrophes.");
    isValid = false;
  }

  // Email
  const email = document.getElementById("c-email").value.trim();
  if (email === "") {
    showContactError("c-email", "Please enter your email address.");
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showContactError("c-email", "Please enter a valid email address, for example name@example.com.");
    isValid = false;
  }

  // Phone is optional
  const phone = document.getElementById("c-phone").value.replace(/\s/g, "");
  if (phone !== "" && !/^0\d{9}$/.test(phone)) {
    showContactError("c-phone", "Enter a 10-digit number starting with 0, or leave this blank.");
    isValid = false;
  }

  // Choosing message type
  if (document.getElementById("message-type").value === "") {
    showContactError("message-type", "Please choose the type of message.");
    isValid = false;
  }

  // Message
  const message = document.getElementById("c-message").value.trim();
  if (message.length < 10) {
    showContactError("c-message", "Please write a message of at least 10 characters.");
    isValid = false;
  } else if (message.length > 500) {
    showContactError("c-message", "Please keep your message under 500 characters.");
    isValid = false;
  }

  return isValid;
}

// Building the email 

function buildEmail(data) {
  const subject = data.type + " from " + data.name;

  // \r\n gives the line breaks that email apps expect
  const body =
    "Name: " + data.name + "\r\n" +
    "Email: " + data.email + "\r\n" +
    "Phone: " + (data.phone === "" ? "Not provided" : data.phone) + "\r\n" +
    "Message type: " + data.type + "\r\n\r\n" +
    data.message;

  // encodeURIComponent makes spaces and symbols safe to be put in a link
  const link = "mailto:" + RECIPIENT +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body);

  return { subject: subject, body: body, link: link };
}

//  Showing the result 

function showContactResponse(email) {
  contactResponse.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = "Your email is ready to send";

  const info = document.createElement("p");
  info.textContent = "Your email app should open with the message below, addressed to " +
    RECIPIENT + ". Press Send in your email app to deliver it. " +
    "If nothing opened, use the button below.";

  // Preview of what will be emailed
  const preview = document.createElement("pre");
  preview.className = "email-preview";
  preview.textContent = "To: " + RECIPIENT + "\nSubject: " + email.subject + "\n\n" +
    email.body.replace(/\r\n/g, "\n");

  // Backup link in case the email app didn't open on its own
  const sendLink = document.createElement("a");
  sendLink.href = email.link;
  sendLink.className = "btn-primary";
  sendLink.textContent = "Open in my email app";

  contactResponse.append(heading, info, preview, sendLink);
  contactResponse.hidden = false;
  contactResponse.focus();
  contactResponse.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Submit 

contactForm.addEventListener("submit", function (event) {
  // Stop page from reloading
  event.preventDefault();

  if (!validateContactForm()) {
    contactResponse.hidden = true;
    const firstBad = contactForm.querySelector(".has-error input, .has-error select, .has-error textarea");
    if (firstBad) {
      firstBad.focus();
    }
    return;
  }

  // Collect valid answers
  const data = {
    name: document.getElementById("c-full-name").value.trim(),
    email: document.getElementById("c-email").value.trim(),
    phone: document.getElementById("c-phone").value.trim(),
    type: document.getElementById("message-type").value,
    message: document.getElementById("c-message").value.trim()
  };

  const email = buildEmail(data);
  showContactResponse(email);

  // Open the visitor's email app with message filled in
  window.location.href = email.link;

  contactForm.reset();
});