# Bienvenue sur Pokedia !

## 1. Guide d'installation

Une fois le projet cloner depuis le repository git :
```bash
git clone https://github.com/MeghanTheCat/pok-dex.git
```

Installer les dépendances :
```bash
npm install
```

Configurer le projet :

Génération d'un token API :
```bash
node keygen.js
```

Copier le fichier '.env.example' en '.env' et remplir avec la clé API obtenue :
```
TOKEN_SECRET="aa12...21aa"
```

Démarrer la base de donnée avec un terminal depuis le dossier racine de MongoDB :
```bash
.\bin\mongod.exe --dbpath data
```

Démarrer le serveur :
```bash
npm run start
```

Lancer un serveur local (Xamp ou intégration VS CODE "Go Live")

Peupler la base de donnée pokémons :
* Se rendre sur la page : [BASE_URL]/front/page/fetch.html
* Attendre quelques secondes (vérifiable sur la console) jusqu'à la fin de l'importation.

Profitez désormait du site !

## 2. Les fonctionnalités

Sur le site, il est possible (hors connexion) de voir l'ensemble des pokémons et de cliquer sur leurs images/nom pour avoir d'amples informations.

Lors de la connexion (bouton Sign in), un formulaire est présenté pour créer son compte. Il faut alors remplir chaque champs puis créer son compte. Il vous sera alors proposé directement de créer votre trainer.

Si vous vous reconnectez, il faut cliquer sur "Already register? Sign in!"

Si vous avez déjà un trainer, vous pouvez directement accéder à votre Pokédex!

### Comment naviguer dans le site ?

Non connecté, vous aurez accès à l'ensemble des pokémons et leurs type. La possibilité de rechercher par type en cliquant sur un type présent dans les cartes de pokémons. De plus, vous pouvez rechercher directement par nom dans la barre de recherche.

Une fois connecté, en cliquant sur les images des pokémons et/ou noms, vous aurez accès à l'ensemble de leurs informations.

Le bouton trainer en haut à droite permet de modifier les infos de son trainer et voir vos statistiques, et il y a la possibilité de se déconnecter.


## 3. L'API

Voici la liste des routes API créées. POKEDEX_URL étant la base url du site.

### Authentification

Créer un administrateur. Prends en paramètre firstname (string), lastname (string), email (string), password (string) et username (string).
```bash
POST {{POKEDEX_URL}}/users/admin
```

Se connecter au site. Prends en paramètre email (string) et password (string).
```bash
POST {{POKEDEX_URL}}/users/login
```

Créer un compte. Prends en paramètre firstname (string), lastname (string), email (string), password (string) et username (string).
```bash
POST {{POKEDEX_URL}}/users/register
```

### Utilisateurs

Récupère tous les utilisateurs.
```bash
GET {{POKEDEX_URL}}/users
```

Récupère un utilisateur avec son ID.
```bash
GET {{POKEDEX_URL}}/users/{{ID}}
```

Récupère un utilisateur avec son email.
```bash
GET {{POKEDEX_URL}}/users/{{email}}
```

Met à jour un utilisateur. Prends un ou plusieurs paramètres firstname (string), lastname (string), email (string) et/ou password (string).
```bash
PUT {{POKEDEX_URL}}/users/{{ID}}
```

Supprime un utilisateur avec son ID.
```bash
DEL {{POKEDEX_URL}}/users/{{ID}}
```

### Pokémons

Récupère tous les types de pokémons.
```bash
GET {{POKEDEX_URL}}/api/pkmn/types
```

Ajoute un pokémon. Prends en paramètre name (string), types (array), description (string), region (array avec regionName et regionPokedexNumber), imagePath (string), height (int), weight (int), soundPath (string).
```bash
GET {{POKEDEX_URL}}/api/pkmn
``` 

Récupère tous les pokémons.
```bash
GET {{POKEDEX_URL}}/api/pkmn/all
```

Récupère un pokémon avec son ID.
```bash
GET {{POKEDEX_URL}}/api/pkmn?id={{ID}}
```

Récupère un pokémon avec son nom.
```bash
GET {{POKEDEX_URL}}/api/pkmn?name={{NAME}}
```

Recherche un pokémon. Ça peut être avec son nom, son type...
```bash
# Recherche un pokémon avec un type eau et un type feu 
GET {{POKEDEX_URL}}/api/pkmn/search?typeOne=water&typeTwo=water

# Recherche avec une partie d'un nom
GET {{POKEDEX_URL}}/api/pkmn/search?partialName=bulbi
```

Ajoute un région à un pokémon. Prends en paramètre regionName (string) et regionPokedexNumber (int)
```bash
POST {{POKEDEX_URL}}/api/pkmn/region?id={{ID_PKMN}}
```

Supprime un pokémon.
```bash
DEL {{POKEDEX_URL}}/api/pkmn/?id={{ID}}
```

Met à jour un pokémon. Peut prendre en paramètres les mêmes que lors de sa création.
```bash
PUT {{POKEDEX_URL}}/api/pkmn?id={{ID}}&{{UPDATE_PARAM}}
```

### Trainer

Récupère un trainer avec son ID.
```bash
GET {{POKEDEX_URL}}/trainer?id={{ID}}
```

Ajoute un trainer. Prends en paramètre username (string), imagePath (string), trainerName (string).
```bash
POST {{POKEDEX_URL}}/trainer
```

Recherche un trainer avec son username.
```bash
GET {{POKEDEX_URL}}/trainer/search?username={{USERNAME}}
```

Récupère tous les trainers.
```bash
GET {{POKEDEX_URL}}/trainer
```

Met à jour un trainer. Peut prendre en paramètre l'username (string).
```bash
PUT {{POKEDEX_URL}}/trainer/{{ID}}
```

Supprime un trainer.
```bash
DEL {{POKEDEX_URL}}/trainer/{{ID}}
```

Attrape un pokémon (ajoute dans les infos du trainer). Prends en paramètre le trainerID (string) et le pokemonID (string).
```bash
POST {{POKEDEX_URL}}/trainer/mark
```

Voit un pokémon (ajoute dans les infos du trainer). Prends en paramètre le trainerID (string) et le pokemonID (string).
```bash
POST {{POKEDEX_URL}}/trainer/see
```

---
## Amusez-vous bien !