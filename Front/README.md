# D3 Front

Ceci est la partie **front-end** du bot D3. 
Fait avec vue.js, le framework du DOM.

## Setup du Project 

```sh
npm install
```

### Compile pour le developpement 

```sh
npm run dev
```

### Compile pour la production

```sh
npm run build
```

## Changer de répertoire (pour des essais)

Aller dans vite.config.js, ligne 11, et changer le path de l'objet URL : 

```js
alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
}
```

puis aller dans l'index.html et chager la ligne 11, le chemin du script main.js

```html
<script type="module" src="/testWindows/main.js"></script>
```