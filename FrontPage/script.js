document.addEventListener("DOMContentLoaded",()=>{
window.updateOptions = updateOptions;
window.addInvestment = addInvestment;
const text=document.getElementsByClassName("invs");
const addbtn=document.querySelector(".addinvs button");
const listinvs=document.querySelector(".container");
const blur = document.querySelector(".blur");
const cross =document.querySelector(".cross");



addbtn.addEventListener("click",()=>{
listinvs.classList.remove("hidden");
blur.classList.remove("hidden");
});
cross.addEventListener("click",()=>{

    listinvs.classList.add("hidden");
    blur.classList.add("hidden");
});
let investors=JSON.parse(localStorage.getItem("investors"))||[];

investors.forEach(investor =>render(investor));



function render(task){
    const li=document.createElement("li");
}



const stocks = ["Reliance", "TCS", "Infosys"];
  const mutualFunds = ["HDFC Midcap", "SBI Bluechip", "Axis Growth"];
  const crypto = ["Bitcoin", "Ethereum", "Solana"];
  const bonds = ["Gov Bond", "Corporate Bond", "Tax-Free Bond"];

  function updateOptions() {
    const type = document.getElementById("type").value;
    const investmentSelect = document.getElementById("investment");

    investmentSelect.innerHTML = "<option>Select option</option>";

    let options = [];

    if (type === "Stock") options = stocks;
    if (type === "Mutual Fund") options = mutualFunds;
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
      type: document.getElementById("type").value,
      name: document.getElementById("investment").value,
      amount: document.getElementById("amount").value,
      date: document.getElementById("date").value
    };

    console.log(data);
    alert("Investment Added!");
  }









});