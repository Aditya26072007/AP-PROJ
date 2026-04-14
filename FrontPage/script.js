document.addEventListener("DOMContentLoaded",()=>{
window.updateOptions = updateOptions;
window.addInvestment = addInvestment;
const text=document.getElementsByClassName("invs");
const dropdown=document.querySelector("#dropdown")
const addbtn=document.querySelector(".addinvs button");
const listinvs=document.querySelector(".container");
const blur = document.querySelector(".blur");
const cross =document.querySelector(".cross");
const invsCard = document.querySelector(".invs-card");
  const storer=document.querySelector(".invs-card ol");
let selectedInvestment = null;



console.log(storer);
addbtn.addEventListener("click",()=>{
listinvs.classList.remove("hidden");
blur.classList.remove("hidden");
});
cross.addEventListener("click",()=>{

    listinvs.classList.add("hidden");
    blur.classList.add("hidden");
});
let investors=JSON.parse(localStorage.getItem("investors"))||[];

  const arrow1=document.querySelector(".amount .arr");
  const dayscard=document.querySelector(".days-card");
  arrow1.addEventListener("click",()=>{
    dayscard.classList.toggle("hidden");
  })
  
  const arrows = document.querySelectorAll(".arr i");

arrows.forEach(arrow => {
  arrow.addEventListener("click", (e) => {
     // prevents unwanted bubbling
    arrow.classList.toggle("rotate");
  });
});

// document.getElementById("addBtn").addEventListener("click", addInvestment);


const stocks = ["Reliance", "TCS", "Infosys"];
  // const mutualFunds = ["HDFC Midcap", "SBI Bluechip", "Axis Growth"];
  const crypto = ["Bitcoin", "Ethereum", "Solana"];
  const bonds = ["Gov Bond", "Corporate Bond", "Tax-Free Bond"];

  function updateOptions() {
    const type = document.getElementById("type").value;
    const investmentSelect = document.getElementById("investment");

    investmentSelect.innerHTML = "<option>Select option</option>";

    let options = [];
console.log("changed"); 
    if (type === "Stock") options = stocks;
    // if (type === "Mutual Fund") options = mutualFunds;
    if (type === "Crypto") options = crypto;
    if (type === "Bond") options = bonds;

    options.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      investmentSelect.appendChild(opt);
    });
  }

  const fixedPrices = {
  "Reliance": 2800,
  "TCS": 3900,
  "Infosys": 1500,
  "Bitcoin": 5000000,
  "Ethereum": 250000,
  "Solana": 12000,
  "Gov Bond": 100,
  "Corporate Bond": 120,
  "Tax-Free Bond": 110
};



  function addInvestment() {
    const data = {
      id:Date.now(),
      type: document.getElementById("type").value,
      name: document.getElementById("investment").value,
      amount: document.getElementById("amount").value,
      date: document.getElementById("date").value
    };



    if(data.type === "" ||
  data.name === "" ||
  data.name === "Select option" ||
  data.amount.trim() === "" ||
  data.date.trim() === ""){
      alert("Please Enter All The Field");
      return;
    }
    if (isNaN(data.amount) || data.amount <= 0) {
  alert("Enter valid amount");
  return;
}

else{
const buyPrice = fixedPrices[data.name];

  data.buyPrice = buyPrice;

  data.units = buyPrice
    ? Number((Number(data.amount) / buyPrice).toFixed(6))
    : 0;

  investors.push(data);
  savetolocal();
  renderTask(data);

  calculatetoatldisplay(); // 🔥 important

  document.getElementById("type").value="";
  document.getElementById("investment").value="Select option";
  document.getElementById("amount").value="";
  document.getElementById("date").value="";

  listinvs.classList.add("hidden");
  blur.classList.add("hidden");

  alert("Investment Added!");

}



//php part


fetch("http://localhost:8080/portfolioproject/AP-Project%20-%20Copy/FrontPagecopy/save.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(res => console.log("Saved:", res))
.catch(err => console.log("Error:", err));

  }


  function savetolocal() {
    localStorage.setItem("investors", JSON.stringify(investors));
  }


const invsText = document.querySelector(".invs");

  function renderTask(data){
  const li = document.createElement("li");

  li.innerHTML = `${data.name} - ₹${data.amount} 
  <button class="dlt-btn">Remove</button>`;

  const btn = li.querySelector(".dlt-btn");
  li.addEventListener("click", () => {
    //  store full object
    selectedInvestment = data;

    //  update UI
    invsText.textContent = `${data.name}- ₹${data.amount}`;

    console.log("Selected:", selectedInvestment); // for testing
  });
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); 
    investors = investors.filter((t) => t.id !== data.id);
    li.remove();
    savetolocal();
    calculatetoatldisplay();
    calculateTotal();
  });

  storer.appendChild(li);
}


dropdown.addEventListener("click",()=>{
  invsCard.classList.toggle("hidden");
});




// document.addEventListener("click", (e) => {
//   if (!e.target.closest(".main-section")) {
//     invsCard.classList.add("hidden");
//     dropdown.classList.remove("rotate");
//   }
// });
investors.forEach(investor => renderTask(investor));







function calculateReturns() {
  let totalInvestment = 0;
  let totalCurrent = 0;

  investors.forEach(inv => {
    const currentPrice = getCurrentPrice(inv);

    if (currentPrice && inv.units) {
      const currentValue = inv.units * currentPrice;

      totalInvestment += Number(inv.amount);
      totalCurrent += currentValue;
    }
  });

  const profit = totalCurrent - totalInvestment;

  const percent =
    totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;

  return {
    totalInvestment,
    totalCurrent,
    profit,
    percent
  };
}


function calculatetoatldisplay() {
  const daytext=document.querySelector("#day-wise-return");
  const result = calculateReturns();

  document.getElementById("currentvalue").textContent =
    "Current Value: ₹" + result.totalCurrent.toFixed(2);

  document.getElementById("lifetime").textContent =
    "Return: " + result.percent.toFixed(2) + "%";


    daytext.textContent = `Lifetime`;
}



function getCurrentPrice(inv) {
  const basePrice = fixedPrices[inv.name];

  if (!basePrice) return 0;

  const investDate = new Date(inv.date);
  const today = new Date();

  const days =
    Math.floor((today - investDate) / (1000 * 60 * 60 * 24));

  // 🔥 assume 0.05% daily growth
  const growthRate = 0.0005;

  const currentPrice = basePrice * Math.pow(1 + growthRate, days);

  return currentPrice;
}
// calculateTotal();
calculatetoatldisplay();

function getPriceAtDate(inv, targetDate) {
  const basePrice = fixedPrices[inv.name];
  if (!basePrice) return 0;

  const investDate = new Date(inv.date);

  // if target date is before investment → no value
  if (targetDate < investDate) return 0;

  const days =
    Math.floor((targetDate - investDate) / (1000 * 60 * 60 * 24));

  const growthRate = 0.0005;

  return basePrice * Math.pow(1 + growthRate, days);
}

function portfolioAtDate(targetDate) {
  let totalInvestment = 0;
  let totalValue = 0;

  investors.forEach(inv => {
    const investDate = new Date(inv.date);

    if (targetDate >= investDate) {
      const price = getPriceAtDate(inv, targetDate);
      const value = inv.units * price;

      totalInvestment += Number(inv.amount);
      totalValue += value;
    }
  });

  const profit = totalValue - totalInvestment;
  const percent =
    totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;

  return { totalValue, percent };
}


function calculateTimeViews() {
  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const oneMonth = new Date();
  oneMonth.setMonth(today.getMonth() - 1);

  const threeMonths = new Date();
  threeMonths.setMonth(today.getMonth() - 3);

  return {
    today: portfolioAtDate(today),
    yesterday: portfolioAtDate(yesterday),
    oneMonth: portfolioAtDate(oneMonth),
    threeMonths: portfolioAtDate(threeMonths)
  };
}




function updateTimeDisplay() {
 

  // document.getElementById("day-wise-return").innerHTML = `
  //   Today: ₹${data.today.totalValue.toFixed(0)} (${data.today.percent.toFixed(2)}%)<br>
  //   Yesterday: ₹${data.yesterday.totalValue.toFixed(0)} (${data.yesterday.percent.toFixed(2)}%)<br>
  //   1 Month: ₹${data.oneMonth.totalValue.toFixed(0)} (${data.oneMonth.percent.toFixed(2)}%)<br>
  //   3 Months: ₹${data.threeMonths.totalValue.toFixed(0)} (${data.threeMonths.percent.toFixed(2)}%)
  // `;

  const li=document.querySelectorAll(".days-card li");
  const daytext=document.querySelector("#day-wise-return");

  const today=document.getElementById("today-return");
  const yesterday=document.getElementById("yesterday-return");
  const oneMonth=document.getElementById("one-month-return");
  const threeMonths=document.getElementById("three-months-return");
  const lifetime=document.getElementById("lifetime-return");
  li.forEach(item=>{
    item.addEventListener("click",(e)=>{


       const data = calculateTimeViews();
      console.log(e.target.textContent);
    if(item===today)  {
      document.getElementById("currentvalue").textContent =
    "Current Value: ₹" + data.today.totalValue.toFixed(0);

  document.getElementById("lifetime").textContent =
    "Return: " + data.today.percent.toFixed(2) + "%";

    daytext.textContent = `Today`;
    }



    if(item===yesterday)  {
      document.getElementById("currentvalue").textContent =
    "Current Value: ₹" + data.yesterday.totalValue.toFixed(0);

  document.getElementById("lifetime").textContent =
    "Return: " + data.yesterday.percent.toFixed(2) + "%";

    daytext.textContent = `Yesterday`;
    }



    if(item===oneMonth)  {
      document.getElementById("currentvalue").textContent =
    "Current Value: ₹" + data.oneMonth.totalValue.toFixed(0);

  document.getElementById("lifetime").textContent =
    "Return: " + data.oneMonth.percent.toFixed(2) + "%";

    daytext.textContent = `1 Month`;
    }


    if(item===threeMonths)  {
      document.getElementById("currentvalue").textContent =
    "Current Value: ₹" + data.threeMonths.totalValue.toFixed(0);

  document.getElementById("lifetime").textContent =
    "Return: " + data.threeMonths.percent.toFixed(2) + "%";

    daytext.textContent = `3 Months`;
    }

    if(item===lifetime)  {
      calculatetoatldisplay();
      
    }
    

  })
  })
}
updateTimeDisplay();


// const swaps=document.querySelectorAll(".invs-card ol li");

// swaps.forEach((swap)=>{
// swaps.addEventListener("click",()=>{
// swap.classList.add("invs");
// swap.classList.remove("invs-card")
// });
// });


// function calculateTotal() {

// const totalInvested = investors.reduce((sum, item) => sum + Number(item.amount), 0);

// return totalInvested;
// }

// function calculatetoatldisplay(){
//   console.log(calculateTotal());
// }

// const originalprice=calculateTotal();
// console.log(originalprice);


// const symbolMap = {

//   // Stocks
//   "Reliance": "RELIANCE.NS",
//   "TCS": "TCS.NS",
//   "Infosys": "INFY.NS",

//   // Mutual Funds
//   // "HDFC Midcap": "HDFCMIDCAP.NS",
//   // "SBI Bluechip": "SBIBLUECHIP.NS",
//   // "Axis Growth": "AXISGROWTH.NS",

//   // Crypto
//   "Bitcoin": "BTC-USD",
//   "Ethereum": "ETH-USD",
//   "Solana": "SOL-USD",

//   // Bonds (approx ETFs because bonds themselves don't trade like stocks)
//   "Gov Bond": "IGLB",
//   "Corporate Bond": "LQD",
//   "Tax-Free Bond": "MUB"
// };


// async function fetchAllPrices(){

// const symbols = Object.values(symbolMap).join(",");

// const api =
// `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

// const proxy =
// "https://api.allorigins.win/get?url=" + encodeURIComponent(api);

// const res = await fetch(proxy);
// const data = await res.json();

// // proxy returns JSON string inside "contents"
// const parsed = JSON.parse(data.contents);

// return parsed.quoteResponse.result || [];

// }
// async function get10YearHistory(symbol){

// const api =
// `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=10y&interval=1mo`;

// const proxy =
// "https://api.allorigins.win/raw?url=" + encodeURIComponent(api);

// const res = await fetch(proxy);
// const data = await res.json();

// const prices =
// data.chart.result[0].indicators.quote[0].close;

// const timestamps =
// data.chart.result[0].timestamp;

// return {prices, timestamps};

// }
// function convertDates(timestamps){

// return timestamps.map(t =>
// new Date(t * 1000).toLocaleDateString()
// );

// }

// const prices = {};

// async function loadPrices(){

// try{

// const result = await fetchAllPrices();

// console.log("API result:", result);

// result.forEach(asset=>{
// prices[asset.symbol] = asset.regularMarketPrice;
// });

// }catch(err){

// console.log("Error in loadPrices:", err);

// }
// }


// async function init(){
// console.log("init started");
// await loadPrices();

// const currentValue = newprice();

// console.log("Current Portfolio Value:", currentValue);

// }

// init();
// const currentpricemap={};
// function newprice(){

// let total = 0;

// investors.forEach(inv=>{

// const symbol = symbolMap[inv.name];
// const price = prices[symbol];

// if(price){

// const units = inv.units ? inv.units : inv.amount / price;

// const value = units * price;

// if(!currentpricemap[inv.name]){
// currentpricemap[inv.name] = 0;
// }

// currentpricemap[inv.name] += value;

// total += value;

// }

// });

// return total;

// }


});