document.addEventListener("DOMContentLoaded", () => {
  const monthly = document.getElementById("monthly");
  const years = document.getElementById("years");
  const rate = document.getElementById("rate");
  const rateValue = document.getElementById("rate-value");
  const result = document.getElementById("result");
  const investedText = document.getElementById("invested-text");
  const btn = document.getElementById("calculate-btn");

  let chart;

  rate.addEventListener("input", () => {
    rateValue.textContent = rate.value + "%";
  });

  btn.addEventListener("click", calculateSIP);
  document
    .getElementById("calculate-btn")
    .addEventListener("click", calculateSIP);

  // also update % text live
  document.getElementById("rate").addEventListener("input", function () {
    document.getElementById("rate-value").innerText = this.value + "%";
  });
  function calculateSIP() {
    const P = Number(monthly.value);
    const n = Number(years.value) * 12;
    const r = Number(rate.value) / 100 / 12;

    if (!P || !n || !r) return;

    let futureValue = 0;
    let invested = P * n;

    const values = [];
    const investedArr = [];
    const labels = [];

    for (let i = 1; i <= n; i++) {
      futureValue = (futureValue + P) * (1 + r);

      if (i % 12 === 0) {
        values.push(Math.round(futureValue));
        investedArr.push(P * i);
        labels.push("Year " + i / 12);
      }
    }

    result.textContent = "₹" + futureValue.toLocaleString();
    investedText.textContent = "₹" + invested.toLocaleString() + " invested";

    drawChart(labels, values, investedArr);
  }

  function drawChart(labels, values, investedArr) {
    const ctx = document.getElementById("sipChart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Worth of Investment",
            data: values,
            borderColor: "blue",
            fill: false,
          },
          {
            label: "Amount Invested",
            data: investedArr,
            borderColor: "green",
            fill: false,
          },
        ],
      },
    });
  }
});
