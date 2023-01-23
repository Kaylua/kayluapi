<script setup>
import backImgLogin from '../assets/back/LoginBckg.png';

console.log(backImgLogin);

preloadImgs(backImgLogin);

function preloadImgs(img) {
    let image = new Image();
    image.src = img;
}

</script>

<template>
    <meta http-equiv="refresh" content="0; URL=https://discord.com/api/oauth2/authorize?client_id=1031859277876449281&redirect_uri=http%3A%2F%2F127.0.0.1%3A5173%2Fguilds&response_type=token&scope=identify%20guilds">
</template>

<style scoped>

</style>
