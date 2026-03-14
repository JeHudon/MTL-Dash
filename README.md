# 🏒 MTL Dash

Tableau de bord des Canadiens de Montréal — scores en direct, statistiques, roster, et plus

## 🚀 Technologies

- **React** + **Vite**
- **Bulma** (CSS framework)
- **React Router** (navigation)
- **NHL API** (données en temps réel)

## ⚙️ Installation
```bash
# Cloner le projet
git clone https://github.com/jehudon/mtl-dash.git
cd mtl-dash

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Compiler pour production
npm run build
```

## 🔌 API

Toutes les données proviennent de l'API publique de la LNH :
```
https://api-web.nhle.com/v1/
```

Les appels sont proxifiés via Vite pour éviter les problèmes de CORS :
```js
// vite.config.js
server: {
    proxy: {
        '/api': {
            target: 'https://api-web.nhle.com/v1',
            rewrite: (path) => path.replace(/^\/api/, '')
        }
    }
}
```
