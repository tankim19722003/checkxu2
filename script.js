
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  const firebaseConfig = {
    apiKey: "AIzaSyD1qmjKUiJJTrIrzFHBUl1IkVNHoNxpARI",
    authDomain: "accountmanagement-138b7.firebaseapp.com",
    databaseURL: "https://accountmanagement-138b7-default-rtdb.firebaseio.com", // E
    projectId: "accountmanagement-138b7",
    storageBucket: "accountmanagement-138b7.appspot.com",
    messagingSenderId: "340211540580",
    appId: "1:340211540580:web:234fac6df89143c8163571",
    measurementId: "G-DP3RP0P1DG"
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const dbURL = "/TdsAccounts";

  import {getDatabase, ref, set, update, remove, get, child, onValue}
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
  // method to 

  let db = getDatabase();
//--------------------------------END CONNECT DT-------------------------

class TdsAccount {
  constructor (id, accessToken,device, isDeleted=false) {
      this.id = id;
      this.accessToken = accessToken;
      this.isDeleted = isDeleted;
      this.device = device;
  }
}

window.onload = async function() {
  const formatter = new Intl.NumberFormat('de-DE');
  let tdsAccounts = await getAllTdsAccounts();

  let html = '';

  let totalMoney = 0;
  for (let i = 0; i < tdsAccounts.length; i++) {

    let tdsAccount = tdsAccounts[i];
    console.log("Heloo")
    
    if (!tdsAccount.isDeleted) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/profile?token=${tdsAccount.accessToken}`
        );
        const data = await response.json();
        // console.log(data);
       
        let account = data.data;
        let xu = account.xu;
         // get total money
        totalMoney += parseInt(xu);
        const formattedxu = formatter.format(xu);
        html += `  <tr class="account-item" data-account-container="${tdsAccount.id}">
                        <td class="account-item_info">${i+1}</td>
                        <td class="account-item_info">${account.user}</td>
                        <td class="account-item_info">${formattedxu}</td>  
                        <td class="account-item_info">${tdsAccount.device}</td>
                        <td class="account-item_info remove-container" style="padding:0px 8px" data-account-id="${tdsAccount.id}">
                              <i class="fa-solid fa-trash remove-account"  ></i>
                        </td>  
                    </tr>`;
  
      } catch (error) {
        // document.getElementById("result").textContent =
        //   "Có lỗi xảy ra khi gọi API!";
      }
    }

  }

  
  // show totalmoney
  document.getElementById("total-money").textContent = formatter.format(totalMoney);;
  document.getElementById("account-body").insertAdjacentHTML("beforeend", html);


  // add event for deleting icon 
  let removeAccountIcons = document.querySelectorAll(".remove-container");
  for (let removeAccountIcon of removeAccountIcons) {
    removeAccountIcon.onclick = function (e) {
      let currentTarget = e.currentTarget;
      let id = currentTarget.getAttribute("data-account-id");
      deleteAccount(id);
    }
  }

}



async function getAllTdsAccounts() {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, "TdsAccounts"));
    if (snapshot.exists()) {
      let data = snapshot.val();
      console.log(data);
      const accountsArray = Object.values(data); // Convert object to an array of accounts
      return accountsArray;
    } else {
      // console.log("No data available");
      return [];
    }
  } catch (error) {
  //   console.error("Error fetching data:", error);
    throw error;
  }
}




function saveTDSAccount(tdsAccount) {
  set(ref(db, 'TdsAccounts/' + tdsAccount.id), tdsAccount)
  .then(async() => {
      alert("create new device successfully");
      
      // display device 
      window.location.reload();
  })
  .catch((e) => {
      alert("create fail! " + e)
  });  

}

// add account
document.getElementById("save-tds").onclick = async function addTdsAccount() {

  // get data
  let accessToken = document.getElementById("access-token").value;

  if (accessToken == '') {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
  }

  let id = Date.now();

  // get device 
  const device = document.getElementById("device").value;
  if (device == '') {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }


  let tdsAccount = new TdsAccount(id, accessToken, device);
  
  // save acccount
  saveTDSAccount(tdsAccount);
}


async function deleteAccount(itemId) {

  let account = await getAccountById(itemId);

  account.isDeleted = true;

  update(ref(db, dbURL + '/' + itemId), account)
   .then(() => {
      alert("Xóa thành công");
      const element = document.querySelector(`[data-account-container="${itemId}"]`);
      element.remove();
   })
   .catch((error) => {
     alert("Error updating data: ", error);
   });
}

async function getAccountById(id) {
  
  let tdsAccounts = await getAllTdsAccounts();

  for (let i = 0; i < tdsAccounts.length; i++) {
    let tdsAccount = tdsAccounts[i];
    if (tdsAccount.id == id) {
      return tdsAccount;
    }
  }

  return null;
}

console.log(getAccountById("1731376269614"));
