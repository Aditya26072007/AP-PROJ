let index = 0;
const track = document.getElementById("track");
const dotsContainer = document.getElementById("dots"); 
const total = track.children.length;

for (let i = 0; i < total; i++) {
  const dot = document.createElement("span");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");


  dot.addEventListener("click", () => {
    index = i; 
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

let autoSlide = setInterval(nextSlide, 3000);

function nextSlide() {
  index = (index + 1) % total;
  track.style.transform = `translateX(-${index * 100}%)`;
  updateDots();
}

track.addEventListener("mouseenter", () => clearInterval(autoSlide));
track.addEventListener("mouseleave", () => {
  autoSlide = setInterval(nextSlide, 3000);
});
