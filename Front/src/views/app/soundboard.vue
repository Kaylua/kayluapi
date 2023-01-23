<script>
import axios from 'axios';
import{ref} from 'vue';


const url = import.meta.env.VITE_URL_API || 'http://localhost:5000';


//function bdd
function add(i){
    var mess = document.getElementById('link');
    console.log("test");
  axios ({
    method : 'POST',
    url : url + '/api/addyoutubelink',
    data : {
      link : mess.value
    }
  });
}

function suppr(i){
    var mess = document.getElementById('link');
  axios ({
    method : 'POST',
    url : url + '/api/deleteyoutubelink',
    data : {
      id : mess.value
    }
  });
}

function afficher(i){
    var mess = document.getElementById('link');
  axios ({
    method : 'POST',
    url : url + '/api/databaseinfo',
    data : {
      collection : mess.value
    }
  });
}



</script>

<template>
<div id="bod">
    <div id="top_part">
        <div id="right_top_part">
            <div>
                <div id="input">
                    <input id = "link" type="text" placeholder="link..."/>
                </div>
                <div>
                    <button class="command" @click="add()" >ajouter</button>
                    <button class="command" @click="suppr()">supprimer</button>
                    <button class="command" @click="afficher()">afficher</button>
                </div>
            </div>
        </div>
        <div id="left_top_part">
            <div>
                soundboard
            </div>

        </div>
    </div>
    <div id="middle_part">
        <div id="music_box1" class="music_box">
            <div class="titre"> titre</div>
            <div>
                <button class="play">Play</button>
            </div>

        </div>
        <div id="music_box2" class="music_box">
            <div class="titre"> titre</div>
            <div>
                <button class="play">Play</button>
            </div>

        </div>

    </div>
    <div id="footer">
        <div id="search">
                <input id = "searchbar" type="text" placeholder="search"/>
        </div>
    </div>

</div>

</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch&family=Lobster&display=swap');

.command
{
    margin-top: 5px;
    margin-inline-start: 5px;
}

#input
{
    margin-top: 25px;
}

#searchbar
{
    margin-bottom: 5px;
    margin-top: 5px;
}

#bod
{
    position: absolute;
  top: 0px;
  /* margin-top: 30px; */
  bottom: 0px;
  left : 0px;
  right: 0px;
  color: aliceblue;
    background-color: rgb(40, 19, 109);
}

.titre
{
    font-family: 'Lobster', cursive;
    color: goldenrod;
    font-size: 45px;
    margin-top: 5px;
    margin-bottom: 10px;
}

.music_box
{
    display: inline-block;
    margin-inline-start: 10%;
    height: 100px;
    width: 150px;
    border: solid rgb(5, 131, 131);
    text-align: center;
    border-radius: 5px;
    background-color: rgba(2, 71, 71, 0.768);
}
#footer
{
    bottom: 10px;
    height: 10%;
}

#middle_part
{
    height: 50%;
    padding-top: 10px;
}
#top_part{
    text-align: center;
    height: 30%;
    background-color: rgba(1, 55, 55, 0.605);
    border-bottom: solid rgb(1, 52, 52);
}
#right_top_part, #left_top_part
{
    display: inline-block;
    width: 49.5%;
}

#left_top_part
{
    text-align: center;
    background-color: cornflowerblue;
}

</style>