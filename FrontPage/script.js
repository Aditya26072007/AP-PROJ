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
  const symbol = symbolMap[data.name];
const price = prices[symbol];

if(price){
data.units = Number(data.amount) / price;
}else{
data.units = 0;
}
  investors.push(data);
  savetolocal();
  renderTask(data);
  calculateTotal();
  calculatetoatldisplay();
  document.getElementById("type").value="";
  document.getElementById("investment").value="Select option";
  document.getElementById("amount").value="";
  document.getElementById("date").value="";
  console.log(data);
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
    calculateTotal();
    calculatetoatldisplay();
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
calculateTotal();
calculatetoatldisplay();


const swaps=document.querySelectorAll(".invs-card ol li");

// swaps.forEach((swap)=>{
// swaps.addEventListener("click",()=>{
// swap.classList.add("invs");
// swap.classList.remove("invs-card")
// });
// });


function calculateTotal() {

const totalInvested = investors.reduce((sum, item) => sum + Number(item.amount), 0);

return totalInvested;
}

function calculatetoatldisplay(){
  console.log(calculateTotal());
}

const originalprice=calculateTotal();
// console.log(originalprice);


const symbolMap = {

  // Stocks
  "Reliance": "RELIANCE.NS",
  "TCS": "TCS.NS",
  "Infosys": "INFY.NS",

  // Mutual Funds
  // "HDFC Midcap": "HDFCMIDCAP.NS",
  // "SBI Bluechip": "SBIBLUECHIP.NS",
  // "Axis Growth": "AXISGROWTH.NS",

  // Crypto
  "Bitcoin": "BTC-USD",
  "Ethereum": "ETH-USD",
  "Solana": "SOL-USD",

  // Bonds (approx ETFs because bonds themselves don't trade like stocks)
  "Gov Bond": "IGLB",
  "Corporate Bond": "LQD",
  "Tax-Free Bond": "MUB"
};


async function fetchAllPrices(){

const symbols = Object.values(symbolMap).join(",");

const api =
`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

const proxy =
"https://api.allorigins.win/get?url=" + encodeURIComponent(api);

const res = await fetch(proxy);
const data = await res.json();

// proxy returns JSON string inside "contents"
const parsed = JSON.parse(data.contents);

return parsed.quoteResponse.result || [];

}
async function get10YearHistory(symbol){

const api =
`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=10y&interval=1mo`;

const proxy =
"https://api.allorigins.win/raw?url=" + encodeURIComponent(api);

const res = await fetch(proxy);
const data = await res.json();

const prices =
data.chart.result[0].indicators.quote[0].close;

const timestamps =
data.chart.result[0].timestamp;

return {prices, timestamps};

}
function convertDates(timestamps){

return timestamps.map(t =>
new Date(t * 1000).toLocaleDateString()
);

}

const prices = {};

async function loadPrices(){

try{

const result = await fetchAllPrices();

console.log("API result:", result);

result.forEach(asset=>{
prices[asset.symbol] = asset.regularMarketPrice;
});

}catch(err){

console.log("Error in loadPrices:", err);

}
}


async function init(){
console.log("init started");
await loadPrices();

const currentValue = newprice();

console.log("Current Portfolio Value:", currentValue);

}

init();
const currentpricemap={};
function newprice(){

let total = 0;

investors.forEach(inv=>{

const symbol = symbolMap[inv.name];
const price = prices[symbol];

if(price){

const units = inv.units ? inv.units : inv.amount / price;

const value = units * price;

if(!currentpricemap[inv.name]){
currentpricemap[inv.name] = 0;
}

currentpricemap[inv.name] += value;

total += value;

}

});

return total;

}


});