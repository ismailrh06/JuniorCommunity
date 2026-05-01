export type Language = "fr" | "en" | "es";

export const SUPPORTED_LANGUAGES: Language[] = ["fr", "en", "es"];

type Messages = {
  nav: {
    learn: string;
    marketplace: string;
    dashboard: string;
    login: string;
    start: string;
    profile: string;
    language: string;
  };
  home: {
    waitlist: string;
    titlePrefix: string;
    titleGradient: string;
    subtitle: string;
    subtitleStrong: string;
    ctaLearn: string;
    ctaMarketplace: string;
    platformTag: string;
    ecosystemTitle: string;
    ecosystemDesc: string;
    learnTitle: string;
    learnDesc: string;
    learnCta: string;
    marketTitle: string;
    marketDesc: string;
    marketCta: string;
    timelineTitle: string;
    timelineDesc: string;
    finalTitle: string;
    finalDesc: string;
    finalCta: string;
    stats: {
      learners: string;
      projects: string;
      hired: string;
      clients: string;
    };
  };
  footer: {
    tagline: string;
    copyright: string;
    madeForJuniors: string;
    sections: {
      product: string;
      learn: string;
      business: string;
      legal: string;
    };
    links: {
      jcLearn: string;
      marketplace: string;
      pricing: string;
      roadmap: string;
      webDev: string;
      uiDesigner: string;
      dataAnalyst: string;
      allPaths: string;
      postProject: string;
      whyJuniorCode: string;
      testimonials: string;
      contact: string;
      terms: string;
      privacy: string;
      cookies: string;
    };
  };
};

export const translations: Record<Language, Messages> = {
  fr: {
    nav: {
      learn: "Learn",
      marketplace: "Marketplace",
      dashboard: "Dashboard",
      login: "Connexion",
      start: "Commencer",
      profile: "Mon profil",
      language: "Langue",
    },
    home: {
      waitlist: "🚀 Bientôt disponible — Rejoins la liste d'attente",
      titlePrefix: "La fabrique de",
      titleGradient: "juniors employables",
      subtitle:
        "Apprends en construisant, pratique sur des missions réelles, décroche tes premiers revenus avec une expérience qui te rend recrutable.",
      subtitleStrong: "Apprendre → Pratiquer → Être payé.",
      ctaLearn: "Commencer à apprendre",
      ctaMarketplace: "Explorer la marketplace",
      platformTag: "Plateforme hybride",
      ecosystemTitle: "Un écosystème complet, pas un simple cours",
      ecosystemDesc:
        "Le design est pensé pour la clarté, l’action et la progression. Chaque bloc pousse vers la prochaine étape.",
      learnTitle: "JuniorCode Learn",
      learnDesc:
        "Parcours orienté action, avec objectifs concrets et validation continue. Tu progresses par réalisations, pas par théorie.",
      learnCta: "Commencer gratuitement",
      marketTitle: "JuniorCode Marketplace",
      marketDesc:
        "Missions réelles pour juniors, process cadré, paiements sécurisés, et accompagnement pour professionnaliser ta pratique.",
      marketCta: "Voir les projets",
      timelineTitle: "Le parcours Learn en 5 niveaux",
      timelineDesc: "Une progression claire, animée par des livrables réels.",
      finalTitle: "Prêt à lancer ta carrière ?",
      finalDesc:
        "Rejoins des centaines de juniors qui apprennent, pratiquent et gagnent déjà avec JuniorCode.",
      finalCta: "Créer mon compte gratuitement",
      stats: {
        learners: "Apprenants actifs",
        projects: "Projets publiés",
        hired: "Juniors placés",
        clients: "Clients satisfaits",
      },
    },
    footer: {
      tagline: "La fabrique de juniors employables.\nApprendre → Pratiquer → Être payé.",
      copyright: "Tous droits réservés.",
      madeForJuniors: "Fait avec ❤️ pour les juniors",
      sections: {
        product: "Produit",
        learn: "Apprendre",
        business: "Entreprise",
        legal: "Légal",
      },
      links: {
        jcLearn: "JuniorCode Learn",
        marketplace: "Marketplace",
        pricing: "Tarifs",
        roadmap: "Roadmap",
        webDev: "Développeur Web",
        uiDesigner: "Designer UI",
        dataAnalyst: "Data Analyst",
        allPaths: "Tous les parcours",
        postProject: "Publier un projet",
        whyJuniorCode: "Pourquoi JuniorCode ?",
        testimonials: "Témoignages",
        contact: "Contact",
        terms: "CGU",
        privacy: "Confidentialité",
        cookies: "Cookies",
      },
    },
  },
  en: {
    nav: {
      learn: "Learn",
      marketplace: "Marketplace",
      dashboard: "Dashboard",
      login: "Login",
      start: "Get Started",
      profile: "My profile",
      language: "Language",
    },
    home: {
      waitlist: "🚀 Coming soon — Join the waitlist",
      titlePrefix: "The studio for",
      titleGradient: "job-ready juniors",
      subtitle:
        "Learn by building, practice on real missions, and earn your first income with work that makes you hireable.",
      subtitleStrong: "Learn → Practice → Get paid.",
      ctaLearn: "Start learning",
      ctaMarketplace: "Explore marketplace",
      platformTag: "Hybrid platform",
      ecosystemTitle: "A full ecosystem, not just a course",
      ecosystemDesc:
        "The experience is built for clarity, action, and progression. Each block pushes you to the next milestone.",
      learnTitle: "JuniorCode Learn",
      learnDesc:
        "Action-based learning path with concrete goals and continuous validation. You progress through real deliverables.",
      learnCta: "Start for free",
      marketTitle: "JuniorCode Marketplace",
      marketDesc:
        "Real junior missions, guided workflow, secure payments, and support to professionalize your practice.",
      marketCta: "Browse projects",
      timelineTitle: "Learn path in 5 levels",
      timelineDesc: "Clear progression powered by real deliverables.",
      finalTitle: "Ready to launch your career?",
      finalDesc:
        "Join hundreds of juniors already learning, shipping, and earning with JuniorCode.",
      finalCta: "Create my free account",
      stats: {
        learners: "Active learners",
        projects: "Published projects",
        hired: "Juniors hired",
        clients: "Happy clients",
      },
    },
    footer: {
      tagline: "The studio for job-ready juniors.\nLearn → Practice → Get paid.",
      copyright: "All rights reserved.",
      madeForJuniors: "Built with ❤️ for juniors",
      sections: {
        product: "Product",
        learn: "Learn",
        business: "Business",
        legal: "Legal",
      },
      links: {
        jcLearn: "JuniorCode Learn",
        marketplace: "Marketplace",
        pricing: "Pricing",
        roadmap: "Roadmap",
        webDev: "Web Developer",
        uiDesigner: "UI Designer",
        dataAnalyst: "Data Analyst",
        allPaths: "All learning paths",
        postProject: "Post a project",
        whyJuniorCode: "Why JuniorCode?",
        testimonials: "Testimonials",
        contact: "Contact",
        terms: "Terms",
        privacy: "Privacy",
        cookies: "Cookies",
      },
    },
  },
  es: {
    nav: {
      learn: "Aprender",
      marketplace: "Marketplace",
      dashboard: "Panel",
      login: "Iniciar sesión",
      start: "Comenzar",
      profile: "Mi perfil",
      language: "Idioma",
    },
    home: {
      waitlist: "🚀 Muy pronto — Únete a la lista de espera",
      titlePrefix: "La fábrica de",
      titleGradient: "juniors empleables",
      subtitle:
        "Aprende construyendo, practica en misiones reales y gana tus primeros ingresos con experiencia que te hace contrat-able.",
      subtitleStrong: "Aprender → Practicar → Cobrar.",
      ctaLearn: "Empezar a aprender",
      ctaMarketplace: "Explorar marketplace",
      platformTag: "Plataforma híbrida",
      ecosystemTitle: "Un ecosistema completo, no solo un curso",
      ecosystemDesc:
        "La experiencia está pensada para claridad, acción y progreso. Cada bloque te lleva al siguiente nivel.",
      learnTitle: "JuniorCode Learn",
      learnDesc:
        "Ruta de aprendizaje orientada a la acción, con objetivos concretos y validación continua.",
      learnCta: "Empezar gratis",
      marketTitle: "JuniorCode Marketplace",
      marketDesc:
        "Proyectos reales para juniors, proceso guiado, pagos seguros y acompañamiento profesional.",
      marketCta: "Ver proyectos",
      timelineTitle: "Ruta Learn en 5 niveles",
      timelineDesc: "Progresión clara basada en entregables reales.",
      finalTitle: "¿Listo para lanzar tu carrera?",
      finalDesc:
        "Únete a cientos de juniors que ya están aprendiendo, entregando y ganando con JuniorCode.",
      finalCta: "Crear mi cuenta gratis",
      stats: {
        learners: "Estudiantes activos",
        projects: "Proyectos publicados",
        hired: "Juniors contratados",
        clients: "Clientes satisfechos",
      },
    },
    footer: {
      tagline: "La fábrica de juniors empleables.\nAprender → Practicar → Cobrar.",
      copyright: "Todos los derechos reservados.",
      madeForJuniors: "Hecho con ❤️ para juniors",
      sections: {
        product: "Producto",
        learn: "Aprender",
        business: "Empresa",
        legal: "Legal",
      },
      links: {
        jcLearn: "JuniorCode Learn",
        marketplace: "Marketplace",
        pricing: "Precios",
        roadmap: "Roadmap",
        webDev: "Desarrollador Web",
        uiDesigner: "Diseñador UI",
        dataAnalyst: "Analista de Datos",
        allPaths: "Todas las rutas",
        postProject: "Publicar proyecto",
        whyJuniorCode: "¿Por qué JuniorCode?",
        testimonials: "Testimonios",
        contact: "Contacto",
        terms: "Términos",
        privacy: "Privacidad",
        cookies: "Cookies",
      },
    },
  },
};
