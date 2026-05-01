import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  BookOpen,
  Hammer,
  Zap,
  CheckCircle2,
  ExternalLink,
  Code2,
  Lightbulb,
  Target,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";

// ─── Types ───────────────────────────────────────────────────────────────────
type ModuleType = "lesson" | "exercise" | "project";

interface Step {
  title: string;
  content: string;
  code?: string;
  tip?: string;
}

interface ModuleContent {
  id: string;
  title: string;
  duration: string;
  type: ModuleType;
  intro: string;
  objectives: string[];
  steps: Step[];
  resources?: { label: string; url: string }[];
  nextModule?: string;
  prevModule?: string;
}

const MODULE_PAGE_COPY: Record<Language, {
  learn: string;
  module: string;
  objectives: string;
  resources: string;
  previous: string;
  next: string;
  backToPath: string;
  viewMissions: string;
  lesson: string;
  exercise: string;
  project: string;
}> = {
  fr: {
    learn: "Learn",
    module: "Module",
    objectives: "Objectifs",
    resources: "Ressources complémentaires",
    previous: "Précédent",
    next: "Suivant",
    backToPath: "Retour au parcours",
    viewMissions: "Voir les missions",
    lesson: "Leçon",
    exercise: "Exercice",
    project: "Projet",
  },
  en: {
    learn: "Learn",
    module: "Module",
    objectives: "Objectives",
    resources: "Extra resources",
    previous: "Previous",
    next: "Next",
    backToPath: "Back to path",
    viewMissions: "View missions",
    lesson: "Lesson",
    exercise: "Exercise",
    project: "Project",
  },
  es: {
    learn: "Learn",
    module: "Módulo",
    objectives: "Objetivos",
    resources: "Recursos adicionales",
    previous: "Anterior",
    next: "Siguiente",
    backToPath: "Volver a la ruta",
    viewMissions: "Ver misiones",
    lesson: "Lección",
    exercise: "Ejercicio",
    project: "Proyecto",
  },
};

const PATH_LABELS: Record<string, Record<Language, string>> = {
  "web-developer": {
    fr: "Développeur Web",
    en: "Web Developer",
    es: "Desarrollador Web",
  },
  "ui-designer": {
    fr: "Designer UI",
    en: "UI Designer",
    es: "Diseñador UI",
  },
  "data-analyst": {
    fr: "Data Analyst Junior",
    en: "Junior Data Analyst",
    es: "Data Analyst Junior",
  },
};

// ─── All module content ───────────────────────────────────────────────────────
const MODULES: Record<string, ModuleContent> = {
  "html-basics": {
    id: "html-basics",
    title: "HTML — Structure & sémantique",
    duration: "45 min",
    type: "lesson",
    intro:
      "HTML (HyperText Markup Language) est le squelette de toute page web. Il décrit la structure et le sens du contenu. Sans HTML, il n'y a pas de page.",
    objectives: [
      "Comprendre la structure d'un document HTML5",
      "Utiliser les balises sémantiques correctes (header, main, section, article…)",
      "Créer des liens, images, listes et tableaux",
      "Valider ton code avec le validateur W3C",
    ],
    steps: [
      {
        title: "La structure de base",
        content:
          "Tout document HTML commence par un DOCTYPE et une structure en arbre. Voici le minimum vital pour toute page.",
        code: `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ma première page</title>
  </head>
  <body>
    <h1>Bonjour le monde !</h1>
    <p>Ceci est mon premier paragraphe.</p>
  </body>
</html>`,
        tip: "Toujours préciser lang='fr' pour l'accessibilité et le SEO.",
      },
      {
        title: "Les balises sémantiques",
        content:
          "HTML5 a introduit des balises qui donnent du sens au contenu. Utilise-les plutôt que des <div> génériques.",
        code: `<header>
  <nav>
    <a href="/">Accueil</a>
    <a href="/about">À propos</a>
  </nav>
</header>

<main>
  <article>
    <h2>Mon article</h2>
    <p>Le contenu principal ici.</p>
  </article>

  <aside>
    <p>Informations complémentaires</p>
  </aside>
</main>

<footer>
  <p>&copy; 2026 MonSite</p>
</footer>`,
        tip: "Un seul <main> par page. <header> et <footer> peuvent apparaître plusieurs fois.",
      },
      {
        title: "Liens, images et listes",
        content: "Les éléments les plus courants que tu utiliseras dans chaque projet.",
        code: `<!-- Lien -->
<a href="https://example.com" target="_blank" rel="noopener">
  Visiter le site
</a>

<!-- Image -->
<img
  src="photo.jpg"
  alt="Description de l'image"
  width="800"
  height="600"
/>

<!-- Liste non-ordonnée -->
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>

<!-- Liste ordonnée -->
<ol>
  <li>Apprendre HTML</li>
  <li>Apprendre CSS</li>
  <li>Construire un projet</li>
</ol>`,
        tip: "L'attribut alt est obligatoire pour l'accessibilité. Décris ce que l'image montre.",
      },
    ],
    resources: [
      { label: "MDN — Référence HTML", url: "https://developer.mozilla.org/fr/docs/Web/HTML" },
      { label: "Validateur W3C", url: "https://validator.w3.org" },
    ],
    nextModule: "css-basics",
  },

  "css-basics": {
    id: "css-basics",
    title: "CSS — Styles & mise en page",
    duration: "60 min",
    type: "lesson",
    intro:
      "CSS (Cascading Style Sheets) donne vie à tes pages HTML. Couleurs, typographie, espacement, animations — tout passe par là.",
    objectives: [
      "Comprendre les sélecteurs, propriétés et valeurs CSS",
      "Maîtriser le modèle de boîte (box model)",
      "Utiliser Flexbox pour des mises en page flexibles",
      "Appliquer des variables CSS pour un design cohérent",
    ],
    steps: [
      {
        title: "Sélecteurs et cascade",
        content:
          "CSS fonctionne en cascades : plusieurs règles peuvent s'appliquer au même élément. La spécificité détermine laquelle gagne.",
        code: `/* Sélecteur de balise */
p {
  color: #333;
  line-height: 1.6;
}

/* Sélecteur de classe */
.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Sélecteur d'identifiant */
#hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
}`,
        tip: "Préfère les classes aux IDs pour le style. Les IDs sont très spécifiques et difficiles à surcharger.",
      },
      {
        title: "Le modèle de boîte",
        content:
          "Chaque élément HTML est une boîte rectangulaire. Comprendre margin, padding et border est fondamental.",
        code: `.box {
  /* Contenu */
  width: 300px;
  height: 200px;

  /* Espacement interne */
  padding: 1rem;          /* tous les côtés */
  padding: 1rem 2rem;     /* haut/bas  gauche/droite */

  /* Bordure */
  border: 2px solid #e5e7eb;
  border-radius: 8px;

  /* Espacement externe */
  margin: 0 auto;         /* centrer horizontalement */

  /* Inclure padding dans la largeur */
  box-sizing: border-box;
}`,
        tip: "Applique box-sizing: border-box; à tous les éléments avec * { box-sizing: border-box; } pour éviter les surprises.",
      },
      {
        title: "Flexbox — mise en page moderne",
        content:
          "Flexbox est le système de mise en page le plus utilisé. Il rend l'alignement trivial.",
        code: `.navbar {
  display: flex;
  justify-content: space-between; /* horizontal */
  align-items: center;           /* vertical */
  gap: 1rem;
  padding: 1rem 2rem;
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.card {
  flex: 1 1 280px; /* grandir, rétrécir, base */
}`,
        tip: "Utilise gap plutôt que margin pour l'espace entre les éléments flex.",
      },
    ],
    resources: [
      { label: "Flexbox Froggy — Jeu d'apprentissage", url: "https://flexboxfroggy.com/#fr" },
      { label: "MDN — CSS", url: "https://developer.mozilla.org/fr/docs/Web/CSS" },
    ],
    prevModule: "html-basics",
    nextModule: "first-landing",
  },

  "first-landing": {
    id: "first-landing",
    title: "🔨 Projet : Ta première landing page",
    duration: "90 min",
    type: "project",
    intro:
      "Tu vas construire une vraie landing page de A à Z. Pas de framework, juste HTML et CSS. Ce projet sera sur ton profil GitHub.",
    objectives: [
      "Créer une landing page complète avec header, hero, features et footer",
      "Rendre la page responsive (mobile + desktop)",
      "Déployer sur GitHub Pages gratuitement",
      "Partager le lien live sur ton profil JuniorCode",
    ],
    steps: [
      {
        title: "Étape 1 — Structure HTML",
        content:
          "Crée un fichier index.html avec la structure complète. La page doit avoir : une barre de navigation, un hero, une section features (3 cartes) et un footer.",
        code: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mon Projet</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <!-- Navbar -->
  <header class="navbar">
    <span class="logo">MonProjet</span>
    <nav>
      <a href="#features">Fonctionnalités</a>
      <a href="#contact" class="btn-primary">Contact</a>
    </nav>
  </header>

  <!-- Hero -->
  <section class="hero">
    <h1>La solution pour <span class="highlight">ton projet</span></h1>
    <p>Description courte et percutante de ce que tu fais.</p>
    <a href="#features" class="btn-primary btn-large">Découvrir →</a>
  </section>

  <!-- Features -->
  <section class="features" id="features">
    <h2>Pourquoi choisir MonProjet ?</h2>
    <div class="cards">
      <div class="card">
        <span class="icon">⚡</span>
        <h3>Rapide</h3>
        <p>Optimisé pour la performance.</p>
      </div>
      <!-- 2 autres cartes -->
    </div>
  </section>

  <footer>
    <p>&copy; 2026 MonProjet — Fait avec ❤️</p>
  </footer>
</body>
</html>`,
        tip: "Garde une structure simple. La clarté prime sur la complexité pour un premier projet.",
      },
      {
        title: "Étape 2 — Style CSS",
        content:
          "Crée style.css et applique un design propre. Utilise des variables CSS pour les couleurs.",
        code: `/* Variables */
:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --text: #1f2937;
  --text-muted: #6b7280;
  --bg: #ffffff;
  --radius: 12px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, sans-serif;
  color: var(--text);
  line-height: 1.6;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

/* Hero */
.hero {
  text-align: center;
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #eff6ff, #f0fdf4);
}
.hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; }
.highlight { color: var(--primary); }`,
        tip: "Utilise clamp() pour une typographie responsive sans media queries.",
      },
      {
        title: "Étape 3 — Deploy sur GitHub Pages",
        content:
          "Push ton code sur GitHub et active GitHub Pages pour avoir un lien live.",
        code: `# Dans le terminal
git init
git add .
git commit -m "feat: première landing page"
git branch -M main
git remote add origin https://github.com/TON-USER/mon-projet.git
git push -u origin main

# Ensuite sur GitHub.com :
# Settings → Pages → Source: "Deploy from branch" → main / root`,
        tip: "Ton site sera live à https://TON-USER.github.io/mon-projet/ dans 1-2 minutes.",
      },
    ],
    resources: [
      { label: "GitHub Pages — Guide officiel", url: "https://pages.github.com" },
      { label: "CSS Gradient Generator", url: "https://cssgradient.io" },
    ],
    prevModule: "css-basics",
    nextModule: "git-basics",
  },

  "git-basics": {
    id: "git-basics",
    title: "Git & GitHub — Les bases",
    duration: "45 min",
    type: "lesson",
    intro:
      "Git est l'outil de versioning le plus utilisé au monde. Chaque développeur professionnel l'utilise quotidiennement. Tu en auras besoin dès ton premier projet client.",
    objectives: [
      "Comprendre le workflow Git : init, add, commit, push",
      "Créer et utiliser des branches",
      "Collaborer sur GitHub avec fork et pull requests",
      "Résoudre des conflits simples",
    ],
    steps: [
      {
        title: "Les commandes essentielles",
        content:
          "90% du travail quotidien avec Git se fait avec ces quelques commandes.",
        code: `# Initialiser un nouveau dépôt
git init

# Vérifier l'état des fichiers
git status

# Ajouter des fichiers à la zone de staging
git add fichier.txt      # un fichier
git add .               # tous les fichiers modifiés

# Créer un commit (snapshot)
git commit -m "feat: ajouter la page d'accueil"

# Voir l'historique
git log --oneline

# Envoyer sur GitHub
git push origin main`,
        tip: "Suis la convention Conventional Commits : feat: / fix: / docs: / style: / refactor:",
      },
      {
        title: "Travailler avec des branches",
        content:
          "Les branches te permettent de travailler sur une fonctionnalité sans toucher au code principal.",
        code: `# Créer et basculer sur une nouvelle branche
git checkout -b feature/ma-fonctionnalite

# Travailler, committer...
git add .
git commit -m "feat: ajouter formulaire contact"

# Retourner sur main
git checkout main

# Fusionner la branche
git merge feature/ma-fonctionnalite

# Supprimer la branche (optionnel)
git branch -d feature/ma-fonctionnalite`,
        tip: "Nomme tes branches de façon descriptive : feature/..., fix/..., hotfix/...",
      },
    ],
    resources: [
      { label: "Learn Git Branching — Visuel interactif", url: "https://learngitbranching.js.org/?locale=fr_FR" },
      { label: "Pro Git — Livre gratuit FR", url: "https://git-scm.com/book/fr/v2" },
    ],
    prevModule: "first-landing",
    nextModule: "github-publish",
  },

  "github-publish": {
    id: "github-publish",
    title: "🔨 Publier sur GitHub Pages",
    duration: "30 min",
    type: "exercise",
    intro:
      "Exercice pratique : tu vas prendre ton projet landing page et le déployer en ligne gratuitement avec GitHub Pages.",
    objectives: [
      "Créer un repo GitHub et pousser ton code",
      "Activer GitHub Pages",
      "Avoir un lien en ligne à partager",
    ],
    steps: [
      {
        title: "Créer le repo GitHub",
        content:
          "Va sur github.com/new, nomme ton repo, laisse-le public et ne coche pas 'Initialize'. Copie les commandes affichées.",
        code: `git remote add origin https://github.com/TON-USER/landing-page.git
git branch -M main
git push -u origin main`,
        tip: "Ton repo doit être Public pour que GitHub Pages fonctionne gratuitement.",
      },
      {
        title: "Activer GitHub Pages",
        content:
          "Dans ton repo GitHub : Settings (⚙️) → Pages → Source : Deploy from a branch → Branch: main → / (root) → Save.",
        tip: "Attends 1-2 minutes puis actualise. Le lien apparaît en haut de la section Pages.",
      },
    ],
    prevModule: "git-basics",
    nextModule: "js-basics",
  },

  "js-basics": {
    id: "js-basics",
    title: "JavaScript — Variables, fonctions, DOM",
    duration: "90 min",
    type: "lesson",
    intro:
      "JavaScript donne du dynamisme à tes pages. C'est le seul langage qui tourne nativement dans le navigateur. Tu en auras besoin pour tout interactif.",
    objectives: [
      "Déclarer des variables avec let et const",
      "Écrire des fonctions et comprendre les arrow functions",
      "Manipuler le DOM pour modifier la page",
      "Gérer des événements (click, input, submit)",
    ],
    steps: [
      {
        title: "Variables et types",
        content: "JavaScript a des types dynamiques. let et const remplacent var dans le code moderne.",
        code: `// const : valeur qui ne change pas
const name = "Alice";
const age = 25;
const isActive = true;

// let : valeur qui peut changer
let score = 0;
score += 10;

// Tableaux
const skills = ["HTML", "CSS", "JS"];
skills.push("React"); // OK même avec const

// Objets
const user = {
  name: "Alice",
  age: 25,
  greet() {
    return \`Bonjour, je suis \${this.name}\`;
  }
};`,
        tip: "Utilise toujours const par défaut. Passe à let seulement si tu dois réassigner.",
      },
      {
        title: "Fonctions et arrow functions",
        content: "Les arrow functions sont la syntaxe moderne et plus concise.",
        code: `// Fonction classique
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Arrow avec corps
const greet = (name) => {
  const message = \`Bonjour \${name} !\`;
  return message;
};

// Méthodes de tableau
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);       // [2, 4, 6, 8, 10]
const evens   = numbers.filter(n => n % 2 === 0); // [2, 4]
const sum     = numbers.reduce((acc, n) => acc + n, 0); // 15`,
        tip: "map, filter et reduce sont tes meilleurs amis. Maîtrise-les et tu gères 90% des manipulations de données.",
      },
      {
        title: "Manipuler le DOM",
        content: "Le DOM (Document Object Model) te permet de lire et modifier ta page HTML avec JS.",
        code: `// Sélectionner des éléments
const title   = document.querySelector("h1");
const buttons = document.querySelectorAll(".btn");

// Modifier le contenu
title.textContent = "Nouveau titre";
title.innerHTML   = "Titre avec <em>italique</em>";

// Modifier les styles / classes
title.style.color = "blue";
title.classList.add("highlight");
title.classList.remove("hidden");
title.classList.toggle("active");

// Écouter des événements
const btn = document.querySelector("#myBtn");

btn.addEventListener("click", (event) => {
  event.preventDefault(); // annuler le comportement par défaut
  console.log("Bouton cliqué !");
  btn.textContent = "Cliqué ✓";
});`,
        tip: "querySelector retourne le premier élément correspondant, querySelectorAll retourne tous.",
      },
    ],
    resources: [
      { label: "JavaScript.info — Tutoriel complet", url: "https://fr.javascript.info" },
      { label: "MDN — JavaScript", url: "https://developer.mozilla.org/fr/docs/Web/JavaScript" },
    ],
    prevModule: "github-publish",
    nextModule: "js-dom",
  },

  "js-dom": {
    id: "js-dom",
    title: "JavaScript avancé — Événements & fetch",
    duration: "75 min",
    type: "lesson",
    intro:
      "Tu sais manipuler le DOM. Maintenant tu vas apprendre à faire des requêtes vers des APIs externes et à gérer les données asynchrones.",
    objectives: [
      "Comprendre les Promises et async/await",
      "Faire des appels API avec fetch()",
      "Gérer les erreurs et les états de chargement",
      "Afficher des données dynamiques dans le DOM",
    ],
    steps: [
      {
        title: "Async / Await",
        content: "JavaScript est asynchrone. async/await est la façon moderne de gérer ça lisiblement.",
        code: `// Sans async/await (Promises chaînées)
fetch("/api/users")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Avec async/await (bien mieux)
async function getUsers() {
  try {
    const res  = await fetch("/api/users");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Appeler la fonction
const users = await getUsers();`,
        tip: "Toujours entourer les await d'un try/catch pour gérer les erreurs réseau.",
      },
      {
        title: "Fetch API",
        content: "fetch() est l'API native du navigateur pour faire des requêtes HTTP.",
        code: `// GET — récupérer des données
const response = await fetch("https://api.github.com/users/torvalds");
const user = await response.json();
console.log(user.name, user.public_repos);

// POST — envoyer des données
const res = await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Alice",
    email: "alice@example.com",
    message: "Bonjour !"
  })
});

const result = await res.json();`,
        tip: "Vérifie toujours res.ok avant de parser le JSON. Une 404 ne lève pas d'erreur avec fetch !",
      },
    ],
    prevModule: "js-basics",
    nextModule: "todo-app",
  },

  "todo-app": {
    id: "todo-app",
    title: "🔨 To-do app complète",
    duration: "3h",
    type: "project",
    intro:
      "Le projet classique, mais fait correctement. Tu vas construire une to-do app avec ajout, suppression, filtrage et persistance dans le localStorage.",
    objectives: [
      "Créer une interface complète avec HTML/CSS/JS vanille",
      "Implémenter CRUD (Create, Read, Update, Delete)",
      "Persister les données avec localStorage",
      "Filtrer par statut (tout / actif / complété)",
    ],
    steps: [
      {
        title: "Architecture du projet",
        content: "Organise ton code en trois couches : état, DOM et événements.",
        code: `// state.js — gestion de l'état
let todos = JSON.parse(localStorage.getItem("todos") || "[]");

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo(text) {
  todos.push({ id: Date.now(), text, completed: false });
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  render();
}`,
        tip: "Garde la logique séparée de l'affichage. Ça rend le code 10x plus facile à maintenir.",
      },
      {
        title: "Rendu et événements",
        content: "Recrée le DOM à chaque changement d'état — pattern simple et fiable.",
        code: `function render() {
  const list = document.querySelector("#todo-list");
  const filter = document.querySelector(".filter.active")?.dataset.filter || "all";

  const filtered = filter === "active"
    ? todos.filter(t => !t.completed)
    : filter === "completed"
    ? todos.filter(t => t.completed)
    : todos;

  list.innerHTML = filtered.map(todo => \`
    <li class="todo-item \${todo.completed ? "done" : ""}">
      <input
        type="checkbox"
        \${todo.completed ? "checked" : ""}
        onchange="toggleTodo(\${todo.id})"
      />
      <span>\${todo.text}</span>
      <button onclick="deleteTodo(\${todo.id})">🗑️</button>
    </li>
  \`).join("");
}

// Formulaire d'ajout
document.querySelector("#todo-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target.elements.text;
  if (input.value.trim()) {
    addTodo(input.value.trim());
    input.value = "";
  }
});`,
        tip: "Utilise dataset.* pour stocker des données dans le HTML. Évite les variables globales.",
      },
    ],
    prevModule: "js-dom",
    nextModule: "react-intro",
  },

  "react-intro": {
    id: "react-intro",
    title: "Introduction à React",
    duration: "60 min",
    type: "lesson",
    intro:
      "React est la bibliothèque UI la plus utilisée au monde. Elle t'apprend à penser en composants et à gérer l'état de façon déclarative.",
    objectives: [
      "Comprendre les composants et le JSX",
      "Utiliser useState et useEffect",
      "Passer des props entre composants",
      "Gérer les listes avec .map() et les keys",
    ],
    steps: [
      {
        title: "Composants et JSX",
        content: "Un composant React est une fonction qui retourne du JSX. C'est HTML + JavaScript fusionnés.",
        code: `// Un composant simple
function Button({ label, onClick, variant = "primary" }) {
  return (
    <button
      onClick={onClick}
      className={\`btn btn-\${variant}\`}
    >
      {label}
    </button>
  );
}

// Un composant Card
function Card({ title, description, icon }) {
  return (
    <div className="card">
      <span className="card-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// Utilisation
function App() {
  return (
    <main>
      <Card title="React" description="Une lib UI" icon="⚛️" />
      <Button label="Cliquez ici" onClick={() => alert("Hello!")} />
    </main>
  );
}`,
        tip: "Les composants commencent toujours par une MAJUSCULE. <button> = HTML, <Button> = composant React.",
      },
      {
        title: "useState — l'état local",
        content: "useState te donne un état réactif. Quand l'état change, React re-rend le composant automatiquement.",
        code: `import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Compteur : {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Exemple avec objet
function Form() {
  const [form, setForm] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form>
      <input name="name"  value={form.name}  onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
    </form>
  );
}`,
        tip: "Ne modifie jamais l'état directement (state.count++). Toujours utiliser le setter (setCount).",
      },
    ],
    resources: [
      { label: "React.dev — Documentation officielle", url: "https://fr.react.dev" },
    ],
    prevModule: "todo-app",
    nextModule: "portfolio",
  },

  "portfolio": {
    id: "portfolio",
    title: "🔨 Portfolio personnel avec React",
    duration: "4h",
    type: "project",
    intro:
      "Ton portfolio est ta carte de visite en ligne. C'est le premier lien que tu envoies à un client potentiel. On va le construire avec Next.js pour qu'il soit rapide et bien référencé.",
    objectives: [
      "Créer un portfolio avec Next.js et Tailwind CSS",
      "Sections : Hero, Compétences, Projets, Contact",
      "Déployer sur Vercel gratuitement",
      "Avoir un domaine en .vercel.app",
    ],
    steps: [
      {
        title: "Créer le projet Next.js",
        content: "Next.js est la façon standard de créer des apps React en 2026. Le déploiement sur Vercel est gratuit et en 1 clic.",
        code: `# Créer le projet
npx create-next-app@latest mon-portfolio --typescript --tailwind --app

cd mon-portfolio

# Structure recommandée
src/
  app/
    page.tsx         ← page principale
    layout.tsx       ← layout global
  components/
    Hero.tsx
    Skills.tsx
    Projects.tsx
    Contact.tsx`,
        tip: "Utilise --tailwind pour avoir Tailwind CSS configuré automatiquement.",
      },
      {
        title: "Composant Hero",
        content: "La première section que voient les visiteurs. Elle doit répondre à : qui es-tu ? que fais-tu ? comment te contacter ?",
        code: `export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-6">
        A
      </div>
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Salut, je suis <span className="text-blue-500">Alice</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8">
        Développeuse web junior — je construis des interfaces rapides,
        accessibles et belles.
      </p>
      <div className="flex gap-4">
        <a href="#projects" className="btn-primary">Voir mes projets</a>
        <a href="#contact" className="btn-secondary">Me contacter</a>
      </div>
    </section>
  );
}`,
      },
      {
        title: "Déployer sur Vercel",
        content: "Push ton code sur GitHub puis connecte le repo à Vercel pour un déploiement automatique.",
        code: `# 1. Push sur GitHub
git push origin main

# 2. Va sur vercel.com
# → New Project
# → Import ton repo GitHub
# → Deploy (sans rien changer)

# Ton site sera live en 30 secondes sur :
# https://mon-portfolio-alice.vercel.app`,
        tip: "Chaque git push redéploie automatiquement. Vercel détecte Next.js et configure tout seul.",
      },
    ],
    resources: [
      { label: "Vercel — Déploiement Next.js", url: "https://vercel.com/new" },
      { label: "Next.js — Docs officielles", url: "https://nextjs.org/docs" },
    ],
    prevModule: "react-intro",
    nextModule: "read-offer",
  },

  "read-offer": {
    id: "read-offer",
    title: "Comment lire une offre de mission",
    duration: "20 min",
    type: "lesson",
    intro:
      "Sur la marketplace JuniorCode, tu vas trouver des offres de mission. Savoir les lire et évaluer si elles te correspondent est une compétence clé.",
    objectives: [
      "Identifier les informations essentielles d'une offre",
      "Évaluer si tu es qualifié pour postuler",
      "Repérer les signaux d'alarme",
      "Estimer le temps et le budget réalistes",
    ],
    steps: [
      {
        title: "Les éléments d'une bonne offre",
        content: "Une offre sérieuse contient toujours ces informations. Si l'une manque, demande avant de postuler.",
        tip: "Checklist : scope clair ✓, deadline réaliste ✓, budget précisé ✓, client vérifié ✓",
      },
      {
        title: "Signaux d'alarme à éviter",
        content: "Certaines offres sont des pièges. Apprends à les reconnaître pour éviter les mauvaises surprises.",
        tip: "Fuis : 'budget illimité', 'projet simple en 1h', 'on verra pour la rémunération'.",
      },
    ],
    prevModule: "portfolio",
    nextModule: "apply",
  },

  "apply": {
    id: "apply",
    title: "Postuler et parler à un client",
    duration: "30 min",
    type: "lesson",
    intro:
      "La façon dont tu postules détermine 80% de tes chances. Un message personnalisé et professionnel te démarque immédiatement.",
    objectives: [
      "Rédiger une lettre de motivation courte et percutante",
      "Poser les bonnes questions au client",
      "Négocier le budget avec assurance",
      "Établir des conditions claires dès le départ",
    ],
    steps: [
      {
        title: "Template de candidature",
        content: "Utilise ce template et personnalise-le pour chaque offre. La personnalisation fait toute la différence.",
        code: `Bonjour [Prénom du client],

J'ai lu votre offre pour [titre du projet] et je pense
pouvoir vous aider efficacement.

Mon approche pour ce projet :
→ [Ce que tu vas faire concrètement — 1 phrase]
→ [Technologie/méthode choisie et pourquoi]
→ Délai estimé : [X jours] pour un rendu soigné

Voici un projet similaire que j'ai réalisé :
[lien GitHub ou portfolio]

Questions avant de commencer :
1. [Question sur le scope]
2. [Question sur les assets/accès nécessaires]

Budget proposé : [X]€ avec [Y acompte / Z à la livraison]

À votre disposition pour un appel rapide,
[Ton prénom]`,
        tip: "Maximum 200 mots. Les clients reçoivent beaucoup de candidatures — va droit au but.",
      },
    ],
    prevModule: "read-offer",
    nextModule: "quote",
  },

  "quote": {
    id: "quote",
    title: "Faire un devis simple",
    duration: "25 min",
    type: "exercise",
    intro:
      "Un devis professionnel rassure le client et te protège légalement. Il n'a pas besoin d'être compliqué pour être efficace.",
    objectives: [
      "Créer un devis PDF en moins de 10 minutes",
      "Détailler les prestations et les livrables",
      "Définir les conditions de paiement",
      "Avoir un modèle réutilisable",
    ],
    steps: [
      {
        title: "Structure d'un devis junior",
        content: "Voici les éléments obligatoires d'un devis valide en France.",
        code: `DEVIS N°2026-001

Émetteur : [Ton nom / auto-entreprise]
Date : 30/04/2026
Valable 30 jours

Client : [Nom / Société]

─────────────────────────────────────────
PRESTATIONS

1. Design maquette Figma (3 pages)
   → 5h × 30€/h = 150€

2. Intégration HTML/CSS responsive
   → 8h × 30€/h = 240€

3. Déploiement et mise en ligne
   → 2h × 30€/h = 60€

─────────────────────────────────────────
TOTAL HT : 450€
TVA non applicable — art. 293B du CGI

PAIEMENT
- 50% à la commande (225€)
- 50% à la livraison (225€)
Virement bancaire — IBAN fourni sur facture`,
        tip: "En micro-entreprise sous le seuil de TVA, tu mets 'TVA non applicable'. Pas de TVA à facturer.",
      },
    ],
    prevModule: "apply",
    nextModule: "marketplace-intro",
  },

  "marketplace-intro": {
    id: "marketplace-intro",
    title: "Accès aux projets Junior-Only",
    duration: "∞",
    type: "project",
    intro:
      "Félicitations ! Tu as terminé le parcours. Tu débloques maintenant l'accès aux missions Junior-Only sur la marketplace — des projets réels, postés par de vrais clients, réservés aux juniors vérifiés.",
    objectives: [
      "Accéder aux missions marquées Junior-Only",
      "Postuler à ton premier projet réel",
      "Décrocher ta première mission freelance",
      "Gagner ton premier badge Verified Junior",
    ],
    steps: [
      {
        title: "Tu es prêt(e) !",
        content:
          "Tu maîtrises maintenant HTML, CSS, JavaScript, React, Git et les bases du freelance. C'est largement suffisant pour décrocher des premières missions.",
        tip: "Les clients sur JuniorCode cherchent spécifiquement des juniors. Ils savent que tu débutes — c'est un avantage, pas un handicap.",
      },
    ],
    prevModule: "quote",
  },

  // UI Designer modules
  "design-thinking": {
    id: "design-thinking",
    title: "Design Thinking — Principes fondamentaux",
    duration: "40 min",
    type: "lesson",
    intro:
      "Le design thinking est une méthode de résolution de problèmes centrée sur l'utilisateur. Avant de dessiner quoi que ce soit, tu dois comprendre le problème.",
    objectives: [
      "Comprendre les 5 étapes du Design Thinking",
      "Créer des personas utilisateurs",
      "Définir un problème avec la méthode How Might We",
      "Prioriser les idées avec une matrice impact/effort",
    ],
    steps: [
      {
        title: "Les 5 étapes",
        content:
          "Empathise → Définis → Idéation → Prototype → Test. Ce cycle se répète jusqu'à trouver la bonne solution.",
        tip: "Le design thinking n'est pas linéaire. Tu peux revenir en arrière à tout moment.",
      },
      {
        title: "Créer un persona",
        content:
          "Un persona est un utilisateur fictif représentatif de ton audience cible. Il humanise les décisions de design.",
        code: `PERSONA — Marie, 28 ans, Marketing Manager

Situation : Travaille dans une PME de 50 personnes
Objectif : Créer des visuels rapidement sans designer
Frustration : Les outils complexes lui font perdre du temps
Comportement : Mobile-first, utilise Canva, cherche la simplicité

Citation : "J'ai besoin d'un résultat pro en 10 minutes."`,
        tip: "Basez vos personas sur de vraies interviews utilisateurs, pas sur des suppositions.",
      },
    ],
    nextModule: "color-theory",
  },

  "color-theory": {
    id: "color-theory",
    title: "Théorie des couleurs & typographie",
    duration: "50 min",
    type: "lesson",
    intro:
      "Les couleurs et la typographie représentent 70% de l'impact visuel d'une interface. Les maîtriser change tout.",
    objectives: [
      "Comprendre le cercle chromatique et les harmonies",
      "Créer une palette cohérente avec 60/30/10",
      "Choisir des polices qui fonctionnent ensemble",
      "Respecter les ratios de contraste WCAG",
    ],
    steps: [
      {
        title: "La règle 60/30/10",
        content:
          "60% couleur dominante (fond), 30% secondaire (sections, cartes), 10% accent (CTAs, liens).",
        code: `/* Exemple de palette */
:root {
  /* 60% — Dominante */
  --color-bg:         #0f172a;  /* dark navy */
  --color-bg-card:    #1e293b;

  /* 30% — Secondaire */
  --color-text:       #e2e8f0;
  --color-text-muted: #94a3b8;

  /* 10% — Accent */
  --color-accent:     #6366f1;  /* indigo */
  --color-accent-hover: #4f46e5;
}`,
        tip: "Génère ta palette sur coolors.co puis teste-la sur ton design avant de l'adopter.",
      },
      {
        title: "Pairing typographique",
        content: "Combine une police serif ou display pour les titres et une sans-serif pour le corps.",
        code: `/* Google Fonts — Paire classique */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap');

h1, h2, h3 {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  letter-spacing: -0.02em;
}

body {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.7;
}`,
        tip: "Limite-toi à 2 familles de polices maximum. Plus = moins.",
      },
    ],
    prevModule: "design-thinking",
    nextModule: "figma-intro",
  },

  "figma-intro": {
    id: "figma-intro",
    title: "Figma — Prise en main complète",
    duration: "60 min",
    type: "lesson",
    intro:
      "Figma est l'outil de design le plus utilisé en 2026. Il est gratuit pour les projets personnels et tourne dans le navigateur.",
    objectives: [
      "Naviguer dans l'interface Figma",
      "Créer des frames, shapes et textes",
      "Utiliser les auto-layouts pour des designs flexibles",
      "Créer et utiliser des composants",
    ],
    steps: [
      {
        title: "Interface et raccourcis essentiels",
        content: "Ces raccourcis font gagner 50% de temps dans Figma.",
        code: `F           → Frame (conteneur)
R           → Rectangle
T           → Texte
V           → Sélection
Cmd/Ctrl+D  → Dupliquer
Cmd/Ctrl+G  → Grouper
Cmd/Ctrl+K  → Scale (redimensionner avec les proportions)
Alt+drag    → Cloner l'élément
Cmd+]       → Mettre en avant
Cmd+[       → Mettre en arrière
Shift+A     → Ajouter un Auto Layout`,
        tip: "Mémorise F, R, T, V en priorité. C'est 90% de ce que tu utiliseras.",
      },
      {
        title: "Auto Layout — le game changer",
        content: "Auto Layout rend tes designs flexibles comme CSS Flexbox.",
        tip: "Tout ce que tu fais dans Figma devrait être en Auto Layout. Ça t'évitera de repositionner les éléments manuellement.",
      },
    ],
    resources: [
      { label: "Figma — Créer un compte gratuit", url: "https://figma.com" },
      { label: "Figma Learn — Tutoriels officiels", url: "https://help.figma.com/hc/en-us/categories/360002051613" },
    ],
    prevModule: "color-theory",
    nextModule: "first-wireframe",
  },

  "first-wireframe": {
    id: "first-wireframe",
    title: "🔨 Premier wireframe d'une app mobile",
    duration: "90 min",
    type: "project",
    intro:
      "Tu vas créer le wireframe d'une app mobile de to-do list dans Figma. Pas de couleurs, juste la structure et les flux.",
    objectives: [
      "Créer des frames mobiles (375×812)",
      "Wireframer 3 écrans : liste, ajout, détail",
      "Créer des liens de navigation entre les écrans",
      "Exporter et partager le prototype",
    ],
    steps: [
      {
        title: "Setup Figma",
        content: "Crée un nouveau fichier Figma. Ajoute 3 frames iPhone 14 (375×812).",
        tip: "Nomme tes frames : '01 — Liste', '02 — Ajouter', '03 — Détail'. L'ordre et les noms comptent.",
      },
      {
        title: "Wireframer les 3 écrans",
        content: "Utilise uniquement des rectangles gris et du texte. Le wireframe teste la structure, pas le style.",
        tip: "Si tu passes plus de 5 min sur une décision visuelle, c'est que tu designes et non que tu wireframes.",
      },
    ],
    prevModule: "figma-intro",
    nextModule: "ui-components",
  },

  // Data Analyst modules
  "python-intro": {
    id: "python-intro",
    title: "Python — Variables, listes, fonctions",
    duration: "60 min",
    type: "lesson",
    intro:
      "Python est le langage n°1 pour la data. Sa syntaxe claire et ses bibliothèques puissantes en font le choix évident.",
    objectives: [
      "Installer Python et configurer VSCode",
      "Maîtriser les types de base et les collections",
      "Écrire des fonctions propres",
      "Comprendre les list comprehensions",
    ],
    steps: [
      {
        title: "Types et variables",
        content: "Python est dynamiquement typé. Pas besoin de déclarer le type, Python l'infère.",
        code: `# Types de base
name    = "Alice"           # str
age     = 25                # int
salary  = 3500.50           # float
active  = True              # bool

# Collections
skills = ["Python", "SQL", "Pandas"]  # list (mutable)
coords = (48.8566, 2.3522)            # tuple (immutable)
config = {"lang": "fr", "dark": True} # dict

# F-strings (Python 3.6+)
print(f"Bonjour {name}, tu as {age} ans")

# List comprehension
squares = [x**2 for x in range(1, 11)]  # [1, 4, 9, 16, ...]
evens   = [x for x in range(20) if x % 2 == 0]`,
        tip: "Utilise les f-strings plutôt que la concaténation avec +. C'est plus lisible et plus rapide.",
      },
      {
        title: "Fonctions",
        content: "En Python, une bonne fonction fait UNE chose et la fait bien.",
        code: `def calculate_average(numbers: list[float]) -> float:
    """Calcule la moyenne d'une liste de nombres."""
    if not numbers:
        return 0.0
    return sum(numbers) / len(numbers)

# Paramètres par défaut
def greet(name: str, language: str = "fr") -> str:
    messages = {
        "fr": f"Bonjour, {name} !",
        "en": f"Hello, {name}!",
        "es": f"¡Hola, {name}!",
    }
    return messages.get(language, messages["fr"])

# Fonctions lambda (courtes)
double = lambda x: x * 2
sorted_names = sorted(["Bob", "alice", "Charlie"], key=lambda s: s.lower())`,
        tip: "Ajoute toujours un docstring à tes fonctions. Ça prend 30 secondes et sauve des heures.",
      },
    ],
    resources: [
      { label: "Python.org — Tutoriel officiel FR", url: "https://docs.python.org/fr/3/tutorial/" },
    ],
    nextModule: "pandas-intro",
  },

  "pandas-intro": {
    id: "pandas-intro",
    title: "Pandas — Charger et explorer des données",
    duration: "75 min",
    type: "lesson",
    intro:
      "Pandas est LA bibliothèque de manipulation de données en Python. Avec un DataFrame, tu peux explorer, nettoyer et analyser des millions de lignes en quelques lignes de code.",
    objectives: [
      "Charger un CSV avec pd.read_csv()",
      "Explorer un dataset (shape, dtypes, head, describe)",
      "Filtrer et sélectionner des données",
      "Calculer des statistiques groupées",
    ],
    steps: [
      {
        title: "Charger et explorer",
        content: "Les premières commandes à lancer sur tout nouveau dataset.",
        code: `import pandas as pd

# Charger un CSV
df = pd.read_csv("data.csv")

# Explorer
print(df.shape)           # (lignes, colonnes)
print(df.dtypes)          # types de chaque colonne
print(df.head(10))        # 10 premières lignes
print(df.tail(5))         # 5 dernières
print(df.describe())      # stats (mean, std, min, max...)
print(df.isnull().sum())  # valeurs manquantes par colonne
print(df.columns.tolist()) # liste des colonnes`,
        tip: "Commence TOUJOURS par df.info() et df.describe() pour comprendre tes données avant toute analyse.",
      },
      {
        title: "Filtrer et agréger",
        content: "Sélectionner les bonnes données est 50% du travail d'analyse.",
        code: `# Sélectionner une colonne
ages = df["age"]           # Series
subset = df[["name", "age"]]  # DataFrame

# Filtrer des lignes
adults  = df[df["age"] >= 18]
seniors = df[(df["age"] >= 65) & (df["active"] == True)]

# Grouper et agréger
avg_by_city = df.groupby("city")["salary"].mean()
count_by_cat = df.groupby("category").size()

# Trier
top10 = df.nlargest(10, "salary")
df_sorted = df.sort_values("age", ascending=False)`,
        tip: "df[condition] retourne un nouveau DataFrame sans modifier l'original. Toujours.",
      },
    ],
    prevModule: "python-intro",
    nextModule: "first-analysis",
  },

  "first-analysis": {
    id: "first-analysis",
    title: "🔨 Analyser un dataset CSV réel",
    duration: "2h",
    type: "project",
    intro:
      "Tu vas analyser le dataset public des prénoms en France (source : INSEE). Un vrai dataset, 600 000+ lignes.",
    objectives: [
      "Télécharger et charger un dataset réel",
      "Nettoyer les données (valeurs nulles, types…)",
      "Répondre à 5 questions analytiques",
      "Présenter les résultats sous forme de tableau",
    ],
    steps: [
      {
        title: "Télécharger le dataset",
        content: "Va sur data.gouv.fr et télécharge le fichier nat2023.csv (prénoms nationaux).",
        code: `import pandas as pd

df = pd.read_csv(
    "nat2023.csv",
    sep=";",           # séparateur point-virgule
    encoding="utf-8",
    dtype={"annais": str}  # garder l'année comme string
)

print(df.shape)        # attendu : ~650 000 lignes
print(df.head())`,
        tip: "Si tu as une erreur d'encodage, essaie encoding='latin-1'.",
      },
      {
        title: "5 questions à répondre",
        content: "Pour chaque question, écris le code pandas et affiche le résultat.",
        code: `# 1. Top 10 prénoms masculins de 2023
top_garcons = (
    df[(df["sexe"] == 1) & (df["annais"] == "2023")]
    .nlargest(10, "nombre")
    [["preusuel", "nombre"]]
)

# 2. Évolution du prénom "Emma" depuis 1990
emma = df[
    (df["preusuel"] == "EMMA") & (df["annais"] >= "1990")
].groupby("annais")["nombre"].sum()

# 3. Année avec le plus de naissances enregistrées
by_year = df.groupby("annais")["nombre"].sum().idxmax()

# 4. Combien de prénoms uniques ?
print(df["preusuel"].nunique())

# 5. Ratio filles/garçons par décennie
# À toi de jouer !`,
        tip: "Essaie de répondre à chaque question seul avant de regarder la solution.",
      },
    ],
    resources: [
      { label: "Dataset prénoms — data.gouv.fr", url: "https://www.data.gouv.fr/fr/datasets/fichier-des-prenoms/" },
    ],
    prevModule: "pandas-intro",
    nextModule: "data-cleaning",
  },

  "data-cleaning": {
    id: "data-cleaning",
    title: "Nettoyage de données — techniques clés",
    duration: "45 min",
    type: "lesson",
    intro:
      "Les data scientists passent 80% de leur temps à nettoyer des données. Autant maîtriser ça dès le début.",
    objectives: [
      "Gérer les valeurs manquantes (NaN)",
      "Détecter et supprimer les doublons",
      "Corriger les types de données",
      "Normaliser les chaînes de caractères",
    ],
    steps: [
      {
        title: "Valeurs manquantes",
        content: "NaN (Not a Number) est la façon dont Pandas représente une valeur manquante.",
        code: `# Détecter
df.isnull().sum()           # par colonne
df.isnull().mean() * 100    # % manquant

# Supprimer les lignes avec NaN
df_clean = df.dropna()                    # toutes les colonnes
df_clean = df.dropna(subset=["email"])    # une colonne spécifique

# Remplacer les NaN
df["age"].fillna(df["age"].median(), inplace=True)  # médiane
df["city"].fillna("Inconnu", inplace=True)           # valeur fixe

# Règle pratique :
# < 5% manquant  → supprimer les lignes
# 5-30% manquant → imputer (médiane, mode)
# > 30% manquant → supprimer la colonne`,
        tip: "Ne supprime JAMAIS les lignes avant de comprendre POURQUOI elles sont nulles. La nullité a souvent un sens.",
      },
    ],
    prevModule: "first-analysis",
    nextModule: "matplotlib",
  },

  "matplotlib": {
    id: "matplotlib",
    title: "Matplotlib & Seaborn — Graphiques",
    duration: "60 min",
    type: "lesson",
    intro:
      "Un graphique bien fait vaut 1000 lignes de code. Matplotlib est la base, Seaborn la rend belle.",
    objectives: [
      "Créer des graphiques en lignes, barres et distributions",
      "Personnaliser titres, axes et légendes",
      "Utiliser Seaborn pour des graphiques statistiques",
      "Exporter en PNG haute résolution",
    ],
    steps: [
      {
        title: "Les graphiques essentiels",
        content: "Ces 5 types de graphiques couvrent 90% des besoins.",
        code: `import matplotlib.pyplot as plt
import seaborn as sns

# Style global
plt.style.use("seaborn-v0_8-darkgrid")
sns.set_palette("husl")

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# 1. Ligne — évolution temporelle
axes[0].plot(df["year"], df["value"], linewidth=2)
axes[0].set_title("Évolution annuelle")

# 2. Barres — comparaison catégories
axes[1].bar(df["category"], df["count"], color="#6366f1")
axes[1].set_title("Comparaison par catégorie")

# 3. Distribution — Seaborn
sns.histplot(df["age"], bins=20, ax=axes[2], kde=True)
axes[2].set_title("Distribution des âges")

plt.tight_layout()
plt.savefig("analyse.png", dpi=150, bbox_inches="tight")
plt.show()`,
        tip: "Mets toujours un titre, des labels d'axes et une légende. Un graphique sans contexte ne communique rien.",
      },
    ],
    prevModule: "data-cleaning",
    nextModule: "plotly",
  },

  "plotly": {
    id: "plotly",
    title: "Plotly — Graphiques interactifs",
    duration: "45 min",
    type: "lesson",
    intro:
      "Plotly crée des graphiques HTML interactifs. Tes clients peuvent zoomer, filtrer, survoler. C'est ce que tu mettras dans tes dashboards.",
    objectives: [
      "Créer des graphiques Plotly Express",
      "Ajouter de l'interactivité (hover, zoom)",
      "Combiner plusieurs graphiques en subplots",
      "Exporter en HTML ou image",
    ],
    steps: [
      {
        title: "Plotly Express — la voie rapide",
        content: "Plotly Express crée des graphiques complexes en une ligne.",
        code: `import plotly.express as px
import pandas as pd

df = px.data.gapminder()  # dataset exemple inclus

# Scatter animé
fig = px.scatter(
    df,
    x="gdpPercap",
    y="lifeExp",
    size="pop",
    color="continent",
    animation_frame="year",
    log_x=True,
    title="PIB vs Espérance de vie (1952-2007)"
)

fig.update_layout(
    template="plotly_dark",
    font=dict(family="Inter"),
)

fig.show()              # ouvre dans le navigateur
fig.write_html("viz.html")  # exporte en HTML partageable`,
        tip: "Utilise write_html() pour partager des visualisations interactives sans serveur.",
      },
    ],
    prevModule: "matplotlib",
    nextModule: "dashboard",
  },

  "dashboard": {
    id: "dashboard",
    title: "🔨 Dashboard interactif avec Plotly Dash",
    duration: "3h",
    type: "project",
    intro:
      "Tu vas construire un dashboard web interactif avec Plotly Dash. Il aura des filtres, des graphiques et se déploiera sur le cloud.",
    objectives: [
      "Créer une app Dash avec layout et callbacks",
      "Implémenter des filtres interactifs (dropdown, slider)",
      "Afficher 3+ graphiques qui se mettent à jour",
      "Déployer sur Render.com gratuitement",
    ],
    steps: [
      {
        title: "Structure d'une app Dash",
        content: "Dash combine Flask (backend) et React (frontend). Toi tu écris juste du Python.",
        code: `from dash import Dash, dcc, html, Input, Output
import plotly.express as px
import pandas as pd

app = Dash(__name__)
df = pd.read_csv("data.csv")

app.layout = html.Div([
    html.H1("Mon Dashboard"),

    # Filtre dropdown
    dcc.Dropdown(
        id="category-filter",
        options=[{"label": c, "value": c} for c in df["category"].unique()],
        value=None,
        placeholder="Toutes les catégories"
    ),

    # Graphique
    dcc.Graph(id="main-chart"),
])

@app.callback(
    Output("main-chart", "figure"),
    Input("category-filter", "value")
)
def update_chart(selected_category):
    filtered = df if not selected_category else df[df["category"] == selected_category]
    fig = px.bar(filtered, x="month", y="revenue", template="plotly_dark")
    return fig

if __name__ == "__main__":
    app.run(debug=True)`,
        tip: "Le décorateur @app.callback relie automatiquement les inputs aux outputs. C'est la magie de Dash.",
      },
    ],
    prevModule: "plotly",
    nextModule: "sql-basics",
  },

  "sql-basics": {
    id: "sql-basics",
    title: "SQL — SELECT, JOIN, GROUP BY",
    duration: "60 min",
    type: "lesson",
    intro:
      "SQL est le langage universel des bases de données. Maîtriser SELECT, JOIN et GROUP BY te permet d'interroger n'importe quelle base.",
    objectives: [
      "Écrire des requêtes SELECT avec filtres et tri",
      "Joindre des tables avec JOIN",
      "Agréger des données avec GROUP BY",
      "Utiliser les fonctions d'agrégation (COUNT, SUM, AVG)",
    ],
    steps: [
      {
        title: "SELECT et WHERE",
        content: "La requête de base pour extraire des données.",
        code: `-- Toutes les colonnes
SELECT * FROM users;

-- Colonnes spécifiques
SELECT name, email, created_at FROM users;

-- Filtrer
SELECT * FROM orders
WHERE status = 'completed'
  AND total_amount > 100
  AND created_at >= '2026-01-01';

-- Trier
SELECT * FROM products
ORDER BY price DESC
LIMIT 10;

-- Valeurs distinctes
SELECT DISTINCT category FROM products;`,
        tip: "Ne fais jamais SELECT * en production. Sélectionne seulement les colonnes dont tu as besoin.",
      },
      {
        title: "JOIN — Joindre des tables",
        content: "JOIN combine des données de deux tables sur une clé commune.",
        code: `-- INNER JOIN — seulement les correspondances
SELECT
  o.id as order_id,
  u.name as customer,
  o.total_amount,
  o.status
FROM orders o
INNER JOIN users u ON o.user_id = u.id
WHERE o.status = 'completed';

-- GROUP BY — agréger
SELECT
  category,
  COUNT(*) as nb_products,
  AVG(price) as avg_price,
  SUM(stock) as total_stock
FROM products
GROUP BY category
HAVING COUNT(*) > 5  -- filtrer après GROUP BY
ORDER BY avg_price DESC;`,
        tip: "HAVING filtre sur les groupes après agrégation. WHERE filtre avant. Ne les confonds pas.",
      },
    ],
    resources: [
      { label: "SQLZoo — Exercices interactifs", url: "https://sqlzoo.net/wiki/SQL_Tutorial/fr" },
    ],
    prevModule: "dashboard",
    nextModule: "sql-advanced",
  },

  "sql-advanced": {
    id: "sql-advanced",
    title: "SQL avancé — Sous-requêtes & fenêtres",
    duration: "50 min",
    type: "lesson",
    intro:
      "Les fonctions de fenêtrage (window functions) et les sous-requêtes te permettent de répondre à des questions analytiques complexes.",
    objectives: [
      "Utiliser des sous-requêtes dans SELECT et WHERE",
      "Maîtriser ROW_NUMBER, RANK, LAG, LEAD",
      "Calculer des moyennes mobiles",
      "Utiliser les CTEs avec WITH",
    ],
    steps: [
      {
        title: "Fonctions de fenêtrage",
        content: "Les window functions calculent sur un ensemble de lignes sans les agréger.",
        code: `-- Rang par catégorie
SELECT
  name,
  category,
  sales,
  RANK() OVER (
    PARTITION BY category
    ORDER BY sales DESC
  ) as rank_in_category
FROM products;

-- Top 3 par catégorie
WITH ranked AS (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY category ORDER BY sales DESC
    ) as rn
  FROM products
)
SELECT * FROM ranked WHERE rn <= 3;

-- Croissance vs mois précédent
SELECT
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY month) as prev_revenue,
  ROUND(
    (revenue - LAG(revenue) OVER (ORDER BY month))
    / LAG(revenue) OVER (ORDER BY month) * 100, 1
  ) as growth_pct
FROM monthly_revenue;`,
        tip: "Les CTEs (WITH) rendent les requêtes complexes lisibles. Découpe toujours en étapes nommées.",
      },
    ],
    prevModule: "sql-basics",
    nextModule: "report",
  },

  "report": {
    id: "report",
    title: "🔨 Rapport d'analyse complet",
    duration: "4h",
    type: "project",
    intro:
      "Tu vas produire un rapport d'analyse professionnel sur un dataset open-data. Ce rapport ira dans ton portfolio.",
    objectives: [
      "Choisir un dataset intéressant",
      "Formuler 5 questions analytiques",
      "Produire des visualisations claires",
      "Rédiger les conclusions en langage client",
    ],
    steps: [
      {
        title: "Choisir et préparer",
        content: "Choisis un dataset sur data.gouv.fr ou Kaggle qui t'intéresse vraiment. L'intérêt personnel se voit dans l'analyse.",
        tip: "Critères : au moins 10 000 lignes, au moins 5 colonnes, données des 5 dernières années.",
      },
      {
        title: "Jupyter Notebook structuré",
        content: "Structure ton notebook en sections claires avec des cellules Markdown entre les analyses.",
        code: `# Structure recommandée

## 1. Introduction et contexte
## 2. Chargement et exploration initiale
## 3. Nettoyage des données
## 4. Analyse et visualisations
   ### Q1 : ...
   ### Q2 : ...
   ### Q3 : ...
## 5. Conclusions et recommandations`,
        tip: "Écris les conclusions en langage non-technique. Imagine que tu présentes à un directeur commercial.",
      },
    ],
    prevModule: "sql-advanced",
    nextModule: "data-marketplace",
  },

  "data-marketplace": {
    id: "data-marketplace",
    title: "Accès aux missions Data",
    duration: "∞",
    type: "project",
    intro:
      "Tu as terminé le parcours Data Analyst ! Tu peux maintenant postuler aux missions data sur la marketplace.",
    objectives: [
      "Accéder aux missions data/analytics",
      "Postuler à ta première mission réelle",
      "Décrocher ton badge Data Junior Verified",
    ],
    steps: [
      {
        title: "Tu es prêt(e) !",
        content:
          "Python, Pandas, Matplotlib, Plotly, SQL — tu maîtrises maintenant la stack data junior complète. Les clients sur JuniorCode attendent des profils comme le tien.",
        tip: "Mets ton Jupyter Notebook de rapport dans ton GitHub. C'est ton meilleur portfolio.",
      },
    ],
    prevModule: "report",
  },

  // UI Designer remaining modules
  "ui-components": {
    id: "ui-components",
    title: "Créer un système de composants Figma",
    duration: "75 min",
    type: "lesson",
    intro:
      "Un design system te fait gagner 70% de temps sur les projets suivants. Crée-le une fois, utilise-le partout.",
    objectives: [
      "Créer des composants Figma réutilisables",
      "Utiliser les variants pour les états",
      "Créer un fichier de tokens (couleurs, typo, spacing)",
      "Partager ton design system",
    ],
    steps: [
      {
        title: "Créer ton premier composant",
        content: "Dans Figma, sélectionne un groupe et fais Cmd+Alt+K pour en faire un composant.",
        tip: "Nomme tes composants avec des / pour créer une hiérarchie : Button/Primary, Button/Secondary, Button/Ghost",
      },
    ],
    prevModule: "first-wireframe",
    nextModule: "spacing-grid",
  },

  "spacing-grid": {
    id: "spacing-grid",
    title: "Grilles, espacement & alignement",
    duration: "45 min",
    type: "lesson",
    intro: "Une bonne grille est invisible — mais son absence se voit immédiatement.",
    objectives: [
      "Utiliser une grille 8pt system",
      "Créer des marges et gouttières cohérentes",
      "Aligner parfaitement les éléments",
    ],
    steps: [
      {
        title: "Le système 8pt",
        content: "Tous tes espacements sont des multiples de 8 : 8, 16, 24, 32, 48, 64...",
        tip: "Le 8pt system vient de Material Design. Sur mobile, utilise aussi 4pt pour les micro-espacements.",
      },
    ],
    prevModule: "ui-components",
    nextModule: "ui-kit",
  },

  "ui-kit": {
    id: "ui-kit",
    title: "🔨 Design Kit complet",
    duration: "3h",
    type: "project",
    intro: "Tu vas créer un kit UI complet dans Figma : boutons, inputs, cards, navigation, badges.",
    objectives: [
      "Créer 20+ composants cohérents",
      "Définir les variants (tailles, états)",
      "Documenter chaque composant",
      "Publier sur Figma Community",
    ],
    steps: [
      { title: "Démarrer le kit", content: "Crée une page 'Components' dans Figma. Organise-la en sections : Fondations, Atoms, Molecules, Organisms.", tip: "Suit la méthodologie Atomic Design de Brad Frost." },
    ],
    prevModule: "spacing-grid",
    nextModule: "dark-mode",
  },

  "dark-mode": {
    id: "dark-mode",
    title: "🔨 Passer ton UI en dark mode",
    duration: "2h",
    type: "exercise",
    intro: "Prends ton UI Kit et crée une version dark mode. Exercice d'alternance de palette.",
    objectives: ["Créer les variables dark dans Figma", "Adapter contrastes et lisibilité", "Faire coexister les deux thèmes"],
    steps: [
      { title: "Variables Figma", content: "Figma Variables te permet de stocker les couleurs et de les swapper d'un thème à l'autre en un clic.", tip: "Sur les variables de couleur, crée un groupe 'light' et un groupe 'dark'." },
    ],
    prevModule: "ui-kit",
    nextModule: "case-study",
  },

  "case-study": {
    id: "case-study",
    title: "Rédiger un case study convaincant",
    duration: "45 min",
    type: "lesson",
    intro: "Le case study est la pièce maîtresse de ton portfolio design. Il montre ton processus, pas juste le résultat.",
    objectives: [
      "Structurer un case study en 5 sections",
      "Documenter ton processus de design",
      "Quantifier l'impact de tes décisions",
    ],
    steps: [
      {
        title: "Structure en 5 sections",
        content: "Contexte → Problème → Recherche → Solution → Résultats.",
        tip: "La section 'Résultats' est la plus importante. Si tu n'as pas de métriques, parle des décisions prises et pourquoi.",
      },
    ],
    prevModule: "dark-mode",
    nextModule: "portfolio-design",
  },

  "portfolio-design": {
    id: "portfolio-design",
    title: "🔨 Portfolio Behance / Figma Community",
    duration: "4h",
    type: "project",
    intro: "Publie ton meilleur case study sur Behance OU Figma Community. C'est ta vitrine publique.",
    objectives: ["Sélectionner ton meilleur projet", "Rédiger le case study complet", "Publier et promouvoir"],
    steps: [
      { title: "Publier sur Behance", content: "Behance est le réseau n°1 des designers. Crée un compte et publie ton projet avec 8-12 images.", tip: "Tague tes projets correctement : UI, Mobile, Web Design, Branding. Le SEO Behance dépend des tags." },
    ],
    prevModule: "case-study",
    nextModule: "client-pitch",
  },

  "client-pitch": {
    id: "client-pitch",
    title: "Présenter son design à un client",
    duration: "30 min",
    type: "lesson",
    intro: "La présentation compte autant que le design. Un bon pitch peut vendre un design imparfait.",
    objectives: [
      "Structurer une présentation de 10 minutes",
      "Justifier ses choix avec des données",
      "Gérer les retours et les objections",
    ],
    steps: [
      {
        title: "Le framework de présentation",
        content: "Contexte (2min) → Problème (2min) → Solution (4min) → Prochaines étapes (2min).",
        tip: "Ne commence jamais par montrer le design. Rappelle d'abord le problème que tu résous.",
      },
    ],
    prevModule: "portfolio-design",
  },
};

// ─── Path → modules ordered list (for prev/next navigation) ──────────────────
const PATH_MODULE_ORDER: Record<string, string[]> = {
  "web-developer": [
    "html-basics", "css-basics", "first-landing", "git-basics", "github-publish",
    "js-basics", "js-dom", "todo-app", "react-intro", "portfolio",
    "read-offer", "apply", "quote", "marketplace-intro",
  ],
  "ui-designer": [
    "design-thinking", "color-theory", "figma-intro", "first-wireframe",
    "ui-components", "spacing-grid", "ui-kit", "dark-mode",
    "case-study", "portfolio-design", "client-pitch",
  ],
  "data-analyst": [
    "python-intro", "pandas-intro", "first-analysis", "data-cleaning",
    "matplotlib", "plotly", "dashboard",
    "sql-basics", "sql-advanced", "report", "data-marketplace",
  ],
};

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string; moduleId: string }>;
}): Promise<Metadata> {
  const languageCookie = cookies().get("juniorcode-language")?.value?.toLowerCase().slice(0, 2);
  const language = SUPPORTED_LANGUAGES.includes(languageCookie as Language)
    ? (languageCookie as Language)
    : "fr";
  const copy = MODULE_PAGE_COPY[language];

  const { moduleId } = await params;
  const mod = MODULES[moduleId];
  return {
    title: mod ? mod.title : copy.module,
    description: mod?.intro ?? "Module JuniorCode Learn.",
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function typeIcon(type: ModuleType) {
  if (type === "project")  return <Hammer  className="h-4 w-4" />;
  if (type === "exercise") return <Zap     className="h-4 w-4" />;
  return                          <BookOpen className="h-4 w-4" />;
}

function typeLabel(type: ModuleType, language: Language) {
  const copy = MODULE_PAGE_COPY[language];
  if (type === "project") return copy.project;
  if (type === "exercise") return copy.exercise;
  return copy.lesson;
}

function typeBg(type: ModuleType) {
  if (type === "project")  return "bg-brand-500/20 text-brand-300 border-brand-500/30";
  if (type === "exercise") return "bg-learn-500/20 text-learn-300 border-learn-500/30";
  return "bg-white/10 text-white/70 border-white/20";
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ModulePage({
  params,
}: {
  readonly params: Promise<{ path: string; moduleId: string }>;
}) {
  const languageCookie = cookies().get("juniorcode-language")?.value?.toLowerCase().slice(0, 2);
  const language = SUPPORTED_LANGUAGES.includes(languageCookie as Language)
    ? (languageCookie as Language)
    : "fr";
  const copy = MODULE_PAGE_COPY[language];

  const { path, moduleId } = await params;

  const mod = MODULES[moduleId];
  if (!mod) notFound();

  const order    = PATH_MODULE_ORDER[path] ?? [];
  const curIdx   = order.indexOf(moduleId);
  const prevId   = curIdx > 0 ? order[curIdx - 1] : null;
  const nextId   = curIdx >= 0 && curIdx < order.length - 1 ? order[curIdx + 1] : null;
  const prevMod  = prevId ? MODULES[prevId] : null;
  const nextMod  = nextId ? MODULES[nextId] : null;
  const pathLabel = PATH_LABELS[path]?.[language] ?? path.replaceAll("-", " ");

  return (
    <div className="min-h-screen bg-[#070b16] text-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-white/50">
          <Link href="/learn" className="hover:text-white transition-colors">{copy.learn}</Link>
          <span>/</span>
          <Link href={`/learn/${path}`} className="hover:text-white transition-colors capitalize">
            {pathLabel}
          </Link>
          <span>/</span>
          <span className="text-white/80">{mod.title}</span>
        </nav>

        {/* Module header */}
        <div className="mb-8 rounded-2xl border border-white/15 bg-white/[0.05] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${typeBg(mod.type)}`}>
              {typeIcon(mod.type)}
              {typeLabel(mod.type, language)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/60">
              <Clock3 className="h-3.5 w-3.5" />
              {mod.duration}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-3">{mod.title}</h1>
          <p className="text-white/70 leading-relaxed">{mod.intro}</p>
        </div>

        {/* Objectives */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-brand-300" />
            <h2 className="font-semibold">{copy.objectives}</h2>
          </div>
          <ul className="space-y-2">
            {mod.objectives.map((obj) => (
              <li key={obj} className="flex items-start gap-3 text-sm text-white/75">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-learn-400" />
                {obj}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-8">
          {mod.steps.map((step, i) => (
            <div key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-6 py-4">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-600/60 text-xs font-bold">
                  {i + 1}
                </div>
                <h3 className="font-semibold">{step.title}</h3>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-white/70 text-sm leading-relaxed">{step.content}</p>

                {step.code && (
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2">
                      <Code2 className="h-4 w-4 text-white/40" />
                      <span className="text-xs text-white/40 font-mono">code</span>
                    </div>
                    <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-green-300 font-mono bg-black/30">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                )}

                {step.tip && (
                  <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
                    <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                    <p className="text-sm text-amber-200/90">{step.tip}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Resources */}
        {mod.resources && mod.resources.length > 0 && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-semibold mb-4">{copy.resources}</h2>
            <ul className="space-y-2">
              {mod.resources.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-brand-300 hover:text-brand-200 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mark complete + nav */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Previous */}
            <div className="flex-1">
              {prevMod && (
                <Link
                  href={`/learn/${path}/${prevMod.id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:block truncate max-w-[160px]">{prevMod.title}</span>
                  <span className="sm:hidden">{copy.previous}</span>
                </Link>
              )}
            </div>

            {/* Back to path */}
            <Link
              href={`/learn/${path}`}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              {copy.backToPath}
            </Link>

            {/* Next */}
            <div className="flex-1 flex justify-end">
              {nextMod ? (
                <Link
                  href={`/learn/${path}/${nextMod.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500"
                >
                  <span className="hidden sm:block truncate max-w-[160px]">{nextMod.title}</span>
                  <span className="sm:hidden">{copy.next}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 rounded-xl bg-learn-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-learn-500"
                >
                  {copy.viewMissions}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
