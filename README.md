# Summit - Frontend Next.js

Guide complet pour comprendre le frontend de Summit, développé avec **Next.js 15 (App Router)**.
Ce document explique les concepts clés, surtout si tu viens de l'univers Vue.js / Nuxt.

## Table des matières

1. [Comparatif Rapide : Next.js vs Nuxt](#comparatif-rapide--nextjs-vs-nuxt)
2. [Structure du Projet](#structure-du-projet)
3. [Concepts Clés Expliqués](#concepts-clés-expliqués)
4. [Architecture Technique](#architecture-technique)
5. [Pages Implémentées](#pages-implémentées)
6. [Patterns et Procédures Clés](#patterns-et-procédures-clés)
7. [Services API](#services-api)
8. [Lancer le projet](#lancer-le-projet)
9. [Résumé de ce qui a été fait](#résumé-de-ce-qui-a-été-fait)

---

## Comparatif Rapide : Next.js vs Nuxt

Si tu connais Nuxt, voici les équivalences pour t'y retrouver :

| Concept | Dans Nuxt (Vue) | Dans Next.js (React) | Explication |
|---------|----------------|----------------------|-------------|
| **Dossier Pages** | `pages/` | `app/` (App Router) | Dans Next.js 13+, on utilise le dossier `app`. Chaque dossier devient une route. |
| **Fichier Page** | `index.vue` ou `[id].vue` | `page.tsx` | Le fichier qui rend la route s'appelle toujours `page.tsx`. |
| **Layouts** | `layouts/default.vue` | `layout.tsx` | Les layouts s'imbriquent. Le `layout.tsx` racine enveloppe tout. |
| **Data Fetching** | `useFetch` / `useAsyncData` | `await fetch()` ou `async/await` | Dans les composants serveur, on fait juste `await maFonction()`. Pas de hook nécessaire ! |
| **Composants** | `<script setup>` (Client + Server) | **Server Components** (par défaut) | Par défaut, tout est rendu sur le serveur (RSC). Pour l'interactivité (click, state), on ajoute `'use client'`. |
| **Store** | Pinia | Zustand | On utilise Zustand pour gérer l'état global (auth, etc.). C'est très similaire à Pinia (léger et sans boilerplate). |
| **I18n** | `@nuxtjs/i18n` | `next-intl` | Gestion des traductions avec routing localisé (`/[locale]/...`). |

---

## Structure du Projet

```bash
frontend/
├── app/                        # Le cœur de l'app (App Router)
│   ├── [locale]/               # Route dynamique pour la langue (fr, en)
│   │   ├── layout.tsx          # Layout principal (Header + Footer)
│   │   ├── page.tsx            # Page d'accueil (/)
│   │   ├── risk/               # Page des risques (ex: /risk)
│   │   │   └── page.tsx
│   │   ├── auth/               # Routes d'authentification
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   └── ...
│   ├── layout.tsx              # Layout racine (HTML + Body)
│   └── globals.css             # Styles globaux (Tailwind)
├── components/                 # Composants réutilisables
│   ├── ui/                     # Petits éléménts (Button, Input...)
│   ├── layout/                 # Gros blocs (Header, Footer)
│   └── dom/                    # Composants métier (ArticleCard...)
├── lib/                        # Logique métier pure
│   ├── api/                    # Appels API vers le backend Django
│   └── utils.ts                # Fonctions utilitaires
├── messages/                   # Fichiers de traduction
│   ├── fr.json
│   └── en.json
├── stores/                     # Gestion d'état (Zustand)
│   └── auth.store.ts
└── middleware.ts               # Intercepte les requêtes (Routing I18n)
```

---

## Concepts Clés Expliqués

### 1. Server Components vs Client Components

C'est LE concept le plus important de Next.js moderne.

*   **Server Components (Défaut)** :
    *   Exécutés **uniquement sur le serveur**.
    *   Peuvent faire des `await db.query()` ou des appels API directs.
    *   N'envoient **pas de JavaScript** au navigateur (super rapide !).
    *   Mais : pas de `useState`, `useEffect`, `onClick`.
    *   *Analogie Nuxt* : Comme le code dans `asyncData` ou `nuxtServerInit`, mais pour tout le composant.

*   **Client Components (`'use client'`)** :
    *   Marqués par `'use client'` en haut du fichier.
    *   Se comportent comme des composants React/Vue classiques.
    *   Ont accès au state, aux effets, aux événements navigateur.
    *   *Analogie Nuxt* : Composants Vue normaux.

**Exemple concret dans ce projet :**
*   `app/[locale]/articles/page.tsx` est un **Server Component**. Il récupère les articles via l'API et génère le HTML.
*   `components/ArticleFilters.tsx` est un **Client Component** car il a besoin de gérer l'input de recherche et le state local.

### 2. Le Routing Dynamique (App Router)

Le système de fichiers définit les URLs.

*   `app/[locale]/page.tsx` → `/fr` ou `/en`
*   `app/[locale]/articles/page.tsx` → `/fr/articles`
*   `app/[locale]/articles/[slug]/page.tsx` → `/fr/articles/mon-super-article`

Le dossier `[slug]` avec des crochets indique un paramètre dynamique. On le récupère dans les `params` de la page.

```typescript
// Dans page.tsx
export default async function DetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  // ...
}
```

### 3. Data Fetching (Récupération de données)

Oublie les `useEffect` pour charger des données. Dans les **Server Components**, on fait juste de l'asynchrone standard.

**Nuxt (Vue) :**
```javascript
const { data } = await useFetch('/api/articles')
```

**Next.js (React Server Component) :**
```typescript
// On appelle direct notre service
const articles = await articlesService.getAll();
```
C'est tout. Le composant est `async`, il attend la donnée, et envoie le HTML rempli.

### 4. Internationalisation (I18n)

On utilise `next-intl`.
*   Le middleware (`middleware.ts`) détecte la langue du navigateur et redirige vers `/fr/...` ou `/en/...`.
*   Les fichiers JSON dans `messages/` contiennent les textes.
*   Dans un Server Component : `const t = await getTranslations('home');`
*   Dans un Client Component : `const t = useTranslations('home');`

### 5. Gestion d'État (Zustand)

Pour l'authentification (savoir si l'utilisateur est connecté), on utilise **Zustand**.
C'est l'équivalent de **Pinia**.

*   `stores/auth.store.ts` définit le store.
*   `useAuthStore()` permet de lire/écrire l'état dans n'importe quel composant client.
*   On utilise `persist` pour que ça reste stocké dans le `localStorage`.

### 6. Administration

Une interface d'administration basique est disponible pour les utilisateurs ayant le rôle "Staff" (is_staff=true).

*   **Gestion des utilisateurs** : `/admin/users`
    *   Accessible uniquement aux admins.
    *   Liste tous les utilisateurs inscrits avec leur rôle.
    *   *Note technique* : C'est une **Client Page** car elle doit utiliser le token stocké dans le navigateur pour s'authentifier auprès de l'API.

---

## Architecture Technique

### Design System
*   **Tailwind CSS v4** : Pour le styling utilitaire.
*   **Tokens CSS** : Définis dans `globals.css` (`--color-primary`, etc.) pour une maintenance facile.
*   **Composants UI** : Base solide dans `components/ui/` (Button, Input...). C'est notre propre mini-librairie de composants.

### API Layer
Tout ce qui touche au backend est centralisé dans `lib/api/`.
On ne fait **jamais** de `fetch` directement dans les composants. On passe par nos services :
*   `authService.login(...)`
*   `articlesService.getAll(...)`

Cela permet de gérer proprement :
*   L'injection automatique du Token JWT.
*   Le rafraîchissement du token (refresh token).
*   La gestion centralisée des erreurs.

---

## Pages Implémentées

| Route | Description | Type |
|-------|-------------|------|
| `/` | Page d'accueil (hero, articles featured, catégories) | Server |
| `/articles` | Liste des articles avec filtres et recherche | Server + Client |
| `/articles/[slug]` | Détail article avec commentaires | Server + Client |
| `/articles/new` | Création d'article | Client |
| `/articles/[slug]/edit` | Édition d'article | Server + Client |
| `/categories` | Liste des catégories | Server |
| `/categories/[slug]` | Articles d'une catégorie | Server |
| `/auth/login` | Page de connexion | Client |
| `/auth/logout` | Page de déconnexion | Server |
| `/profile` | Profil utilisateur | Client |
| `/admin/users` | Gestion des utilisateurs (admin) | Client |

---

## Patterns et Procédures Clés

### Pattern 1 : Server Component avec données

Quand tu veux afficher des données depuis l'API, utilise un **Server Component** (c'est le défaut).

```tsx
// app/[locale]/categories/page.tsx
import { categoriesService } from '@/lib/api';

export default async function CategoriesPage() {
  // Appel API direct, pas de useEffect !
  const categories = await categoriesService.getAll();

  return (
    <div>
      {categories.map((cat) => (
        <div key={cat.id}>{cat.name}</div>
      ))}
    </div>
  );
}
```

**Pourquoi ?** Le HTML est généré sur le serveur, envoyé au navigateur. Rapide, SEO-friendly.

---

### Pattern 2 : Client Component pour l'interactivité

Dès que tu as besoin de `useState`, `onClick`, ou accès au `localStorage`, ajoute `'use client'`.

```tsx
// components/comments/CommentForm.tsx
'use client';

import { useState } from 'react';

export function CommentForm() {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Appel API...
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

---

### Pattern 3 : Wrapper Client pour données dynamiques

Quand tu veux **fetch + state** dans une page Server Component, crée un wrapper client.

**Problème** : La page article est un Server Component, mais les commentaires doivent être rafraîchis après ajout.

**Solution** : Créer `CommentsSection` (client) qui gère le fetch et le state.

```tsx
// components/comments/CommentsSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { commentsService } from '@/lib/api';

export function CommentsSection({ articleSlug }: { articleSlug: string }) {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const data = await commentsService.getByArticle(articleSlug);
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [articleSlug]);

  const handleCommentCreated = () => {
    fetchComments(); // Rafraîchit la liste
  };

  return (
    <>
      <CommentList comments={comments} />
      <CommentForm onSuccess={handleCommentCreated} />
    </>
  );
}
```

Puis dans la page Server Component :
```tsx
// app/[locale]/articles/[slug]/page.tsx
import { CommentsSection } from '@/components/comments/CommentsSection';

export default async function ArticlePage({ params }) {
  const article = await articlesService.getBySlug(params.slug);

  return (
    <div>
      <h1>{article.title}</h1>
      <CommentsSection articleSlug={params.slug} />
    </div>
  );
}
```

---

### Pattern 4 : Formulaire réutilisable (Create + Edit)

Un seul composant pour créer ET éditer, grâce à une prop optionnelle.

```tsx
// components/articles/ArticleForm.tsx
'use client';

interface ArticleFormProps {
  article?: Article;  // Si présent = mode édition
  locale: string;
}

export function ArticleForm({ article, locale }: ArticleFormProps) {
  const isEditing = !!article;

  // Pré-remplir si édition
  const [title, setTitle] = useState(article?.title || '');

  const handleSubmit = async (e: React.FormEvent) => {
    if (isEditing) {
      await articlesService.update(article.slug, data);
    } else {
      await articlesService.create(data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button>{isEditing ? 'Modifier' : 'Créer'}</button>
    </form>
  );
}
```

Usage :
```tsx
// Page création
<ArticleForm locale={locale} />

// Page édition
<ArticleForm article={article} locale={locale} />
```

---

### Pattern 5 : Gestion des erreurs API

Le client API (`lib/api/client.ts`) lance une `ApiError` avec des helpers.

```tsx
import { ApiError } from '@/lib/api/client';

try {
  await articlesService.create(data);
} catch (err) {
  if (err instanceof ApiError) {
    if (err.isValidationError) {
      // Erreurs de validation (400)
      const fieldErrors = err.getFieldErrors();
      // { title: ['Ce champ est requis'], ... }
    } else if (err.isUnauthorized) {
      // Non connecté (401)
    } else if (err.isForbidden) {
      // Pas les droits (403)
    }
  }
}
```

---

### Pattern 6 : Affichage conditionnel selon l'utilisateur

Utilise le store Zustand pour vérifier si l'utilisateur est connecté.

```tsx
'use client';

import { useAuthStore } from '@/stores';

export function ArticleActions({ authorId }: { authorId: number }) {
  const { user } = useAuthStore();

  // Bouton visible uniquement pour l'auteur ou un admin
  if (!user || (user.id !== authorId && !user.is_staff)) {
    return null;
  }

  return <Button>Modifier</Button>;
}
```

---

### Pattern 7 : Traductions (i18n)

**Dans un Server Component :**
```tsx
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('articles');
  return <h1>{t('title')}</h1>;
}
```

**Dans un Client Component :**
```tsx
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('articles');
  return <h1>{t('title')}</h1>;
}
```

**Avec paramètres :**
```tsx
// messages/fr.json
{ "comments": { "title": "Commentaires ({count})" } }

// Usage
t('title', { count: 5 }) // "Commentaires (5)"
```

---

## Services API

Tous les appels API sont centralisés dans `lib/api/services/`.

| Service | Méthodes | Description |
|---------|----------|-------------|
| `articlesService` | `getAll`, `getBySlug`, `create`, `update`, `delete` | CRUD articles |
| `commentsService` | `getByArticle`, `create`, `update`, `delete` | Commentaires nested |
| `categoriesService` | `getAll`, `getBySlug` | Catégories (lecture seule) |
| `tagsService` | `getAll`, `getBySlug` | Tags (lecture seule) |
| `authService` | `login`, `logout`, `refreshToken`, `getMe`, `updateMe` | Authentification |
| `usersService` | `getAll` | Liste users (admin) |

**Exemple d'utilisation :**
```tsx
import { articlesService } from '@/lib/api';

// Liste avec filtres
const response = await articlesService.getAll({
  category: 'bloc',
  search: 'escalade',
  ordering: '-published_at',
  page: 1,
});

// Création
const newArticle = await articlesService.create({
  title: 'Mon article',
  excerpt: 'Résumé...',
  content: 'Contenu...',
  category: 1,  // ID de la catégorie
  tags: [1, 2], // IDs des tags
  status: 'published',
});
```

---

## Lancer le projet

```bash
# Installation
npm install

# Lancer en dev
npm run dev

# Build production
npm run build

# Lancer le build
npm run start

# Linter
npm run lint
npm run lint:fix
```

Rendez-vous sur [http://localhost:3000](http://localhost:3000) !

**Credentials de test :** `admin` / `admin123`

---

## Résumé de ce qui a été fait

1. **Structure App Router** avec routing localisé (`/[locale]/...`)
2. **Design System** : Composants UI réutilisables (Button, Input)
3. **Services API** : Couche d'abstraction pour tous les appels backend
4. **Authentification** : JWT avec Zustand pour le state, localStorage pour la persistance
5. **I18n** : Traductions FR/EN avec next-intl
6. **Pages complètes** :
   - Accueil avec articles featured et catégories
   - Liste articles avec filtres, recherche, tri
   - Détail article avec tags et commentaires
   - Création/édition d'article (formulaire partagé)
   - Liste et détail catégories
   - Login/Logout/Profil
   - Admin users
7. **Système de commentaires** : Fetch, création, réponses nested, rafraîchissement
