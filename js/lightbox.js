// js/lightbox.js
// Opens gallery photos in a larger pop-up with next, previous and close.

const items = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");

// Remembers which photo is showing
let currentIndex = 0;

// Puts the photo with the given number into the pop-up
function showImage(index) {
  // Loop round: after the last photo go to the first, and the reverse
  if (index < 0) {
    index = items.length - 1;
  } else if (index >= items.length) {
    index = 0;
  }
  currentIndex = index;

  const thumbnail = items[index].querySelector("img");
  lightboxImg.src = thumbnail.src;
  lightboxImg.alt = thumbnail.alt;
  lightboxCaption.textContent = items[index].dataset.caption;
}

// Clicking a thumbnail opens the pop-up on that photo
items.forEach(function (item, index) {
  item.addEventListener("click", function () {
    showImage(index);
    lightbox.showModal();
  });
});

// Button controls
document.getElementById("lightbox-close").addEventListener("click", function () {
  lightbox.close();
});
document.getElementById("lightbox-prev").addEventListener("click", function () {
  showImage(currentIndex - 1);
});
document.getElementById("lightbox-next").addEventListener("click", function () {
  showImage(currentIndex + 1);
});

// Clicking the dark area outside the photo closes the pop-up
lightbox.addEventListener("click", function (event) {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

// Arrow keys move between photos while the pop-up is open (Escape closes it by default)
document.addEventListener("keydown", function (event) {
  if (!lightbox.open) {
    return;
  }
  if (event.key === "ArrowLeft") {
    showImage(currentIndex - 1);
  } else if (event.key === "ArrowRight") {
    showImage(currentIndex + 1);
  }
});