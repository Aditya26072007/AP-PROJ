let index = 0;  
const track = document.getElementById("track");  
const dots = document.getElementById("dots");  
const total = track.children.length;  

// make dots
for (let i = 0; i < total; i++) {
  let dot = document.createElement("span");
  dot.className = "dot";
  if (i === 0) dot.classList.add("active");
  dot.onclick = () => showSlide(i);
  dots.appendChild(dot);
}

function showSlide(i) {
  index = i;
  track.style.transform = `translateX(-${i * 100}%)`;
  updateDots();
}

function updateDots() {
  document.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.toggle("active", i === index);
  });
}

// auto move every 3 seconds
setInterval(() => {
  index = (index + 1) % total;
  showSlide(index);
}, 3000);
  