<script setup>
import { ref } from 'vue';

let closePopup = ref(false);

const emit = defineEmits(["delpopup"]);

function close() {
    closePopup.value = true;
}

function animEnd(e) {
    let animName = e.animationName.split("-")[0];

    if (animName === "disappearsRight") {
        // Emission de l'event pour delete la popup        
        emit("delpopup");
    }
}
</script>

<template>
<div class="popupBody" :class="[closePopup ? 'close' : '']" @animationend="animEnd($event)">
    <slot></slot>

    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
    class="bi bi-x closePopup" viewBox="0 0 16 16" @click="close()">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
</div>
</template>

<style lang="scss" scoped>
.popupBody {
    position: absolute;
    top: 5%;
    right: 3%;
    width: auto;
    max-width: 40%;
    height: auto;

    // transform: translateX(150%);

    border: 2px solid rgb(220, 0, 44);
    background-color: rgba(227, 0, 0, 0.6);
    color: white;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.8vh;
    border-radius: 3px;
    padding: 1vh 3.5vh 1vh 2vh;

    animation: 1s appearsRight both;
    animation-timing-function: cubic-bezier(.94,-0.16,.68,1.36);


    &.close {
        animation: 1s disappearsRight both;
        animation-timing-function: cubic-bezier(.94,-0.16,.68,1.36);
    }

    @keyframes appearsRight {
        from {
            transform: translateX(150%);
        } to {
            transform: translateX(0%);
        }
    }
    @keyframes disappearsRight {
        from {
            transform: translateX(0%);
        } to {
            transform: translateX(150%);
        }
    }

}

.closePopup {
    position: absolute;
    top: 1%;
    right: 0%;
    height: 2.2vh;
    max-height: 100%;

    transition: background-color .2s;

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 3px;
    }
}


</style>