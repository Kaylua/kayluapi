# API D3

## Récupère des infos générales sur le bots et les serveur dans lequel il est (servers.js)
    GET : http://localhost:5000/api/servers/

    ne nécessite rien dans le body

## Récupérer les infos des membres, channels, roles (servers.js)
    GET : http://localhost:5000/api/servers/'guildID'
    ou
    GET : http://localhost:5000/api/servers/'guildID'/'roleID' // pour recupere les membres ayant un role specifique

    ne nécessite rien dans le body

## Envoyer une message dans un channel (messaging.js)

    POST : http://localhost:5000/api/messaging/message/'channelID'

    nécessite dans l'URL le channelID

    nécessite dans le body :
    {
        "message" : "",
        "userID" : "",
        "guildID" : ""
    }

## Kick un membre (kick.js)
    POST : http://localhost:5000/api/kick/user

    nécessite dans le body : 
    {
        "userID" : "",
        "kickuserID",
        "guildID" : "",
        "reason" : ""
    }

## Ban un membre (ban.js)
    POST : http://localhost:5000/api/ban/user

    nécessite dans le body : 
    {
        "userID" : "",
        "banuserID" : "",
        "guildID" : "",
        "reason" : ""
    }

## Unban un membre (unban.js)
    POST : http://localhost:5000/api/unban/user

    nécessite dans le body : 
    {
        "userID" : "",
        "unbanuserID" : "",
        "guildID" : ""
    }

## Envoyer le bot dans un channel (joinchannel.js)
    POST : http://localhost:5000/api/joinchannel

    nécessite dans le body : 
    {
        "channelID" : "",
        "guildID" : ""
    }

## Déconecter le bot d'un channel (leavechannel.js)
    POST : http://localhost:5000/api/leavechannel

    nécessite dans le body : 
    {
        "guildID" : ""
    }

## Jouer un son sur le bot (playsound.js)
    POST : http://localhost:5000/api/playsound

    nécessite dans le body : 
    {
        "userID" : "",
        "soundpath" : "",
        "guildID" : ""
    }

## Jouer un son youtube sur le bot (playsoundYTB.js)
    POST : http://localhost:5000/api/playsoundYTB

    nécessite dans le body : 
    {
        "userID" : "",
        "guildID" : "1027139435680235550",
        "lienYTB" : "https://www.youtube.com/watch?v=EXj1V-gwlZo"
    }

## Stopper un son sur le bot (stopsound.js)
    POST : http://localhost:5000/api/stopsound

    nécessite dans le body : 
    {
        "userID" : "",
        "guildID" : ""
    }


## Crée un salon textuel (createsalontextuel.js)
    POST : http://localhost:(port)/api/createsalontextuel/channel

        nécessite dans le body : 
{
    "userID" : "254661709006897162",
    "guildID" : "1027139435680235550",
    "categoryID" : "1027139435680235551",
    "channelname" : "test2"
}

## Crée un salon vocal (createsalonvocal.js)
    POST : http://localhost:(port)/api/createsalonvocal/channel

        nécessite dans le body : 
{
    "userID" : "254661709006897162",
    "guildID" : "1027139435680235550",
    "categoryID" : "1027139436124848188",
    "channelname" : "test2"
}

## Supprimer un salon (deletesalon.js)
    POST : http://localhost:(port)/api/deletesalon/dellchannel

        nécessite dans le body : 
{
    "userID" : "",
    "guildID" : "",
    "channelID" : ""
}

## Ajouter un bracelet a un membre (bracelet.js)
    POST : http://localhost:(port)/api/bracelet/role

        nécessite dans le body :
{
    "userID" : "238660830210555905",
    "userbraceletID" : "526084781385973803",
    "guildID" : "1027139435680235550",
    "roleID" : "1032221518249332746"
}

## Retirer un bracelet a un membre (nobracelet.js)
    POST : http://localhost:(port)/api/nobracelet/role

        nécessite dans le body :
{
    "guildID" : "1027139435680235550",
    "userID" : "238660830210555905",
    "usernobraceletID" : "",
    "roleID" : "1032221518249332746"
}

## Recupere les roles d'une guild (getguildroles.js)
    GET : http://localhost:(port)/api/getguildroles?guildID=something

    Return : GuildRoles (objet)

## Recupere la perm d'un membre (getmemberperm.js)
    GET : http://localhost:(port)/api/getmemberperm?guildID=something&userID=something

    Return : perm(objet)

## Ajouter un lien youtube ou autre à la bdd (addyoutubelink.js)
    POST : http://localhost:(port)/api/addyoutubelink

        nécessite dans le body :
{
    "name" : "",
    "link" : "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "tags" : "",
    "userID" : "",
    "guildID" : "",
    "duration" : "",
    "level" : 
}

## Supprime un lien youtube de la bdd (deleteyoutubelink.js)
    POST : http://localhost:(port)/api/deleteyoutubelink

        nécessite dans le body :
{
    "userID" : "",
    "guildID" : "",
    "id" : ""
}

## Ajouter un chemin vers un son dans la bdd (addsoundpath.js)
    POST : http://localhost:(port)/api/addsoundpath

        nécessite dans le body :
{
    "name" : "",
    "path" : "",
    "tags" : "",
    "userID" : "",
    "guildID" : "",
    "duration" : "",
    "level" : 
}

## Supprime un chemin vers un son dans la bdd (deletesoundpath.js)
    POST : http://localhost:(port)/api/deletesoundpath

        nécessite dans le body :
{
    "userID" : "",
    "guildID" : "",
    "id" : ""
}

## Récupérer des éléments dans la BDD (databaseinfo.js)
### OPTION 1 : (retourne une collection entière)
    POST : http://localhost:(port)/api/databaseinfo/NOM_DE_LA_COLLECTION

        aucun body

Noms des collections : youtubelinks, soundpaths, logs

### OPTION 2 : (retourne les infos d'un serveur précis)
    POST : http://localhost:(port)/api/databaseinfo/NOM_DE_LA_COLLECTION/GUILDID

        aucun body

Noms des collections : youtubelinks, soundpaths, logs