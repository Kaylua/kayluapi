<script setup>
import axios from 'axios';
import{ref} from 'vue';
import errorVue from '../popups/error.vue';

const url = import.meta.env.VITE_URL_API || 'http://localhost:5000';
sessionStorage.idGuild = sessionStorage.idGuild || "1027139435680235550";

// Gère la liste des erreurs
let errors = ref([]);
function delError(i) {
    errors.value.splice(i, 1);
}

let channels = ref('');
let members = ref('');
let roleList = ref('');
//liste pour affichage
let userCat =ref([]);
let botL = ref([]);
let everyoneElse = ref([]);

// sessionStorage.idGuild = serverID
axios.get(url + '/api/servers/'+ sessionStorage.idGuild).then(async function (response){ 
  channels.value = response.data.channels;
  members.value = response.data.members;
  roleList.value = response.data.roles;
  roleList.value.forEach(role => {
    if(role.hoist == true && role.tags.botId != true){
      let roleObj ={name: role.name, id: role.id, userlist: [] }
      userCat.value.push(roleObj);
    }
    else if(role.tags.botId != undefined){
      let botobj ={name: role.name, id: role.id, userlist: []}
      botL.value.push(botobj);
    }
    else{
      let everyoneElseObj = {name: role.name, id: role.id, userlist: []}
      everyoneElse.value.push(everyoneElseObj);
    }

  })
 for (const cat of userCat.value) {
  await getrole(cat);
 }
 for (const bot of botL.value) {
  await getrole(bot);
 }
 for (const user of everyoneElse.value) {
  await getrole(user);
 }


})
.catch(error => {
  errors.value.push({type: "D3 API", content: "L'API D3 ne répond pas : " + error});
});



const input = ref(null);

// obtient la liste de toute les personnes ayant le role.id
function getrole(role){
  return( axios.get(url + '/api/servers/'+ sessionStorage.idGuild +'/'+ role.id).then((response) =>{
    let answer = [];

    for (const user of response.data.roles) {
      let answerobj ={name: user.displayName, id: user.userId};
      answer.push(answerobj);
    }
    role.userlist = answer;
  }));
}


//right click shenanigan
function afficher(name, i){
  var popup = document.getElementById("mypopup");
  popup.classList.toggle("show");
  console.log(name + ": "+ i);

  
}

function affichermember(){
  var popupm = document.getElementById("memberpopup");
  popupm.classList.toggle("show");
}

function assign(i, ind){
  console.log("fait");
  let test = document.getElementById("test");
  let index = document.getElementById("index");
  test.innerHTML = i;
  index.innerHTML=ind;

}
// var mess = document.getElementById("test");
// console.log(mess);

// fonction channels
function suppr(i) {
  var mess = document.getElementById("test");
  var index = document.getElementById("index");
  channels.value.splice(index.innerHTML, 1);
  var popup = document.getElementById("mypopup");
  popup.className="popup";

  axios ({
    method : 'POST',
    url : url + '/api/deletesalon/dellchannel',
    data : {
      userID: sessionStorage.idUser,
      guildID : sessionStorage.idGuild,
      channelID : mess.innerHTML
    }
  })
  .catch(error => {
    errors.value.push({type: "D3 API", content: "L'API D3 ne répond pas : " + error});
  });
};

function addbot(i) {
  console.log('channel id de général :'+i);
  var mess = document.getElementById("test");
  console.log(mess);
  axios ({
    method : 'POST',
    url : url + '/api/joinchannel',
    data : {
      channelID : mess.innerHTML,
      guildID : sessionStorage.idGuild,
    }
  })
  .catch(error => {
    errors.value.push({type: "D3 API", content: "L'API D3 ne répond pas : " + error});
  });
};

function delbot(i) {
  var mess = document.getElementById("test");
  axios ({
    method : 'POST',
    url : url + '/api/leavechannel',
    data : {
      guildID : sessionStorage.idGuild,
    }
  })
  .catch(error => {
    errors.value.push({type: "D3 API", content: "L'API D3 ne répond pas : " + error});
  });
};

// function restrain(i) {
//   var mess = document.getElementById("test");
//   axios ({
//     method : 'POST',
//     url : url + '/api/unban/user',
//     data : {
//       userID :"1044980052821028974",
//       userID :"1044980052821028974",
//       guildID : sessionStorage.idGuild

//     }
//   })
//   .catch(error => {
//     errors.value.push({type: "D3 API", content: "L'API D3 ne répond pas : " + error});
//   });
// };

// fonction members
function ban() {
  var mess = document.getElementById("test");
  axios ({
    method : 'POST',
    url : url + '/api/ban/user',
    data : {
      userID: sessionStorage.idUser,
      banuserID : mess.innerHTML,
      guildID : sessionStorage.idGuild,
      reason : "Tu étais chiant"
    }
  })
  .then (response =>{
    setTimeout(() => {
      refresh();
    }, 500);
    
  })
  .catch(error => {
    errors.value.push({type: "D3 API", content: "L'API D3 ne répond pas : " + error});
  });
};

function putbracelet() {
  var mess = document.getElementById("test");
  axios ({
    method : 'POST',
    url : url + '/api/bracelet/role',
    data : {
      userID: sessionStorage.idUser,
      userbraceletID : mess.innerHTML,
      guildID : sessionStorage.idGuild,
      roleID : "1032221518249332746"
    }
  })
  .then (response =>{
    setTimeout(() => {
      refresh();
    }, 500);
    
  })
  .catch(error => {
    errors.value.push({type: "D3 API", content: "L'API D3 ne répond pas : " + error});
  });
};

function delbracelt() {
  var mess = document.getElementById("test");
  axios ({
    method : 'POST',
    url : url + '/api/nobracelet/norole',
    data : {
      userID: sessionStorage.idUser,
      usernobraceletID : mess.innerHTML,
      guildID : sessionStorage.idGuild,
      roleID : "1032221518249332746"
    }
  })
  .then (response =>{
    setTimeout(() => {
      refresh();
    }, 500);
    
  })
  .catch(error => {
    errors.value.push({type: "D3 API", content: "L'API D3 ne répond pas : " + error});
  });
};

// action sur le serveur

function poster(i) {
  var mess = document.getElementById('poster');
  axios ({
    method : 'POST',
    url : url + '/api/messaging/message/'+ i,
    data : {
      message : mess.value,
      userID : sessionStorage.idUser,
      guildID : sessionStorage.idGuild
    }
  })
  .catch(error => {
    errors.value.push({type: "D3 API", content: "L'API D3 ne répond pas : " + error});
  });
};

function creer(i){
  console.log("c");
  var mess = document.getElementById('poster');
  axios ({
    method : 'POST',
    url : url + '/api/createsalontextuel/channel',
    data : {
      userID: sessionStorage.idUser,
      channelname : mess.value,
      categoryID : "1027139435680235551",
      guildID : sessionStorage.idGuild,
      
    }
  })
  .then (response =>{
    setTimeout(() => {
      refresh();
    }, 500);
    
  })
  .catch(error => {
    errors.value.push({type: "D3 API", content: "L'API D3 ne répond pas : " + error});
  })
  .catch(error => {
    errors.value.push({type: "D3 API", content: "L'API D3 ne répond pas : " + error});
  });
}

function refresh(){
  axios.get(url + '/api/servers/'+ sessionStorage.idGuild).then(async function (response){
  channels.value = response.data.channels;
  members.value = response.data.members;
  for (const cat of userCat.value) {
  await getrole(cat);
 }
 for (const bot of botL.value) {
  await getrole(bot);
 }
 for (const user of everyoneElse.value) {
  await getrole(user);
 }
})}






function creerV(i){
  console.log("c");
  var mess = document.getElementById('poster');
  axios ({
    method : 'POST',
    url : url + '/api/createsalonvocal/channel',
    data : {
      userID: sessionStorage.idUser,
      channelname : mess.value,
      categoryID : "1027139436124848188",
      guildID : sessionStorage.idGuild, 
    }
  })
  .then (response =>{
    setTimeout(() => {
      refresh();
    }, 500);
    
  })
  .catch(error => {
    errors.value.push({type: "D3 API", content: "L'API D3 ne répond pas : " + error});
  });

}


</script>

<template>
<div id = body_window >
  <div id="test" class="hidden"></div>
  <div id="index" class="hidden"></div>
  <div id="mypopup" class="popup">
    <div class="bouton">
        <button class="ordre" v-on:click="suppr()" title="supprimer le channel" >❌</button>
    </div>
    <div class="bouton">
      <button class="ordre" v-on:click="addbot()" title="inviter D3">🤖</button>
    </div>
    <div class="bouton">
      <button class="ordre" v-on:click="delbot()" title="virer D3">👉</button>
    </div>
    <!-- <div class="bouton">
      <button class="ordre" v-on:click="restrain()" title="Unban">🔑</button>
    </div> -->
  </div>
  <div id="memberpopup" class="popupmember">
    <div class="bouton">
      <button class="ordre" v-on:click="ban()" title="Ban">🔨</button>
    </div>
    <div class="bouton">
      <button class="ordre" v-on:click="putbracelet()" title="mettre le bracelet">🔐</button>
    </div>
    <div class="bouton">
      <button class="ordre" v-on:click="delbracelt()" title="retirer le bracelet">🔓</button>
    </div>
  </div>
<div id = container>
    <div id = outer>
        <div id = en_tête> 
            <div class="title">Admin </div>
        </div>
        <div id = inner>
            <div id = salon>
                <div class="top">salon </div>
                <div class="contenu">
                  <ul >Salon textuel
                    <template v-for="(channel, i) in channels" :key="i">
                    <li v-bind:id="i" v-if="channel.channeltype === 0" class="elem" >
                        <div class="nom" v-on:click="afficher(channel.name, i); assign(channel.id, i)">{{channel.name}}</div>
                    </li>
                  </template>
                  </ul>
                  <ul >Salon vocal
                    <template v-for="(channel, i) in channels" :key="i">
                    <li v-bind:id="i" v-if="channel.channeltype === 2" class="elem" >
                        <div  class="nom" v-on:click="afficher(channel.name, i); assign(channel.id, i)">{{channel.name}}</div>
                    </li>
                  </template>
                  </ul>
                </div>
            </div>
            <div id = user>
                <div class ="top">user</div>
                <div class="contenu"> 
                  <template v-for="(list, i) in userCat" :key="i">
                    <ul>{{ list.name }}
                      <div v-for="(user,j) in list.userlist">
                        <li class="elem">
                          <div  class="nom" v-on:click="affichermember(user.name, i); assign(user.id, i)">{{user.name}}</div>
                        </li>
                      </div>
                    </ul>
                  </template>
                  <ul> Bot
                    <template v-for="(list, i) in botL" :key="i">
                        <div v-for="(user,j) in list.userlist">
                          <li class="elem">
                            <div  class="nom" v-on:click="affichermember(user.name, i); assign(user.id, i)">{{user.name}}</div>
                          </li>
                        </div>
                    </template>
                  </ul>
                  <template v-for="(list, i) in everyoneElse" :key="i">
                    <ul>{{ list.name }}
                      <div v-for="(user,j) in list.userlist">
                        <li class="elem">
                          <div  class="nom" v-on:click="affichermember(user.name, i); assign(user.id, i)">{{user.name}}</div>
                        </li>
                      </div>
                    </ul>
                  </template>
                </div>
            </div>
        </div>
    </div>
      <div id="footer">
        
        <div id="publier">
        <input id = "poster" type="text" placeholder="poster"/>
        <div >
          <button @click="creer(i)" class="commande"> Créer textuel </button>
          <button @click="creerV(i)" class="commande"> Créer vocal </button>
        </div>
        </div>
        <div id="barchannel" >
          <button v-for="(channel,i) in channels" :key="i" class="but" v-on:click="poster(channel.id)">{{channel.name}}</button>
        </div>
      </div>
  </div>
</div>    
  
<errorVue v-for="(err, i) of errors" :key="i" @delpopup="delError(i)">
  Erreur : {{ err.type }} <br>
  {{ err.content }}
</errorVue>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch&family=Lobster&display=swap');

#publier, #barchannel
{
  display:inline-block;
  margin-inline-start: 60px;
  margin-inline-end: 60px;
}

.commande
{
  margin-left: 5px;
  cursor: pointer;
  color: aliceblue;
  background-color: darkblue;
  border: solid rgb(1, 1, 39);
}

#poster
{
  margin-bottom: 10px;
}

#publier
{
  height: 100%;
}

#barchannel
{
  margin-top: 10px;
  width: 20%;
  height: 50px;
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-color: rgb(94, 83, 180) rgb(8, 1, 61);
  scrollbar-width: thin;
  border: solid darkblue;

}

.but
{
  float: inline-start;
  height: 30px;
  width: 95%;
  overflow: hidden;
  margin: 5px;
  color: aliceblue;
  background-color: darkblue;
  border: solid rgb(1, 1, 39);
  cursor: pointer;
}

.hidden
{
  position: absolute;
  visibility: hidden;
}

.popup
{
  position: absolute;
  z-index: 1;
  margin-left: 50%;
  margin-top: 20%;
  width: 50px;
  height: 200px;
  text-align: center;
  color: black;
  background-color: aliceblue;
  border-radius: 5px;
  box-shadow: 5px 5px 5px black;
  visibility: hidden;
  
}

.popupmember
{
  position: absolute;
  z-index: 1;
  margin-left: 50%;
  margin-top: 20%;
  width: 50px;
  height: 200px;
  text-align: center;
  color: black;
  background-color: aliceblue;
  border-radius: 5px;
  box-shadow: 5px 5px 5px black;
  visibility: hidden;
}

.show {
  visibility: visible;
}

.hide{
  visibility: hidden;
}

.bouton
{
  margin-top: 15px;
}

.nom
{
  cursor: pointer;
}



#body_window{
  color: aliceblue;
  background-image: url("./src/assets/back/1092728.jpg");
  background-size: cover; 
  background-position: center;
  height: 100%;
  width: 100%;
}


#container{
    position: relative;
    top: 0;
    left: 0;
    height: 95%;
    width: 100%;
    padding: 0;

}

#en_tête
{
  width:100%;
  text-align: center;
  color: goldenrod;
  font-family: 'Lobster', cursive;
}
#outer
{
  width:100%;
  height:80%;
}

.title {
  font-size: 35px;
  padding: 5px;
}
#inner
{
  height:90%;
  padding:0 0 64px 0;
  text-align:center;

}
#salon, #user
{
  display:inline-block;
  width:49.5%;
  height:100%;
  margin:0px;
  text-align:center;
  font-family: 'Chakra Petch', sans-serif;

}

#salon
{
  float: left;
}

.contenu
{
  overflow-x: hidden;
  overflow-y: scroll;
  width: 300px;
  height: 100px;
  overflow-y: scroll;
  scrollbar-color: rgb(161, 83, 180) rgb(107, 10, 83);
  scrollbar-width: thin;
}

.elem
{
  margin: 10px;
  border: solid 1px whitesmoke;
  background-color: rgba(240, 248, 255, 0.522);
}




#footer{
  text-align: center;
  font-family: 'Chakra Petch', sans-serif;
  height: 60px;
  width: 100%;
  position: absolute;
  
}
#search{
  margin-top: 20px;
  
}

.top{
  border: solid 1px white;
  width: 100%;
  background-color: slategray;
  color: lightgoldenrodyellow;

}

.contenu{
  border: solid 1px;
  width: 100%;
  height: 100%;
}


</style>