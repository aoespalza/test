const images = {
  "Nueva":[
    "img/New1.jpeg",
    "img/New2.jpeg",
    "img/New3.jpeg"
  ],
  "Vestidos":[
    "img/Dress1.jpeg",
    "img/Dress2.jpeg",
    "img/Dress1.jpeg"
  ],
  "Tops":[
    "img/Tops1.jpeg",
    "img/Tops2.jpeg",
    "img/Tops3.jpeg"
  ],
  "Sets":[
    "img/Sets1.jpeg",
    "img/Sets2.jpeg",
    "img/Sets3.jpeg"
  ],
  "Sale":[
    "img/Sale1.jpeg",
    "img/Sale2.jpeg",
    "img/Sale3.jpeg"
  ]
};

let cart = [];

document.addEventListener("DOMContentLoaded", () => {

  const categorias=["Nueva","Vestidos","Tops","Sets","Sale"];
  const cont=document.getElementById("contenido");
  const sizes=["S","M","L"];

  categorias.forEach(cat=>{
    let html = `<section id="${cat}">
      <h2>${cat.toUpperCase()}</h2>
      <div class="products">`;

    for(let i=1;i<=3;i++){
      let price=90000+i*20000;
      let oldPrice=price+30000;
      let size=sizes[i%3];
      let img = images[cat]?.[i-1] || images["Vestidos"][0];
      let hasDiscount=i%2==0;

      let stock=Math.floor(Math.random()*5)+1;
      let viewers=Math.floor(Math.random()*10)+5;
      let countdown=Math.floor(Math.random()*600)+300;

      html += `<div class="card" data-size="${size}" data-price="${price}">
        ${hasDiscount?`<span class="badge">-${Math.round((1-price/oldPrice)*100)}%</span>`:""}
        <img src="${img}" onclick="openQuickView('${cat}',${price},'${img}')">
        <h3>${cat}</h3>

        <div class="price">
          ${hasDiscount?`<span class="old">$${oldPrice.toLocaleString()}</span>`:""}
          <span class="current">$${price.toLocaleString()}</span>
        </div>

        <div class="urgency-box">
          🔥 ${stock} unidades<br>
          👀 ${viewers} viendo<br>
          <span class="timer" data-time="${countdown}"></span>
        </div>

        <button onclick="addToCart('${cat}',${price},'${img}')">Agregar</button>
      </div>`;
    }

    html += `</div></section>`;
    cont.innerHTML += html;
  });

  startCountdowns();
  document.getElementById("openCartBtn").onclick=openCart;
});


// ==========================
// CARRITO
// ==========================
function addToCart(name,price,img){
  cart.push({name,price,img});
  updateCart();
}

function updateCart(){
  const cartItems=document.getElementById("cartItems");
  const cartTotal=document.getElementById("cartTotal");
  const cartCount=document.getElementById("cartCount");

  cartItems.innerHTML="";
  let total=0;

  cart.forEach((item,i)=>{
    total+=item.price;

    cartItems.innerHTML+=`
    <div class="cart-item">
      <img src="${item.img}">
      <div class="cart-item-info">
        <p>${item.name}</p>
        <small>$${item.price.toLocaleString()}</small>
        <br>
        <button onclick="removeItem(${i})">Eliminar</button>
      </div>
    </div>`;
  });

  cartTotal.innerText="Total: $"+total.toLocaleString();
  cartCount.innerText=cart.length;
}

function removeItem(i){
  cart.splice(i,1);
  updateCart();
}

function openCart(){
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("overlay").style.display="block";
}

function closeAll(){
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("overlay").style.display="none";
}


// ==========================
// CHECKOUT UX PRO
// ==========================
function openCheckout(){
  const checkout = document.getElementById("checkout");

  let total = cart.reduce((sum,i)=>sum+i.price,0);

  checkout.innerHTML = `
    <div onclick="event.stopPropagation()">

      <span onclick="closeCheckout()" style="
        position:absolute;
        top:15px;
        right:20px;
        cursor:pointer;
        font-size:18px;
      ">✕</span>

      <div class="checkout-title">Finalizar compra</div>
      <div class="checkout-total">Total: $${total.toLocaleString()}</div>

      <input placeholder="Nombre" id="checkoutName">
      <input placeholder="Correo" id="checkoutEmail">

      <div class="payment-methods">
        <label class="payment-option active">
          <input type="radio" name="payment" value="card" checked>
          💳 Tarjeta
        </label>

        <label class="payment-option">
          <input type="radio" name="payment" value="Wompi">
          🅿️ Wompi
        </label>

        <label class="payment-option">
          <input type="radio" name="payment" value="cash">
          💵 Contra entrega
        </label>
      </div>

      <button onclick="processPayment()">Pagar ahora</button>
    </div>
  `;

  checkout.style.display="flex";

  setTimeout(()=>{
    checkout.classList.add("active");
  },10);

  // cerrar al hacer click fuera
  checkout.onclick = closeCheckout;

  // selección visual
  document.querySelectorAll(".payment-option").forEach(opt=>{
    opt.addEventListener("click", ()=>{
      document.querySelectorAll(".payment-option").forEach(o=>o.classList.remove("active"));
      opt.classList.add("active");
      opt.querySelector("input").checked = true;
    });
  });
}

function closeCheckout(){
  const checkout = document.getElementById("checkout");

  checkout.classList.remove("active");

  setTimeout(()=>{
    checkout.style.display="none";
  },300);
}

function processPayment(){
  if(cart.length===0){
    alert("Carrito vacío");
    return;
  }

  const method = document.querySelector('input[name="payment"]:checked').value;

  let total = cart.reduce((sum,i)=>sum+i.price,0);

  let metodoTexto = {
    card: "Tarjeta 💳",
    Wompi: "Wompi 🅿️",
    cash: "Contra entrega 💵"
  };

  alert(`Pago simulado exitoso\nMétodo: ${metodoTexto[method]}\nTotal: $${total.toLocaleString()}`);

  cart = [];
  updateCart();
  closeAll();
  closeCheckout();
}


// ESC para cerrar
document.addEventListener("keydown", (e)=>{
  if(e.key === "Escape"){
    closeCheckout();
  }
});


// ==========================
// RESTO
// ==========================
function startCountdowns(){
  document.querySelectorAll(".timer").forEach(el=>{
    let t=parseInt(el.dataset.time);

    const interval=setInterval(()=>{
      let m=Math.floor(t/60);
      let s=t%60;

      el.innerText=`⏳ ${m}:${s<10?"0":""}${s}`;

      t--;

      if(t<=0){
        el.innerText="⚡ Últimas unidades";
        clearInterval(interval);
      }
    },1000);
  });
}

function openQuickView(name,price,img){
  const modal=document.getElementById("quickView");
  document.getElementById("qv-name").innerText=name;
  document.getElementById("qv-price").innerText="$"+price.toLocaleString();
  document.getElementById("qv-img").src=img;
  modal.style.display="flex";
}

function closeQuickView(){
  document.getElementById("quickView").style.display="none";
}

window.addEventListener("load", ()=>{
  if(!localStorage.getItem("leadCaptured")){
    setTimeout(()=>{
      const popup=document.getElementById("leadPopup");
      if(popup){
        popup.style.display="flex";
      }
    },2000);
  }
});

function saveLead(e){
  e.preventDefault();
  const email=document.getElementById("leadEmail").value;

  if(!email){
    alert("Ingresa un correo válido");
    return;
  }

  localStorage.setItem("leadCaptured",email);

  document.querySelector(".lead-box").innerHTML = `
    <h2>🎉 Bienvenida</h2>
    <p>Código: <strong>AURE10</strong></p>
  `;
}

function closePopup(){
  document.getElementById("leadPopup").style.display="none";
}

