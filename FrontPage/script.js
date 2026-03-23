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
  const mutualFunds = ["HDFC Midcap", "SBI Bluechip", "Axis Growth"];
  const crypto = ["Bitcoin", "Ethereum", "Solana"];
  const bonds = ["Gov Bond", "Corporate Bond", "Tax-Free Bond"];

  function updateOptions() {
    const type = document.getElementById("type").value;
    const investmentSelect = document.getElementById("investment");

    investmentSelect.innerHTML = "<option>Select option</option>";

    let options = [];
console.log("changed"); 
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
  investors.push(data);
  savetolocal();
  renderTask(data);
  document.getElementById("type").value="";
  document.getElementById("investment").value="Select option";
  document.getElementById("amount").value="";
  document.getElementById("date").value="";
  console.log(data);
  listinvs.classList.add("hidden");
    blur.classList.add("hidden");
    alert("Investment Added!");

}
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
    invsText.textContent = `${data.name}`;

    console.log("Selected:", selectedInvestment); // for testing
  });
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); 
    investors = investors.filter((t) => t.id !== data.id);
    li.remove();
    savetolocal();
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



const swaps=document.querySelectorAll(".invs-card ol li");

// swaps.forEach((swap)=>{
// swaps.addEventListener("click",()=>{
// swap.classList.add("invs");
// swap.classList.remove("invs-card")
// });
// });
});