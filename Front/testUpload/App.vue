<script setup>
import axios from 'axios';

function upload(e) {
    let files = e.target.files || e.dataTransfer.files;

    if (!files.length) {return}

    const formData = new FormData();
    formData.append('file', files[0]);
    const headers = { 'Content-Type': 'multipart/form-data' };

    //         | Url                     | Fichier | Paramètres
    axios.post('https://httpbin.org/post', formData, {headers})
    .then((res) => {
        res.data.files; // binary representation of the file
        res.status; // HTTP status
    });

    // Si tu va voir la requète qui part tu devrais trouver une requète POST 
    // (⌐■_■)
}

</script>

<template>
    <label class="btn">
        Upload <br>
        <input type="file" name="fileI" @change="upload">
    </label>
</template>

<style>
#app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #202225;
}

.btn {
    font-size: 4vh;
    font-family: 'Courier New', Courier, monospace;
    padding: 1vh 3vh;
    background-color: cadetblue;
    cursor: pointer;
    border-radius: 1vh;
    text-align: center;
}

input[type="file"] {
    /* display: none; */
}
</style>

