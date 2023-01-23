<script setup>
import { computed } from '@vue/reactivity';
import axios from 'axios';
import { onMounted, ref } from "vue";
import VueResizable from 'vue-resizable';
import errorVue from './popups/error.vue';

import backImg from "../assets/back/WindaubeBckg.png";

import { appsStored } from '../stores/apps.js';

// Imports des Components Apps
import AdminWindowVue from './app/AdminWindow.vue';
import iFrameVue from './app/iFrame.vue';
import LogsVue from './app/Logs.vue';
import SoundboardVue from './app/soundboard.vue';


// Imports des composants dans les apps
const importApps = ref({
    "adminComp": AdminWindowVue,
    "iFrame": iFrameVue,
    "soundboard": SoundboardVue,
    "logs": LogsVue
});

// Affichage et transitions
let transiOs = ref(true);

// Contient la liste des apps à afficher
let apps = ref({});

// Paramètres des déplacement des apps
const dragSelector = ".w-picker";
const handlers = ["r", "rb", "b", "lb", "l", "lt", "t", "rt"];
const min = { w: 300, h: 200 };

// Gère la div de preview de l'agrandissement
let placer = ref({state: false});

// Remplace les coordonées au besoin dans un déplacement
let replaceCo = ref({x: 0, y: 0});

// Gère l'axe Z
let z_index = ref(1);

// L'url de l'API
const url = import.meta.env.VITE_URL_API || 'http://localhost:5000';

// Gère la liste des erreurs
let errors = ref([]);
function delError(i) {
    errors.value.splice(i, 1);
}


// Loading image background
let start = ref(false);
let preloaderImg = document.createElement("img");
preloaderImg.src = backImg;

preloaderImg.addEventListener('load', (event) => {
    start.value = true;
    preloaderImg = null;
});


/**
 * Retourne les apps actives à l'écran
 */
let activesWindows = computed(() => {
    const arrayTemp = Object.entries(apps.value);
    const filtered = arrayTemp.filter(([key, value]) => {
        return value.state.active === true;
    });
    return Object.fromEntries(filtered);
});

/**
 * Contient le nom de la fenêtre qui a le plus grand z-index
 */
let focusWindow = computed(() => {
    const arrayTemp = Object.entries(apps.value);
    let z = 0;
    let index;
    const filtered = arrayTemp.filter(([key, value]) => {
        if(value.state.active === true) {
            if(z < value.state.z) {
                z = value.state.z;
                index = key;
            } 
            return true;
        }
    });
    return index;
});

// console.log(sessionStorage);
// Check si il y a bien un token dans la session en cours, sinon renvoie à l'auth
if (!sessionStorage.accessToken) {
    const domain = window.location.origin;
    window.location.assign(domain);
}

// Récup des permissions de l'utilisateur
let permUser = axios({
    method : 'GET',
    url: url + '/api/getmemberperm',
    params: {
        guildID: sessionStorage.idGuild,
        userID: sessionStorage.idUser
    }
}).catch(error => {
    errors.value.push({type: "Discord API", content: "L'API discord ne répond pas : " + error});
});

// Juste avant l'affichage
onMounted(() => {
    // Dès qu'on a reçu la réponse de permUser (/api/getmemberperm)
    permUser.then(res => {
        const isAdmin = res.data.includes("Administrator");

        let local = {};
        
        // Si localStorage.apps contient qqchose
        if (localStorage.apps) {
            local = JSON.parse(localStorage.apps);
        }
            
        // Boucle pour remplir le tableau des fenêtres à partir des datas dans le localStorage
        for (const window in appsStored.value) {
            // Si l'utilisateur n'est pas admin, et que l'app demande de l'être
            if (!isAdmin && appsStored.value[window].settings.admin) {
                // Skip
                continue;
            }
            
            // Ajoute l'app à la liste
            apps.value[window] = appsStored.value[window];

            // Si l'app existe dans le localStorage
            if (local[window]) {
                // Copie des params du State du LocalStorage vers le state de l'app
                apps.value[window].state = local[window]?.state;
            } else {
                // Paramètres de base d'un app
                apps.value[window].state = {
                    x: 200,
                    y: 50,
                    w: 600,
                    h: 500,
                    z: 1,
                    max: {
                        state: false,
                        side: ""
                    },
                    moving: false,
                    resizing: false,
                    focus: false,
                    previewing: false,
                    active: false
                }
            }
        }
    
        // Setup initial du z-index pour l'affichage superposé
        for (const app of Object.entries(apps.value)) {
            app[1].state.z = z_index.value++;
        }
        
        // Met au premier plan la dernière fenêtre utilisée
        if (!(!localStorage.focusWindow || localStorage.focusWindow === "undefined")) {
            // Vérifie si l'app qui veut être mise au focus est toujours aviable pour l'utilisateur
            if (apps.value[localStorage.focusWindow]) {
                selectWindow(localStorage.focusWindow, true);
            }
        }
    })
});

/**
 * Gère les évents et la prise en compte des données au déplacement et resize
 * @param {*} data event du DOM
 * @param {*} i index du tableau
 * @param {boolean} end Est-ce que c'est la fin d'une action ? (pour la save)
 */
function evtHandler(data, app, state) {
    // Redéfinit les variables des objet par rapport au depl et resize
    apps.value[app].state.w = data.width;
    apps.value[app].state.h = data.height;
    apps.value[app].state.x = data.left;
    apps.value[app].state.y = data.top;
    
    // Qd la fenêtre est en déplacement
    if (state === "moving") {
        apps.value[app].state.moving = true;
        const page = document.querySelector(".page");
        const pageRect = page.getBoundingClientRect();
    
        // Check si la fenêtre a été agrandie, si oui remet à taille normale ------------
        if (apps.value[app].state.max.state) {
            apps.value[app].state.max.state = false;

            // Déplacer la fenêtre sur les coordonées de la souris 
            apps.value[app].state.x = replaceCo.value.x - (data.width / 2);
            apps.value[app].state.y = replaceCo.value.y - 10 - pageRect.top;

        } 
        
        // Redimensionne si elle est trop grande
        const cap = 30;
        if (apps.value[app].state.w >= pageRect.width - cap) {
            apps.value[app].state.w -= cap;
        }
        if (apps.value[app].state.h >= pageRect.height - cap) {
            apps.value[app].state.h -= cap;
        }

        // Détections des upscales ------------------------------------------------------
        const enterZone = 1;
        const exitZone = 6;

        // Détection upscale en haut
        if (data.top <= enterZone) {
            // console.log("top");
            placer.value.preview = true;
            apps.value[app].state.previewing = true;
            placer.value.side = "top";

        } else if (data.top > exitZone && placer.value.preview && placer.value.side === "top") {
            previewReset(app)
        }

        // Détection upscale à gauche
        if (data.left <= enterZone) {
            // console.log("left");
            placer.value.preview = true;
            apps.value[app].state.previewing = true;
            placer.value.side = "left";

        } else if (data.left > exitZone && placer.value.preview && placer.value.side === "left") {
            previewReset(app)
        }

        // Détection upscale à droite
        if (data.left + data.width >= pageRect.width - enterZone) {
            // console.log("right");
            placer.value.preview = true;
            apps.value[app].state.previewing = true;
            placer.value.side = "right";

        } else if (data.left + data.width < pageRect.width - exitZone && placer.value.preview && placer.value.side === "right") {
            previewReset(app)
        }

        // ------------------------------------------------------------------------------
        
    }

    if (state === "resize") {
        apps.value[app].state.resizing = true;

        // Check si la fenêtre a été agrandie, si oui remet à taille normale ------------
        if (apps.value[app].state.max.state) {
            const appNode = document.querySelector("#" + app);
            const page = document.querySelector(".page");
            const rectApp = getRect(appNode, page);
            
            apps.value[app].state.w = rectApp.width;
            apps.value[app].state.h = rectApp.height;
            apps.value[app].state.x = rectApp.left;
            apps.value[app].state.y = rectApp.top;

            apps.value[app].state.max.state = false;
        } 
    }

    // Relachement du clic
    if (state === "end") {
        if (placer.value.preview) {
            scale(app, placer.value.side);
        }

        apps.value[app].state.moving = false;
        apps.value[app].state.resizing = false;
        saveState();
    }
}

function setReplaceCo(e) {
    replaceCo.value.x = e.x;
    replaceCo.value.y = e.y;
}


/**
 * Sauvegarde l'état du système, les tableaux de fenètres actives et minimisées, et la fenêtre en focus
 */
function saveState() {
    localStorage.setItem("apps", JSON.stringify(apps.value));
    localStorage.setItem("focusWindow", focusWindow.value);
    
    const page = document.querySelector(".page");
    const pageRect = page.getBoundingClientRect();

    localStorage.setItem("screen", JSON.stringify({width: pageRect.width, height: pageRect.height}))
}

function log() {
    // for (const fenetres in activesWindows) {
    //     console.log(activesWindows[fenetres]);
    // }
    console.log(localStorage);
    console.log(focusWindow.value);
    // console.log(minWindows);
}

function clearStorage() {
    localStorage.clear();
    console.log(localStorage);
}

/**
 * Envoie la fenêtre dans la barre des tâches
 * @param {*} index 
 */
function minimize(app) {
    apps.value[app].state.active = false;

    focusWindow.value = Object.keys(apps.value)[Object.keys(apps.value).length - 1];
    // console.log(focusWindow.value);
    saveState();
}

/**
 * Sors la fenêtre de la barre des tâches et l'affiche
 * @param {*} index 
 */
function unMinimize(app) {
    console.log(apps.value[app]);
    if (!apps.value[app].state.active) {
        apps.value[app].state.active = true;
        selectWindow(app, true);
    } else {
        if (app === focusWindow.value) {
            minimize(app);
        } else {
            selectWindow(app);
        }
    }
}

function selectWindow(app, force) {  
    if (focusWindow.value !== app || force) {
        z_index.value++;
        apps.value[app].state.z = z_index.value;
        // focusWindow.value = app;
        saveState();
    }
}

function scale(app, side) {
    if (apps.value[app].state.max.state) {
        apps.value[app].state.max.state = false;
    } else {
        apps.value[app].state.max.state = true;
        apps.value[app].state.max.side = side;
        previewReset(app);
    }
    saveState();
}

/**
 * Reset la fenêtre blanche de preview pour l'upscale
 * @param {String} app 
 */
function previewReset(app) {
    placer.value.preview = false;
    console.log(placer.value);
    apps.value[app].state.previewing = false;
}

/**
 * Retourne les coordonnées d'une div par rapport à une autre
 * @param {Element} targP La div dont on veut les coordonnées
 * @param {Element} section Le référentiel
 * @return {object} Les coordonnées dans un objet
 */
function getRect(targP, section) {
    let offset = [];

    let divRect = section.getBoundingClientRect();
    let elemRect = targP.getBoundingClientRect();
    offset.left = (elemRect.left - divRect.left) + section.scrollLeft;
    offset.top = (elemRect.top - divRect.top) + section.scrollTop;
    offset.width = elemRect.width;
    offset.height = elemRect.height;

    return offset;
}
</script>

<template>
    <div id="transiOs" :class="{disappear: start}" v-if="transiOs" @animationend="() => transiOs = false"></div>

    <div class="page" :style="{'background-image': 'url('+backImg+')'}">
        <div class="w-placer top" :class="[
            placer.preview ? (placer.side === 'top') ? 'placer-visible placer-maximized' : '' : ''
        ]" :style="{'z-index': activesWindows[focusWindow]?.state.z}"></div>
        <div class="w-placer left" :class="[
            placer.preview ? (placer.side === 'left') ? 'placer-visible placer-half-left' : '' : ''
        ]" :style="{'z-index': activesWindows[focusWindow]?.state.z}"></div>
        <div class="w-placer right" :class="[
            placer.preview ? (placer.side === 'right') ? 'placer-visible placer-half-right' : '' : ''
        ]" :style="{'z-index': activesWindows[focusWindow]?.state.z}"></div>


        <vue-resizable v-for="(window, index) in activesWindows" :key="index" 
        :id="index" class="app"
        :class="[window.state.moving ? 'moving' : '', window.state.resizing ? 'resizing' : '',
        window.state.previewing ? 'previewing' : '', 
        window.state.max.state ? (window.state.max.side === 'top') ? 'max-top' : '' : '', 
        window.state.max.state ? (window.state.max.side === 'left') ? 'max-left' : '' : '', 
        window.state.max.state ? (window.state.max.side === 'right') ? 'max-right' : '' : '']"
        :style="{'z-index': window.state.z}"
        :dragSelector="dragSelector" :active="handlers" :fit-parent="true"
        :width="window.state.w" :height="window.state.h"
        :left="window.state.x" :top="window.state.y"
        :min-width="(window.settings.minSize.x) ? window.settings.minSize.x : min.w" :min-height="(window.settings.minSize.y) ? window.settings.minSize.y : min.h"
        @mount="evtHandler($event, index)"
        @mousedown="selectWindow(index)"
        @resize:start="evtHandler($event, index, state = 'start')"
        @resize:move="evtHandler($event, index, state = 'resize')"
        @resize:end="evtHandler($event, index, state = 'end')"
        @drag:start="evtHandler($event, index, state = 'start')"
        @drag:move="evtHandler($event, index, state = 'moving')"
        @drag:end="evtHandler($event, index, state = 'end')">
            <div class="w-picker" @mousedown="setReplaceCo" @dblclick="scale(index, 'top')"
            :style="[window.settings.barColor ? `background-color: ${window.settings.barColor}` : '', window.settings.textColor ? `color: ${window.settings.textColor}` : 'color: white']">
                <img :src="`./src/assets/icons/${window.settings.icon}.png`" alt="icon" class="iconApp" draggable="false">
                <label class="appName">{{ index }}</label>
                <div class="buttonBar">
                    <!-- <button class="minimizeW" title="Minimiser">-</button> -->
                    <button class="closeW" @click="minimize(index)" title="Fermer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="w-content"> <component :is="importApps[window.settings.content]" v-bind="window.settings.props"/>
                <div class="frontPlate" v-if="(window.settings.content === 'iFrame' && focusWindow !== index)"></div>
            </div>
        </vue-resizable> 

        <errorVue v-for="(err, i) of errors" :key="i" @delpopup="delError(i)">
            Erreur : {{ err.type }} <br>
            {{ err.content }}
        </errorVue>
    </div>
    <div class="toolbar">
        <!-- <button @click="log">Log</button>
        <button @click="clearStorage">Clear</button> -->
        <div class="minimContainer" v-for="(window, index) of apps">
            <div class="minimApp" :id="index" @click="unMinimize(index)" :title="index" :class="[window.state.active ? 'active' : '']">
                <img :src="`./src/assets/icons/${window.settings.icon}.png`" alt="icon" draggable="false">
            </div>
        </div>
    </div>
</template>

<!-- Global -->
<style lang="scss">
* {
    box-sizing: border-box;
}

.resizable-component {
    .resizable-r {
        z-index: unset !important;
    }
    .resizable-rb {
        z-index: unset !important;
    }
    .resizable-b {
        z-index: unset !important;
    }
    .resizable-lb {
        z-index: unset !important;
    }
    .resizable-l {
        z-index: unset !important;
    }
    .resizable-lt {
        z-index: unset !important;
    }
    .resizable-t {
        z-index: unset !important;
    }
    .resizable-rt {
        z-index: unset !important;
    }
}
</style>

<!-- Mise en page -->
<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Courgette&display=swap');

header {
    display: flex;
    justify-content: center;
    
    border-bottom: 2px solid black;
    height: 5%;
}

.page {
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    height: 90%;
    position: relative;
    overflow: hidden;

    background: no-repeat center/cover;


    .upscale {
        position: absolute;
    }
    .upscale.top {
        // background-color: rgba(255, 0, 0, 0.4);
        left: 0;
        top: 0;
        width: 100%;
        height: 5%;
    } 
    .upscale.left {
        // background-color: rgba(0, 157, 255, 0.4);
        left: 0;
        top: 0;
        width: 3%;
        height: 100%;
    }
    .upscale.right {
        // background-color: rgba(0, 157, 255, 0.4);
        right: 0;
        top: 0;
        width: 3%;
        height: 100%;
    }
}

</style>

<!-- Style Apps (Fenêtre déplaçables / redimensionnables) -->
<style scoped lang="scss">
.app {
    width: 25%;
    height: 300px;
    outline: 1px solid black;
    background-color: black;
    box-shadow: 1px 1px 8px black;
    
    position: absolute;
    left: 20%;
    top: 50px;
    
    display: flex;
    flex-direction: column;
    border-radius: 4px;

    will-change: left, top, width, height;
    -webkit-transition: all .2s;
    -moz-transition: all .2s;
    -o-transition: all .2s;
    transition: all .2s;

    &.moving {
        -webkit-transition: left 0s, top 0s, width .2s, height .2s;
        -moz-transition: left 0s, top 0s, width .2s, height .2s;
        -o-transition: left 0s, top 0s, width .2s, height .2s;
        transition: left 0s, top 0s, width .2s, height .2s;
    }

    &.resizing {
        -webkit-transition: none;
        -moz-transition: none;
        -o-transition: none;
        transition: none;
    }


    .iconApp {
        height: 80%;
        padding-left: 3px;
    }


    .w-picker {
        background-color: gray;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 4vh;
        padding: 3px;
        border-radius: 4px 4px 0 0;
        
        .appName {
            text-align: center;
            font-family: 'Courgette', cursive;
            font-size: 0.8em;
            padding-left: 10px;
            color: gold;
            
        }
        .buttonBar {
            display: flex;
            justify-content: right;
            align-items: center;
            height: 100%;
            
            .minimizeW, .closeW {
                // background-color: rgba(255, 255, 255, 0.474);
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: transparent;
                color: inherit;

                cursor: pointer;
                border: 0;
                margin-left: 5px;
                
                height: 100%;
                width: 2.5em;

                border-radius: 3px;

                transition: background-color .2s;
            }
            
            .minimizeW:hover {
                background-color: rgba(255, 255, 255, 0.3);
            }
            
            .closeW:hover {
                background-color: rgba(220, 20, 60, 0.8);
            }
        }
    }


    .w-content {
        height: 100%;
        width: 100%;
        border-radius: 0 0 4px 4px;
        overflow: hidden;
        position: relative;
    }

    // Pour l'app iFrame, permet de cliquer dans l'app pour prendre le focus si elle ne l'a pas
    .frontPlate {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
}
</style>

<!-- Les zones "Placer", zones transparentes qui apparaissent comme guide pour redimmensionner une app -->
<style scoped lang="scss">
.w-placer {
    pointer-events: none;
    position: absolute;

    background-color: rgba(255, 255, 255, 0.2);
    border: 10px solid rgba(0, 0, 0, 0.4);
    
    visibility: collapse;
    opacity: 0%;
    transition: all .5s;
    

    &.top {
        left: 50%;
        top: 0%;
        width: 0%;
        height: 0%;
    }
    &.left {
        left: 0%;
        top: 50%;
        width: 0%;
        height: 0%;
    }
    &.right {
        left: 100%;
        top: 50%;
        width: 0%;
        height: 0%;
    }
    
    &.placer-visible {
        visibility: visible;
        opacity: 100%;
        z-index: 4;
    }
    
    &.placer-maximized {
        left: 0%;
        top: 0%;
        width: 100%;
        height: 100%;
    }
    &.placer-half-left {
        left: 0%;
        top: 0%;
        width: 50%;
        height: 100%;
    }
    &.placer-half-right {
        left: 50%;
        top: 0%;
        width: 50%;
        height: 100%;
    }
}

.max-top {
    left: 0% !important;
    top: 0% !important;
    width: 100% !important;
    height: 100% !important;
}
.max-left {
    left: 0% !important;
    top: 0% !important;
    width: 50% !important;
    height: 100% !important;
}
.max-right {
    left: 50% !important;
    top: 0% !important;
    width: 50% !important;
    height: 100% !important;
}

</style>

<!-- La ToolBar en bas -->
<style scoped lang="scss">
.toolbar {
    display: flex;
    justify-content: center;
    height: 5.5vh;
    background-color: lightslategray;
}

.minimContainer {
    height: 100%;
}


.minimApp {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 1.6vh;
    margin-bottom: -4px;
    background-color: rgba(255, 255, 255, 0.1);
    border-bottom: 3px solid orange;
    border-radius: 3px;

    transition: background-color .2s, border-color .2s;

    &.active {
        border-color: #00ffdd;
    }
}

.minimApp:hover {
    background-color: rgba(255, 255, 255, 0.3);
}

.minimApp img {
    height: 60%;
}

</style>

<!-- L'animation au chargement de la page -->
<style scoped lang="scss">
#transiOs {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background-color: black;
    opacity: 100%;   
    z-index: 100000;
}

.disappear {
    animation: 1s .5s Disappears both;

    @keyframes Disappears {
        from {
            opacity: 100%;
        } to {
            opacity: 0%;
        }
    }
}
</style>