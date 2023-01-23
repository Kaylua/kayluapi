<script setup>
import { ref } from 'vue';
import errorVue from './popups/error.vue';
import router from '../router/index.js';

import baseIcon from '../assets/icon_base_discord.png';
import backImg from "../assets/back/LoginBckg.png";

const url = import.meta.env.VITE_URL_API || 'http://localhost:5000';

let myGuilds = ref([]);
let d3Guilds = ref([]);
let guilds = ref([]);

let msgName = ref("");
let idUser = ref();
let avatarUser = ref();

// Gère la liste des erreurs
let errors = ref([]);
function delError(i) {
    errors.value.splice(i, 1);
}

// Affichages
let loaded = ref(false);
let display = ref(false);
let transiOs = ref(false);

const fragment = new URLSearchParams(window.location.hash.slice(1));
const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

if (!accessToken) {
    console.log(`Accès refusé`);
    msgName.value = `Token Invalide : Accès refusé`;

    errors.value.push({type: "Client", content: "Token Invalide : Accès refusé"});

    setTimeout(() => {
        const domain = window.location.origin;
        window.location.assign(domain);
    }, 5000);
} else {

    // Requête pour récupérer les identifiants et paramètres de l'utilisateur
    fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    })
    .then(result => result.json())
    .then(response => {
        const { username, id, avatar } = response;
        msgName.value = `Bienvenue ${username} ! Choisis ton serveur :`;
        idUser.value = id;

        if (avatar) {
            avatarUser.value = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
        } else {
            console.log(baseIcon);
            avatarUser.value = baseIcon;
        }

        display.value = true;
    })
    .catch(error => {
        errors.value.push({type: "Discord API", content: "L'API discord ne répond pas : " + error});
    });
    
    // Requête pour récupérer la liste des guilds (serveurs discord) de l'utilisateur
    const fetchMyGuilds = fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    })
    .then(result => result.json())
    .then(response => {
        myGuilds.value = response;
    })
    .catch(error => {
        errors.value.push({type: "Discord API", content: "L'API discord ne répond pas : " + error});
    });
    

    // Requête pour récupérer la liste des guilds (serveurs discord) du bot
    const fetchD3Guilds = fetch(url + '/api/servers', {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    })
    .then(result => result.json())
    .then(response => {
        d3Guilds.value = response;
    })
    .catch(error => {
        errors.value.push({type: "D3 API", content: "L'API D3 ne répond pas : " + error});
    });
    
    // Quand la liste des serveurs du bot et de l'utilisateurs ont été reçues
    Promise.all([fetchMyGuilds, fetchD3Guilds])
    .then(responses => {
        let tab = [];
        
        for (let i = 0; i < myGuilds.value.length; i++) {
            for (let j = 0; j < d3Guilds.value.length; j++) {
                if (d3Guilds.value[j].id === myGuilds.value[i].id) {
                    let guild = myGuilds.value[i]
                    tab.push(guild);

                    if (guild.icon) {
                        guild.icon = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                    } else {
                        guild.icon = baseIcon;
                    }
                }
            }
        }
        guilds.value = tab;
    }); 
    
}


function selectGuild(idGuild) {
    sessionStorage.idGuild = idGuild;
    sessionStorage.idUser = idUser.value;
    sessionStorage.accessToken = accessToken;

    transiOs.value = true;
}

function goToOs() {
    router.push('windaube_XP-TDR');
}

function replaceImg(e) {
    console.log('slt');
    e.target.src = baseIcon;
}

function backLoaded() {
    loaded.value = true;
}
</script>

<template>
    <div id="loader" :class="[loaded ? 'hidden' : '']">
        <label id="patient">Veuillez Patienter ...</label>
    </div>

    <img id="backgroundImg" :src="backImg" @load="backLoaded">

    <errorVue v-for="(err, i) of errors" :key="i" @delpopup="delError(i)">
        Erreur : {{ err.type }} <br>
        {{ err.content }}
    </errorVue>
    
    <div class="page" v-if="display">
        <div class="container">
            <label id="info">
                <img :src="avatarUser" draggable="false" @abort="replaceImg($event)">
                {{ msgName }}
            </label>
            <div class="guildList">
                <div v-for="guild in guilds" class="guild" draggable="false" @click="selectGuild(guild.id)">
                    <img :src="guild.icon" draggable="false">
                    <div class="title" :id="guild.id">{{ guild.name }}</div>
                </div>
            </div>
        </div>
    </div>

    <div id="transiOs" v-if="transiOs" @animationend="goToOs()"></div>
</template>

<style scoped lang="scss">
* {
    // --primary: hsl(220, calc(1 * 7.7%), 22.9%); couleurs discord
    // --secondary: hsl(223, calc(1 * 6.9%), 19.8%);
    --loader-back: #202225;

    // Scrollbar for Firefox
    scrollbar-width: thin;
    scrollbar-color: #202225 #2f3136;
}

/* Scrollbar for Chrome, Edge, and Safari */
*::-webkit-scrollbar {
    width: 0.9vh;
}
*::-webkit-scrollbar-track {
    background: #2f3136;
}
*::-webkit-scrollbar-thumb {
    background-color: #202225;
}

.hidden {
    opacity: 0% !important;
    visibility: collapse;
}

// Loader
#loader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background-color: var(--loader-back);
    opacity: 100%;
    visibility: show;

    display: flex;
    justify-content: center;
    align-items: center;

    transition: all .4s;
}

#patient {
    color: white;
    font-family: 'Courier New', Courier, monospace;
    font-size: 3vh;

    opacity: 0%;

    animation: infinite alternate 1.5s blink;

    @keyframes blink {
        from {
            opacity: 0%;
        } to {
            opacity: 100%;
        }
    }
}

// Transition OS
#transiOs {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background-color: black;
    opacity: 0%;

    animation: .4s Appears both;

    @keyframes Appears {
        from {
            opacity: 0%;
        } to {
            opacity: 100%;
        }
    }
}

// Image de fond
#backgroundImg {
    background-color: black;
    object-fit: cover;
    filter: blur(8px);
    -webkit-filter: blur(8px);
    width: 100%;
    height: 100%;

    transition: opacity 2s;
}


// Contenu
.page {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

img[src=""] {
    opacity: 100%;
    border: none !important;
}

.container {
    padding: 1.3vh;
    background-color: #1a1b1ee8;
    color: #bbbcbd;
    display: flex;
    flex-direction: column;
    border-radius: 3.5vh;
    box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.5);
    
    width: 60vh;
    max-height: 42vh;
    opacity: 0%;

    animation: 1s .8s both FromTheShadows;

    @keyframes FromTheShadows {
        from {
            opacity: 0%;
        } to {
            opacity: 100%;
        }
    }
}  

#info {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    display: flex;
    align-items: center;
    background-color: rgba(128, 128, 128, 0.17);
    padding-right: 20px;
    border-radius: 3vh;
    font-size: 1.8vh;

    img {
        width: 6vh;
        margin-right: 10px;
        border-radius: 50%;
        border: 1px solid black;
    }
}



.guildList {
    display: flex;
    flex-direction: column;
    align-items: safe center;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    margin-top: 10px;
}

.guildList .guild {
    text-decoration: none;
    padding: 10px;
    display: flex;
    align-items: center;
    width: 85%;
    border-radius: 1vh;
    margin-top: 10px;
    
    transition: all .2s;
    cursor: pointer;
    
    .title {
        border-radius: 10px;
        transition: background-color .2s;
        
        color: #bbbcbd;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size: 3.1vh;
    }
    
    img {
        height: 7vh;
        border-radius: 3.5vh;
        margin-right: 10px;
        border: 1px solid black;
        transition: all .3s;
    }
    
    &:hover {
        background-color: rgba(128, 128, 128, 0.4);
        
        img {
            border-radius: 2.5vh;
        } 
    }
}
</style>