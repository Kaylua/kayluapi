# Base d'un LOG :
    _id : ""
    action : ""
    username : ""
    discriminator : ""
    guildID : ""
    date : ""
    time : ""
    options : {}

# Options :

## messaging.js : MESSAGING
    options : {
        message : ""
        channel : ""
    }

## kick.js KICK
    options : {
        username2 : ""
        discriminator2 : ""
        reason : ""
    }

## ban.js BAN
    options : {
        username2 : ""
        discriminator2 : ""
        reason : ""
    }

## unban.js UNBAN
    options : {
        username2 : ""
        discriminator2 : ""
    }

## playsound.js PLAY_SOUND
    options : {
        soundname : ""
    }

## playsoundYTB.js PLAY_SOUND_YTB
    options : {
        link : ""
    }

## stopsound.js STOP_SOUND
    - pas d'option

## createsalontextuel.js CREATE_SALON_TEXTUEL
    options : {
        nom_salon : ""
    }

## createsalonvocal.js CREATE_SALON_VOCAL
    options : {
        nom_salon : ""
    }

## deletesalon.js DELETE_SALON
    options : {
        nom_salon : ""
    }

## bracelet.js BRACELET
    options : {
        username2 : ""
        discriminator2 : ""
    }

## nobracelet.js NO_BRACELET
    options : {
        username2 : ""
        discriminator2 : ""
    }

## addyoutubelink.js ADD_YTB_LINK_DB
    options : {
        link_name : ""
        link : ""
    }

## deleteyoutubelink.js DELETE_YTB_LINK_DB
    options : {
        link_name : ""
        link : ""
    }

## addsoundpath.js ADD_SOUND_PATH_DB
    options : {
        sound_name : ""
    }

## deletesoundpath.js DELETE_SOUND_PATH_DB
    options : {
        sound_name : ""
    }