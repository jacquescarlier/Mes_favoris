# Mes Favoris (Next.js + React + Node.js + PostgreSQL)

Application web de gestion de favoris internet classés en 10 catégories :
**Internet, SVOD, Linux, Shopping, Achat informatique, Dev, Utilitaires, Presses, Astuces, Divers**.

---

## 1. Préparer PostgreSQL sous Debian 13

Installez PostgreSQL si ce n'est pas déjà fait :

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```

Créez l'utilisateur `lapitou` et la base de données `mes_favoris` :

```bash
sudo -u postgres psql -c "CREATE USER lapitou WITH PASSWORD '#Minouche60180';"
sudo -u postgres psql -c "CREATE DATABASE mes_favoris OWNER lapitou;"
```

*(Note : Le fichier `.env` inclus dans ce projet est déjà préconfiguré avec `lapitou`, `#Minouche60180` encodé en `%23Minouche60180` et la base `mes_favoris`.)*

---

## 2. Installer et lancer le projet en local

Dans le dossier `mes-favoris` :

```bash
# 1. Installer les dépendances Node.js
npm install

# 2. Créer les tables dans PostgreSQL
npx prisma migrate dev --name init

# 3. Insérer les 10 groupes de favoris par défaut
npm run db:seed

# 4. Démarrer le serveur de développement
npm run dev
```

Ouvrez ensuite **http://localhost:3000** dans votre navigateur.

---

## 3. Déployer sur Vercel ou Netlify

1. Poussez ce dossier sur un dépôt **GitHub** (le fichier `.env` est ignoré par `.gitignore`).
2. Créez une base PostgreSQL gratuite sur **Neon.tech** ou **Supabase.com** et copiez son URL de connexion.
3. Importez votre dépôt GitHub dans **Vercel** ou **Netlify** :
   - Ajoutez la variable d'environnement `DATABASE_URL` avec l'URL de votre base cloud.
   - Définissez la commande de build sur : `npx prisma migrate deploy && npm run build`
   - Une fois déployé, lancez `DATABASE_URL="votre_url_cloud" npm run db:seed` depuis votre terminal local pour remplir les 10 catégories sur la base en ligne.

## Pour ajouter une categorie

Si vous avez juste besoin de créer une ou deux catégories rapidement :
1. Ouvrez un terminal à la racine de votre projet.
2. Lancez la commande :bash
npx prisma studio
Utilisez le code avec précaution.
3. Une interface s'ouvre dans votre navigateur (généralement sur http://localhost:5555).
4. Cliquez sur le modèle Category, puis sur le bouton Add record.
5. Saisissez le nom dans le champ name et cliquez sur Save 1 change.