import { ref } from 'vue'

export const appsStored = ref({
    "Administrator": {
        settings: {
            icon: "Admin",
            minSize: {
                x: 402, // false si désactivé (qd même 100x100px)
                y: 480
            },
            barColor: '#000',
            textColor: 'rgb(255, 72, 0)',
            admin: true,
            content : "adminComp"
        }
    },
    "RefineryCalc": {
        settings: {
            icon: "Firefox_logo,_2019.svg",
            minSize: {
                x: 850,
                y: 500
            },
            barColor: '#455f78',
            textColor: false,
            admin: false,
            content: "iFrame",
            props: {
                url: "http://outofspace.fr/RafineryCalcJsPTU/",
            }
        }
    },
    "Minecraft": {
        settings: {
            icon: "minecraft-icon",
            minSize: {
                x: false,
                y: false
            },
            barColor: "#004800",
            textColor: false,
            admin: false,
            content: "iFrame",
            props: {
                url: "https://minecraft.fandom.com/wiki/Minecraft_Wiki",
            }
        }    
    },
    "Soundboard": {
        settings: {
            icon: "icon_spoty",
            minSize: {
                x: false,
                y: false
            },
            barColor: "#000",
            textColor: "#FFF",
            admin: false,
            content: "soundboard"
        }    
    },
    "Logs": {
        settings: {
            icon: "icon_logs",
            minSize: {
                x: 480,
                y: false
            },
            barColor: "#000",
            textColor: false,
            admin: false,
            content: "logs"
        }    
    }
});