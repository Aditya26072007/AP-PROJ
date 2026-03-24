let index = 0;
const track = document.getElementById("track");
const dotsContainer = document.getElementById("dots"); // fixed selector
const total = track.children.length;

// create dots
for (let i = 0; i < total; i++) {
  const dot = document.createElement("span");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");

  // add click event to each dot
  dot.addEventListener("click", () => {
    index = i; // set index to clicked dot
    track.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  });

  dotsContainer.appendChild(dot);
}

function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach(d => d.classList.remove("active"));
  dots[index].classList.add("active");
}

// AUTO SLIDE
let autoSlide = setInterval(nextSlide, 3000);

function nextSlide() {
  index = (index + 1) % total;
  track.style.transform = `translateX(-${index * 100}%)`;
  updateDots();
}

// Pause on hover
track.addEventListener("mouseenter", () => clearInterval(autoSlide));
track.addEventListener("mouseleave", () => {
  autoSlide = setInterval(nextSlide, 3000);
});
