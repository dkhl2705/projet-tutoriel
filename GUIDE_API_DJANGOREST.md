# Guide Django REST pour VacciSmart

Ce projet contient maintenant :

- un frontend React dans `vaccismart/`
- un backend Django REST dans `backend/`
- une authentification fonctionnelle pour :
  - creation de compte
  - connexion
- une base de modeles/API pour :
  - utilisateurs
  - enfants
  - hopitaux
  - catalogue de vaccins
  - dossiers de vaccination
  - rendez-vous
  - rappels

## 1. Structure du projet

```text
projet-tutoriel/
├─ backend/
│  ├─ accounts/
│  ├─ medical/
│  ├─ config/
│  ├─ manage.py
│  └─ requirements.txt
├─ vaccismart/
│  ├─ src/
│  └─ package.json
└─ GUIDE_API_DJANGOREST.md
```

## 2. Backend installe

Le backend utilise :

- Django
- Django REST Framework
- Simple JWT
- django-cors-headers
- SQLite par defaut

## 3. Lancer le backend pas a pas

Placez-vous a la racine du projet :

```powershell
cd d:\projet\projet-IUT\projet-tutoriel
```

Allez dans le backend :

```powershell
cd backend
```

Installez les dependances si besoin :

```powershell
pip install -r requirements.txt
```

Copiez les variables d'environnement si vous voulez personnaliser la config :

```powershell
copy .env.example .env
```

Appliquez les migrations :

```powershell
python manage.py migrate
```

Lancez le serveur :

```powershell
python manage.py runserver
```

Le backend sera disponible sur :

```text
http://127.0.0.1:8000/
```

## 4. Lancer le frontend pas a pas

Dans un autre terminal :

```powershell
cd d:\projet\projet-IUT\projet-tutoriel\vaccismart
```

Installez les dependances si besoin :

```powershell
npm install
```

Vous pouvez copier le fichier d'exemple :

```powershell
copy .env.example .env
```

Lancez React :

```powershell
npm start
```

Le frontend sera disponible sur :

```text
http://localhost:3000/
```

## 5. Variables d'environnement

### Backend

Fichier : `backend/.env.example`

```env
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend

Fichier : `vaccismart/.env.example`

```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

## 6. Authentification disponible

### Inscription

Endpoint :

```text
POST /api/auth/register/
```

Exemple parent :

```json
{
  "email": "parent@example.com",
  "password": "secret123",
  "confirm_password": "secret123",
  "first_name": "Amina",
  "last_name": "Mbarga",
  "role": "parent",
  "phone": "+237600000000",
  "city": "Douala",
  "profession": "Commercante",
  "hospital_code": "",
  "child": {
    "first_name": "Sophie",
    "last_name": "Mbarga",
    "birth_date": "2024-01-10",
    "gender": "fille",
    "blood_type": "O+",
    "allergies": "",
    "notes": ""
  }
}
```

Exemple medecin :

```json
{
  "email": "medecin@example.com",
  "password": "secret123",
  "confirm_password": "secret123",
  "first_name": "Paul",
  "last_name": "Kamga",
  "role": "medecin",
  "phone": "+237611111111",
  "city": "Yaounde",
  "profession": "Pediatre",
  "hospital_code": "HOPITAL-CENTRAL-001"
}
```

### Login

Endpoint :

```text
POST /api/auth/login/
```

Payload :

```json
{
  "email": "parent@example.com",
  "password": "secret123"
}
```

### Profil courant

Endpoint :

```text
GET /api/auth/me/
```

Header :

```text
Authorization: Bearer <access_token>
```

## 7. API metier de base

Toutes les routes suivantes sont sous `http://127.0.0.1:8000/api/`

- `hospitals/`
- `children/`
- `vaccines/`
- `vaccinations/`
- `appointments/`
- `reminders/`

Ce sont des routes REST de base via `ModelViewSet`.

## 8. Ce qui est deja branche dans le frontend

Le frontend React utilise maintenant l'API pour :

- inscrire un parent
- inscrire un medecin
- connecter un utilisateur
- conserver la session dans `localStorage`

Le reste de l'interface reste en mode base/demo pour ne pas casser le projet actuel.

## 9. Fichiers importants a connaitre

Backend :

- `backend/config/settings.py`
- `backend/config/urls.py`
- `backend/accounts/models.py`
- `backend/accounts/serializers.py`
- `backend/accounts/views.py`
- `backend/medical/models.py`
- `backend/medical/views.py`

Frontend :

- `vaccismart/src/context/AppContext.jsx`
- `vaccismart/src/pages/RegisterPage.jsx`
- `vaccismart/src/pages/LoginPage.jsx`
- `vaccismart/src/services/api.js`

## 10. Tests deja verifies

Backend :

```powershell
cd backend
python manage.py test
```

Frontend :

```powershell
cd vaccismart
npm run build
```

## 11. Prochaines etapes conseillees

Si vous voulez continuer proprement, je vous conseille cet ordre :

1. brancher `children/` sur le dashboard parent
2. brancher `vaccinations/` sur les pages vaccins/calendrier
3. brancher `hospitals/` sur la page hopitaux
4. brancher `appointments/` pour la prise de rendez-vous
5. brancher `reminders/` pour les notifications automatiques
6. proteger les actions medecin avec des permissions plus fines

## 12. Resume simple

Vous avez maintenant :

- un backend Django REST complet de base
- une authentification inscription/login fonctionnelle
- un frontend deja branche sur cette auth
- un socle de modeles pour gerer toutes les applications plus tard
