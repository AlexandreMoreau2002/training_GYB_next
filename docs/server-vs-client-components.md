# Server Components vs Client Components

Guide pratique pour comprendre la différence, avec des exemples concrets du projet Summit.

---

## Le problème avec les SPA traditionnelles

En **Vue.js / Nuxt (mode SPA)** ou **React classique**, tout le code s'exécute dans le navigateur :

```
Utilisateur → Serveur envoie HTML vide + gros bundle JS → Navigateur exécute tout → Affichage
```

**Problèmes :**
- Le navigateur télécharge TOUT le JavaScript (même ce dont il n'a pas besoin)
- Le contenu n'est visible qu'après exécution du JS (mauvais pour le SEO)
- Les appels API se font depuis le navigateur (expose les tokens, latence)

---

## La révolution Server Components

Avec les **React Server Components (RSC)** de Next.js 13+, on peut choisir OÙ s'exécute chaque composant :

```
                    ┌─────────────────────────────────────────┐
                    │              SERVEUR                    │
                    │                                         │
                    │  ┌─────────────────────────────────┐   │
                    │  │     Server Components           │   │
                    │  │     - Accès direct à l'API      │   │
                    │  │     - Pas de JS envoyé          │   │
                    │  │     - Génère du HTML            │   │
                    │  └─────────────────────────────────┘   │
                    │                  │                      │
                    │                  │ HTML + données       │
                    │                  ▼                      │
                    └─────────────────────────────────────────┘
                                       │
                                       │ HTML pré-rendu + petit bundle JS
                                       ▼
                    ┌─────────────────────────────────────────┐
                    │             NAVIGATEUR                  │
                    │                                         │
                    │  ┌─────────────────────────────────┐   │
                    │  │     Client Components           │   │
                    │  │     - useState, useEffect       │   │
                    │  │     - onClick, onChange         │   │
                    │  │     - localStorage, window      │   │
                    │  └─────────────────────────────────┘   │
                    │                                         │
                    └─────────────────────────────────────────┘
```

---

## La règle d'or

| Tu as besoin de... | Utilise |
|-------------------|---------|
| Afficher des données depuis l'API | **Server Component** |
| `useState`, `useEffect` | **Client Component** |
| `onClick`, `onChange`, événements | **Client Component** |
| `localStorage`, `window`, `document` | **Client Component** |
| Données sensibles (clés API, tokens serveur) | **Server Component** |

**Par défaut, tout est Server Component.** Tu ajoutes `'use client'` uniquement quand c'est nécessaire.

---

## Exemples concrets du projet Summit

### Exemple 1 : Page liste des catégories (Server Component)

```tsx
// app/[locale]/categories/page.tsx
// PAS de 'use client' → C'est un Server Component

import { categoriesService } from '@/lib/api';

export default async function CategoriesPage() {
  // Cet appel API s'exécute sur le SERVEUR
  // Le navigateur ne voit jamais ce code
  const categories = await categoriesService.getAll();

  // Le HTML est généré sur le serveur et envoyé au navigateur
  return (
    <div>
      {categories.map((cat) => (
        <div key={cat.id}>{cat.name}</div>
      ))}
    </div>
  );
}
```

**Ce qui se passe :**
1. L'utilisateur demande `/categories`
2. Le serveur Next.js exécute la fonction
3. L'appel API se fait serveur → backend Django (rapide, même réseau)
4. Le serveur génère le HTML avec les données
5. Le navigateur reçoit du HTML prêt à afficher
6. **Aucun JavaScript n'est envoyé pour ce composant**

**Avantages :**
- Chargement ultra-rapide (HTML prêt)
- SEO parfait (Google voit le contenu)
- Pas de "flash" de chargement
- Le token API peut rester secret côté serveur

---

### Exemple 2 : Formulaire de commentaire (Client Component)

```tsx
// components/comments/CommentForm.tsx
'use client'; // ← Obligatoire car on utilise useState

import { useState } from 'react';

export function CommentForm({ articleSlug }: { articleSlug: string }) {
  // useState = interactivité = Client Component obligatoire
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ← événement navigateur
    setIsSubmitting(true);

    await commentsService.create(articleSlug, { content });

    setContent('');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}> {/* ← événement = client */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)} {/* ← événement = client */}
      />
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

**Ce qui se passe :**
1. Le serveur envoie le HTML du formulaire + le JavaScript du composant
2. Le navigateur "hydrate" le composant (le rend interactif)
3. L'utilisateur tape → `onChange` → `useState` met à jour
4. L'utilisateur soumet → `onSubmit` → appel API depuis le navigateur

---

### Exemple 3 : Le pattern "Wrapper Client" (le plus important !)

**Problème :** La page article est un Server Component (pour le SEO), mais les commentaires doivent être rafraîchis après ajout (interactivité).

**Solution :** Créer une "frontière" entre Server et Client.

```
┌─────────────────────────────────────────────────────────────┐
│  ArticleDetailPage (SERVER)                                 │
│  - Fetch l'article côté serveur                            │
│  - Génère le HTML de l'article                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CommentsSection (CLIENT)                           │   │
│  │  - Fetch les commentaires côté client               │   │
│  │  - Gère le state des commentaires                   │   │
│  │  - Rafraîchit après ajout                           │   │
│  │                                                     │   │
│  │  ┌─────────────────┐  ┌─────────────────┐          │   │
│  │  │ CommentList     │  │ CommentForm     │          │   │
│  │  │ (CLIENT)        │  │ (CLIENT)        │          │   │
│  │  └─────────────────┘  └─────────────────┘          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Page Server Component :**
```tsx
// app/[locale]/articles/[slug]/page.tsx
// PAS de 'use client' → Server Component

import { CommentsSection } from '@/components/comments/CommentsSection';

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;

  // Fetch côté serveur (rapide, SEO)
  const article = await articlesService.getBySlug(slug);

  return (
    <div>
      {/* Contenu statique rendu côté serveur */}
      <h1>{article.title}</h1>
      <p>{article.content}</p>

      {/* Partie interactive déléguée à un Client Component */}
      <CommentsSection articleSlug={slug} articleId={article.id} />
    </div>
  );
}
```

**Wrapper Client Component :**
```tsx
// components/comments/CommentsSection.tsx
'use client'; // ← Client car useState + useEffect

import { useState, useEffect } from 'react';

export function CommentsSection({ articleSlug, articleId }) {
  const [comments, setComments] = useState([]);

  // Fetch côté CLIENT (pour pouvoir rafraîchir)
  const fetchComments = async () => {
    const data = await commentsService.getByArticle(articleSlug);
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [articleSlug]);

  // Callback passé au formulaire pour rafraîchir après ajout
  const handleCommentCreated = () => {
    fetchComments(); // Re-fetch la liste !
  };

  return (
    <>
      <CommentList comments={comments} />
      <CommentForm
        articleSlug={articleSlug}
        onSuccess={handleCommentCreated}
      />
    </>
  );
}
```

**Pourquoi ce pattern ?**
- L'article (le gros du contenu) est rendu côté serveur → SEO + performance
- Les commentaires sont gérés côté client → interactivité
- On minimise la partie "Client" au strict nécessaire

---

### Exemple 4 : Affichage conditionnel selon l'utilisateur

**Problème :** Afficher le bouton "Modifier" seulement si l'utilisateur est l'auteur.

Le store Zustand (état global) ne fonctionne que côté client (il utilise localStorage).

```tsx
// components/articles/ArticleActions.tsx
'use client'; // ← Client car useAuthStore utilise localStorage

import { useAuthStore } from '@/stores';

export function ArticleActions({ authorId }: { authorId: number }) {
  const { user } = useAuthStore(); // ← Hook = Client obligatoire

  // Pas connecté ou pas l'auteur ? On n'affiche rien
  if (!user || user.id !== authorId) {
    return null;
  }

  return <Button>Modifier</Button>;
}
```

**Utilisation dans un Server Component :**
```tsx
// app/[locale]/articles/[slug]/page.tsx (SERVER)

export default async function ArticleDetailPage({ params }) {
  const article = await articlesService.getBySlug(params.slug);

  return (
    <div>
      <h1>{article.title}</h1>

      {/* Le Server Component passe juste les données */}
      {/* Le Client Component décide quoi afficher */}
      <ArticleActions authorId={article.author.id} />
    </div>
  );
}
```

---

## Arbre de décision

```
Est-ce que j'ai besoin de...

useState / useEffect ?
    │
    ├── OUI → 'use client'
    │
    └── NON
         │
         ├── onClick / onChange / onSubmit ?
         │       │
         │       ├── OUI → 'use client'
         │       │
         │       └── NON
         │            │
         │            ├── localStorage / window / document ?
         │            │       │
         │            │       ├── OUI → 'use client'
         │            │       │
         │            │       └── NON
         │            │            │
         │            │            └── useTranslations (client) vs getTranslations (server) ?
         │            │                    │
         │            │                    ├── useTranslations → 'use client'
         │            │                    │
         │            │                    └── getTranslations → Server Component ✓
         │            │
         │            └── Juste afficher des données ? → Server Component ✓
         │
         └── Fetch des données ? → Server Component ✓ (de préférence)
```

---

## Comparatif côte à côte

| Aspect | Server Component | Client Component |
|--------|------------------|------------------|
| **Directive** | Rien (défaut) | `'use client'` en haut |
| **Exécution** | Serveur uniquement | Serveur + Navigateur |
| **JavaScript envoyé** | 0 Ko | Oui (bundle) |
| **Peut utiliser** | `async/await`, accès DB, secrets | `useState`, `useEffect`, événements |
| **Ne peut PAS utiliser** | `useState`, `useEffect`, `onClick` | Accès direct DB, secrets serveur |
| **SEO** | Excellent | Dépend du contenu |
| **Traductions** | `getTranslations()` | `useTranslations()` |

---

## Les erreurs courantes

### Erreur 1 : useState dans un Server Component

```tsx
// ❌ ERREUR : pas de 'use client' mais useState
export default function Page() {
  const [count, setCount] = useState(0); // 💥 Erreur !
  return <div>{count}</div>;
}
```

**Message d'erreur :**
```
Error: useState only works in Client Components. Add the "use client" directive.
```

**Solution :**
```tsx
'use client'; // ✅ Ajouter la directive

export default function Page() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

---

### Erreur 2 : Async dans un Client Component

```tsx
'use client';

// ❌ ERREUR : async + 'use client' ne marche pas pour les composants
export default async function Page() {
  const data = await fetch('/api/data'); // 💥 Erreur !
  return <div>{data}</div>;
}
```

**Solution :** Utiliser useEffect ou enlever 'use client'

```tsx
'use client';

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData);
  }, []);

  return <div>{data}</div>;
}
```

---

### Erreur 3 : Importer un Client Component avec des props serveur complexes

```tsx
// ❌ ERREUR : passer une fonction à un Client Component
export default async function Page() {
  const handleClick = () => console.log('click'); // Fonction serveur

  return <ClientButton onClick={handleClick} />; // 💥 Les fonctions ne sont pas sérialisables
}
```

**Solution :** Définir la logique dans le Client Component

```tsx
// ✅ Le Client Component définit sa propre logique
'use client';

export function ClientButton() {
  const handleClick = () => console.log('click');
  return <button onClick={handleClick}>Click</button>;
}
```

---

## Résumé mental

Pense à ça comme un **restaurant** :

- **Server Components** = La cuisine
  - Prépare les plats (données)
  - Le client ne voit pas comment c'est fait
  - Accès aux ingrédients secrets (API keys, DB)

- **Client Components** = La salle
  - Interaction avec le client
  - Le client peut toucher, cliquer
  - Visible et interactif

- **Le serveur** = Le passe-plat
  - Transfère les plats préparés vers la salle
  - Les données passent de Server → Client via les props

---

## Pattern à retenir

```tsx
// Page = Server Component (fetch les données)
export default async function Page() {
  const data = await fetchData(); // Serveur

  return (
    <div>
      {/* Contenu statique = Server */}
      <h1>{data.title}</h1>

      {/* Partie interactive = Client */}
      <InteractiveSection data={data} />
    </div>
  );
}

// Composant interactif = Client Component
'use client';
function InteractiveSection({ data }) {
  const [state, setState] = useState(data);
  // ... interactivité
}
```

**C'est le pattern utilisé partout dans Summit !**
