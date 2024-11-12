
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

  import {getDatabase, ref, set, update, remove, get, child, onValue}
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
  // method to 

  let db = getDatabase();
//--------------------------------END CONNECT DT-------------------------

// class in need 

class TdsAccount {
    constructor (id, accessToken, isDeleted=false) {
        this.id = id;
        this.accessToken = accessToken;
        this.isDeleted = isDeleted
    }
}

//------------


window.onload = async function() {

    // load account 
    let tdsAccounts = await getAllTdsAccounts();
    
    let html = '';
   
    

    let api = "https://traodoisub.com/api/?fields=profile&access_token=TDS9JiNyVmdlNnI6IiclZXZzJCLiEDO5EDauFGaulWbiojIyV2c1Jye";

    let response = await fetch(api);
    console.log(response)

    // fetch("https://traodoisub.com/api/?fields=profile&access_token=TDS9JiNyVmdlNnI6IiclZXZzJCLiEDO5EDauFGaulWbiojIyV2c1Jye", requestOptions)
    //   .then(response => response.text())
    //   .then(result => console.log(result))
    //   .catch(error => console.log('error', error));
    // for (let tdsAccount of tdsAccounts) {
    //     let api = "https://traodoisub.com/api/?fields=profile&access_token=" + tdsAccount.accessToken;
    //     var urlencoded = new URLSearchParams();

    //     let response = await fetch(api,{
    //       method: 'GET',
    //       body: urlencoded,
    //       redirect: 'follow'
    //     })

    //     if (response.ok) {

    //         let tdsAccountInTdsServer = await response.json();
            
    //         const formattedNumber = tdsAccountInTdsServer.xu.toLocaleString('de-DE');

    //         html += `<tr class="account-item">
    //                         <td class="account-item_info">1</td>
    //                         <td class="account-item_info">${tdsAccountInTdsServer.user}</td>
    //                         <td class="account-item_info">${formattedNumber}</td>  
    //                         <td class="account-item_info" style="padding:0px 8px">
    //                             <button class="remove" data-id="${tdsAccountInTdsServer.id}">
    //                                 <i class="fa-solid fa-trash"></i>
    //                             </button>
    //                         </td>  
    //                     </tr>`;


    //     }
    // }

    // console.log(html);

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

    let tdsAccount = new TdsAccount(id, accessToken);
    
    // save acccount
    saveTDSAccount(tdsAccount);
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

async function getAllTdsAccounts() {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, "TdsAccounts"));
      if (snapshot.exists()) {
        let data = snapshot.val();
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