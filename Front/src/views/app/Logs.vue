<script setup>
import { ref } from "vue";
import axios from 'axios';
import errorVue from '../popups/error.vue';

import ytIcon from "../../assets/icons/youtube.svg";

const url = import.meta.env.VITE_URL_API || 'http://localhost:5000';

let logs = [];

let displayedLogs = ref([]);

// Gère la liste des erreurs
let errors = ref([]);
function delError(i) {
    errors.value.splice(i, 1);
}


function getLogs(params) {
    return axios.get(url + '/api/databaseinfo/logs/' + sessionStorage.idGuild)
    .then((responses) => {
        for (const res of responses.data.logs) {
            // Conversion de la date reçue en obj Date
            res.time = new Date(res.time);

            switch (res.action) {
                case "BAN":
                    res.icon = "🔨";
                    res.string = `
                    <label class="action">Bannissement</label> : 
                    <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> 
                    a banni <label class="username" title="${res.options.username2}#${res.options.discriminator2}">@${res.options.username2}</label> 
                    pour " <label class="reason">${res.options.reason}</label> "`;
                    res.color = "red";
                    break;

                case "MESSAGING":
                    res.icon = "💬";
                    res.string = `<label class="action">Message envoyé</label> : <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> a fait envoyer au bot le message " <label class="message">${res.options.message}</label> " dans le channel : <label class="channel">#${res.options.channel}</label>`;
                    res.color = 'white';
                    break;

                case "KICK":
                    res.icon = "💨";
                    res.string = `
                    <label class="action">Kick</label> : 
                    <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> 
                    a dégagé <label class="username" title="${res.options.username2}#${res.options.discriminator2}">@${res.options.username2}</label> 
                    pour " <label class="reason">${res.options.reason}</label> "`;
                    res.color = "orange";
                    break;

                case "PLAY_SOUND":
                    res.icon = "🎵";
                    res.string = `
                    <label class="action">Son joué</label> : 
                    <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> 
                    a lancé le bot pour jouer le son " <label class="soundname">${res.options.soundname}</label> "`;
                    res.color = "#27e300";
                    break;

                case "PLAY_SOUND_YTB":
                    res.icon = "🎵";
                    res.string = `
                    <label class="action">Son Youtube joué</label> : 
                    <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> 
                    a lancé le bot pout jouer <a class="linkYtb" target="_blank" title="${res.options.link}" href="${res.options.link}">ce son</a>`;
                    res.color = "#27e300";
                    break;
                
                case "STOP_SOUND":
                    res.icon = "🎵";
                    res.string = `
                    <label class="action">Son Stoppé</label> : 
                    <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> 
                    a fait taire le bot`;
                    res.color = "#27e300";
                    break;
                
                case "CREATE_SALON_TEXTUEL":
                    res.icon = `<span class="txtIcon">#</span>`;
                    res.string = `
                    <label class="action">Channel textuel créé</label> : 
                    <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> 
                    a créé(e) le channel textuel <label class="channel">#${res.options.nom_salon}</label> `;
                    res.color = "rgb(22, 157, 255)";
                    break;
                
                case "CREATE_SALON_VOCAL":
                    res.icon = `🔊`;
                    res.string = `
                    <label class="action">Channel vocal créé</label> : 
                    <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> 
                    a créé(e) le channel vocal <label class="channel">${res.options.nom_salon}</label> `;
                    res.color = "rgb(22, 157, 255)";
                    break;
                
                case "DELETE_SALON":
                    res.icon = "❌";
                    res.string = `
                    <label class="action">Channel supprimé</label> : 
                    <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> 
                    a supprimé(e) le channel <label class="channel">${res.options.nom_salon}</label> `;
                    res.color = "rgb(22, 157, 255)";
                    break;
                
                case "BRACELET":
                    res.icon = "👮";
                    res.string = `
                    <label class="action">Bracelet ajouté</label> : 
                    <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> 
                    a mis(e) un bracelet à <label class="username" title="${res.options.username2}#${res.options.discriminator2}">@${res.options.username2}</label> `;
                    res.color = "rgb(22, 157, 255)";
                    break;
                
                case "NO_BRACELET":
                    res.icon = "👮";
                    res.string = `
                    <label class="action">Bracelet supprimé</label> : 
                    <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> 
                    a enlevé(e) son bracelet à <label class="username" title="${res.options.username2}#${res.options.discriminator2}">@${res.options.username2}</label> `;
                    res.color = "rgb(22, 157, 255)";
                    break;
                
                case "ADD_YTB_LINK_DB":
                    res.icon = `<img src="${ytIcon}">`;
                    res.string = `
                    <label class="action">Lien youtube ajouté</label> : 
                    <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> 
                    a ajouté(e) une vidéo youtube à la base de donnée, nommée <a class="linkYtb" target="_blank" title="${res.options.link}" href="${res.options.link}">${res.options.link_name}</a>`;
                    res.color = "rgb(213, 254, 16)";
                    break;
                
                case "DELETE_YTB_LINK_DB":
                    res.icon = `<img src="${ytIcon}">`;
                    res.string = `
                    <label class="action">Lien youtube supprimé</label> : 
                    <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> 
                    a supprimé(e) de la base de donnée la vidéo <a class="linkYtb" target="_blank" title="${res.options.link}" href="${res.options.link}">${res.options.link_name}</a>`;
                    res.color = "rgb(213, 254, 16)";
                    break;
                
                case "ADD_SOUND_PATH_DB":
                    res.icon = `📁`;
                    res.string = `
                    <label class="action">Fichier son ajouté</label> : 
                    <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> 
                    a ajouté(e) un fichier de son à la base de donnée, nommé <label class="soundname">${res.options.sound_name}</label>`;
                    res.color = "rgb(213, 254, 16)";
                    break;
                
                case "DELETE_SOUND_PATH_DB":
                    res.icon = `📁`;
                    res.string = `
                    <label class="action">Fichier son supprimé</label> : 
                    <label class="username" title="${res.username}#${res.discriminator}">@${res.username}</label> 
                    a supprimé(e) un fichier de son de la base de donnée, nommé <label class="soundname">${res.options.sound_name}</label>`;
                    res.color = "rgb(213, 254, 16)";
                    break;
                
            
                default:
                    res.string = 'log ' + res.action;
                    break;
            }
            
            logs.push(res);
        }

        // Tri du tableau pour faire apparaitres les dates les plus récentes en haut
        logs.sort((a, b) => {
            return new Date(b.time) - new Date(a.time);
        });

        // Met les logs dans le tableau d'affichage
        displayedLogs.value = logs;
    })
    .catch(error => {
        errors.value.push({type: "D3 API", content: "L'API D3 ne répond pas : " + error});
    });

}

getLogs();
// AutoUpdate toutes les 10s
setInterval(getLogs, 10000);

/**
 * Décode la date et l'affiche pour les logs
 * @param {Date} date 
 */
function processDate(dateLog) {
    // Gestion affichage date
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    let befYesterday = new Date();
    befYesterday.setDate(today.getDate() - 2);

    if (today.toDateString() === dateLog.toDateString()) {
        return "Aujourd'hui à " + dateLog.toLocaleTimeString("fr-FR", { hour: 'numeric', minute: 'numeric' });

    } else if (yesterday.toDateString() === dateLog.toDateString()) {
        return "Hier à " + dateLog.toLocaleTimeString("fr-FR", { hour: 'numeric', minute: 'numeric' });
        
    } else if (befYesterday.toDateString() === dateLog.toDateString()) {
        return "Avant-hier à " + dateLog.toLocaleTimeString("fr-FR", { hour: 'numeric', minute: 'numeric' });

    } else {
        return dateLog.toLocaleTimeString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    }
}

function resetFilters(cible) {
    const search = cible ? `input[type="checkbox"]:not(#${cible.id})` : `input[type="checkbox"]`;

    // Décoche les autres filtres
    const parent = document.querySelector("#stageTwo");
    const checkboxs = parent.querySelectorAll(search);

    for (const box of checkboxs) {
        box.checked = false;
    }
}

/**
 * Filtre les logs affichés
 * @param {*} e event
 */
function filter(e) {
    const cible = e.target;

    resetFilters(cible);

    // Si l'action est de cocher une checkbox
    if (cible.checked) {
        // Affiche ce qui est demandé
        switch (cible.id) {
            case "msgFilterCheck":
                displayedLogs.value = logs.filter(log => {
                    return log.action === "MESSAGING";
                });
                break;
        
            case "banFilterCheck":
                displayedLogs.value = logs.filter(log => {
                    return log.action === "BAN" || log.action === "KICK";
                });
                break;
        
            case "musicFilterCheck":
                displayedLogs.value = logs.filter(log => {
                    return log.action === "PLAY_SOUND" || log.action === "PLAY_SOUND_YTB" || log.action === "STOP_SOUND";
                });
                break;
        
            case "filesFilterCheck":
                displayedLogs.value = logs.filter(log => {
                    return log.action === "ADD_YTB_LINK_DB" || log.action === "DELETE_YTB_LINK_DB" || log.action === "ADD_SOUND_PATH_DB" || log.action === "DELETE_SOUND_PATH_DB";
                });
                break;
        
            case "adminFilterCheck":
                displayedLogs.value = logs.filter(log => {
                    return log.action === "CREATE_SALON_TEXTUEL" || log.action === "CREATE_SALON_VOCAL" || log.action === "DELETE_SALON" || log.action === "BRACELET" || log.action === "NO_BRACELET";
                });
                break;
        
            default:
                displayedLogs.value = logs; 
                break;
        }
    } else {
        // Qaund décoche, réaffiche tout
        displayedLogs.value = logs; 
    }
}


function searchPseudo(e) {
    const searchValue = e.target.value;

    resetFilters();
    displayedLogs.value = logs; 

    const regex = RegExp(searchValue, "i");

    displayedLogs.value = logs.filter(log => log.username.match(regex) || log?.options?.username2?.match(regex));
}

function searchWord(e) {
    const searchValue = e.target.value;

    resetFilters();
    displayedLogs.value = logs; 

    const regex = RegExp(searchValue, "i");

    displayedLogs.value = logs.filter(log => log.string.match(regex));
}
</script>

<template>
<div id="filterApp">
    <div class="filterContainer" v-switch="test">
        <div id="stageOne">
            <div id="searchPseudo" @input="searchPseudo">Pseudo : <input type="text"></div>
            <div id="searchWord" @input="searchWord">Mot clé : <input type="text"></div>
        </div>
        <div id="stageTwo">
            <input type="checkbox" id="msgFilterCheck" @change="filter">
            <label class="catFilter" id="msgFilter" title="Messages" for="msgFilterCheck">💬</label>

            <input type="checkbox" id="banFilterCheck" @change="filter">
            <label class="catFilter" id="banFilter" title="Bans et kicks" for="banFilterCheck">🔨</label>

            <input type="checkbox" id="musicFilterCheck" @change="filter">
            <label class="catFilter" id="musicFilter" title="Musique jouée" for="musicFilterCheck">🎵</label>

            <input type="checkbox" id="filesFilterCheck" @change="filter">
            <label class="catFilter" id="filesFilter" title="Fichiers et liens youtubes" for="filesFilterCheck">📁</label>

            <input type="checkbox" id="adminFilterCheck" @change="filter">
            <label class="catFilter" id="adminFilter" title="Administration" for="adminFilterCheck">👮</label>
        </div>
    </div>
    <div class="logsContainer">
        <div class="log" v-for="log of displayedLogs" :id="log.id" :style="{'border-color': log.color}">
            <label class="logContent">
                <div class="logIcon" v-html="log.icon"></div>
                <label class="logTxt" v-html="log.string"></label>
            </label>
            <label class="logDate"> {{ processDate(log.time) }}</label>
        </div>
    </div>
</div>

<errorVue v-for="(err, i) of errors" :key="i" @delpopup="delError(i)">
    Erreur : {{ err.type }} <br>
    {{ err.content }}
</errorVue>
</template>

<!-- Filtre -->
<style scoped lang="scss">
#filterApp {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

.filterContainer {
    color: white;
    height: 15%;
    min-height: 100px;

    background-color: rgb(40, 40, 40);
    border: 1px solid rgb(90, 90, 90);
    border-radius: 3px;
    // margin: 2px;
    padding: 10px;

    #stageOne {
        height: 50%;

        display: flex;
        justify-content: space-between;
        align-items: center;

        font-family: "DM Mono", monospace;

        #searchPseudo, #searchWord {
            padding: 5px 20px;

            // border: 1px solid gray;
            border-radius: 3px;
            width: 50%;
            text-align: center;

            input {
                background-color: rgba(255, 255, 255, 0.1);
                border: none;
                outline: 1px solid gray;
                border-radius: 3px;
                height: 2em;
                color: white;
                font-family: "DM Mono", monospace;

                width: 45%;
                max-width: 200px;
            }
        }
    }
    
    #stageTwo {
        height: 50%;
        
        display: flex;
        justify-content: center;
        align-items: center;

        input[type=checkbox] {
            display: none;
        }


        .catFilter {
            height: 100%;
            width: 17%;
            max-width: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 3vh;
            user-select: none;

            background-color: rgba(128, 128, 128, 0.4);
            border: 0 solid black;
            border-left-width: 1px;
            border-right-width: 1px;

            cursor: default;

            transition: background-color .1s;
        }
        
        input[type=checkbox]:checked + #msgFilter, #msgFilter:hover {
            background-color: rgba(255, 255, 255, 0.9);
        }
        input[type=checkbox]:checked + #banFilter, #banFilter:hover {
            background-color: rgba(255, 0, 0, 0.8);
        }
        input[type=checkbox]:checked + #musicFilter, #musicFilter:hover {
            background-color: rgba(39, 227, 0, 0.8);
        }
        input[type=checkbox]:checked + #filesFilter, #filesFilter:hover {
            background-color: rgba(213, 254, 16, 0.8);
        }
        input[type=checkbox]:checked + #adminFilter, #adminFilter:hover {
            background-color: rgba(22, 157, 255, 0.8);
        }
    }
}
</style>

<!-- Logs -->
<style scoped lang="scss">
.logsContainer {
    overflow: auto;
    height: 85%;
    

    /* Works on Firefox */
    & {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.6) black;
    }

    /* Works on Chrome, Edge, and Safari */
    &::-webkit-scrollbar {
        width: 12px;
    }

    &::-webkit-scrollbar-track {
        background: orange;
    }

    &::-webkit-scrollbar-thumb {
        background-color: blue;
        border-radius: 20px;
        border: 3px solid orange;
    }

}

.log {
    color: white;
    font-family: 'Courier New', Courier, monospace;

    display: flex;
    flex-direction: column;

    margin: 5px;
    padding: 5px;
    border: 1px solid rgba(255, 0, 0, 0.8);
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.15);
    
    
    .logContent {
        display: flex;
        align-items: center;

        .logIcon {
            font-size: 3vh;
            padding: 0 10px 0 5px;
            font-family: 'DM Mono', monospace;
        }

        .logTxt {
            font-size: 2vh;
            font-family: 'DM Mono', monospace;
        }
    }
    
    .logDate {
        font-size: 1.6vh;
        color: rgba(255, 255, 255, 0.8);
        text-transform: capitalize;
        font-family: 'Anonymous Pro', monospace;
        padding: 2px 10px;
    }
}

</style>

<!-- Les classes de coloration du texte des logs -->
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300&family=Ubuntu+Mono&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Anonymous+Pro:ital@1&family=DM+Mono:wght@300&family=Ubuntu+Mono&display=swap');
.action {
    color: rgb(0, 243, 182);
}

.username, .username2, .channel {
    background-color: #404675;
    padding: 1px 5px;
    border-radius: 2px;
    font-family: 'Ubuntu Mono', monospace;
}

.message, .reason {
    color: rgb(255, 196, 4);
    font-family: 'Titillium Web', sans-serif;
}

.linkYtb, .soundname {
    color: red;
}

.logIcon svg, .logIcon img {
    width: 2.5vh;
    margin: 1vh .9vh 0 .9vh;
}
.txtIcon {
    margin: 0 1vh 0 1vh;
}
</style>