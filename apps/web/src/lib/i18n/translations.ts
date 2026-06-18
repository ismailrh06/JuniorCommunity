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
    logout: string;
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
    journeyTitle: string;
    journeyDesc: string;
    journeySteps: Array<{
      step: number;
      icon: string;
      title: string;
      desc: string;
      tag: string;
    }>;
    badgeProofTitle: string;
    badgeProofDesc: string;
    badgeProofItems: Array<{ emoji: string; title: string; proof: string }>;
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
      logout: "Se déconnecter",
    },
    home: {
      waitlist: "Bêta privée — Cohorte 01",
      titlePrefix: "Deviens junior",
      titleGradient: "avec des preuves concrètes",
      subtitle:
        "Apprends en construisant, pratique sur des missions réelles, décroche tes premiers revenus avec une expérience qui te rend recrutable.",
      subtitleStrong: "Apprendre / Pratiquer / Postuler",
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
      journeyTitle: "Apprendre → Construire → Certifié → Postuler",
      journeyDesc:
        "Un parcours conçu pour que chaque heure passée compte. Tu progresses, tu prouves, tu décroches.",
      journeySteps: [
        {
          step: 1,
          icon: "01",
          title: "Apprendre",
          desc: "Suis un parcours structuré : vidéos, exercices, mini-projets guidés étape par étape.",
          tag: "JC Learn",
        },
        {
          step: 2,
          icon: "02",
          title: "Construire",
          desc: "Réalise des projets concrets qui alimentent ton portfolio — landing page, app, dashboard.",
          tag: "JC Learn",
        },
        {
          step: 3,
          icon: "03",
          title: "Être certifié",
          desc: "Obtiens ton badge Verified Junior validé par nos mentors. C'est ta preuve pour les clients.",
          tag: "Badge",
        },
        {
          step: 4,
          icon: "04",
          title: "Postuler",
          desc: "Accède aux missions Junior-Only et décroche tes premiers projets rémunérés.",
          tag: "Marketplace",
        },
      ],
      badgeProofTitle: "Les badges : tes preuves, pas juste des récompenses",
      badgeProofDesc:
        "Chaque badge certifie une compétence réelle. Les clients voient tes badges sur ton profil avant de te choisir.",
      badgeProofItems: [
        {
          emoji: "WD",
          title: "Web Developer L1",
          proof: "A livré une landing page responsive et déployée en ligne.",
        },
        {
          emoji: "RE",
          title: "React Developer",
          proof:
            "A construit une SPA complète avec composants, état et routing.",
        },
        {
          emoji: "DA",
          title: "Data Analyst",
          proof:
            "A analysé un dataset réel et produit un dashboard interactif.",
        },
      ],
      finalTitle: "Prêt à lancer ta carrière ?",
      finalDesc:
        "Inscris-toi à la bêta privée et sois parmi les premiers à apprendre, pratiquer et décrocher tes premiers projets.",
      finalCta: "Rejoindre la bêta gratuite",
      stats: {
        learners: "Apprenants actifs",
        projects: "Projets publiés",
        hired: "Juniors placés",
        clients: "Clients satisfaits",
      },
    },
    footer: {
      tagline:
        "La fabrique de juniors employables.\nApprendre → Pratiquer → Être payé.",
      copyright: "Tous droits réservés.",
      madeForJuniors: "Construit pour les juniors ambitieux",
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
      logout: "Sign out",
    },
    home: {
      waitlist: "Private beta — Cohort 01",
      titlePrefix: "Become a junior",
      titleGradient: "with concrete proof",
      subtitle:
        "Learn by building, practice on real missions, and earn your first income with work that makes you hireable.",
      subtitleStrong: "Learn / Practice / Apply",
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
      journeyTitle: "Learn → Build → Get certified → Apply",
      journeyDesc:
        "A path designed so every hour you put in counts. You progress, you prove it, you land projects.",
      journeySteps: [
        {
          step: 1,
          icon: "01",
          title: "Learn",
          desc: "Follow a structured path: videos, exercises, and guided mini-projects step by step.",
          tag: "JC Learn",
        },
        {
          step: 2,
          icon: "02",
          title: "Build",
          desc: "Ship real projects that fill your portfolio — landing page, app, dashboard.",
          tag: "JC Learn",
        },
        {
          step: 3,
          icon: "03",
          title: "Get certified",
          desc: "Earn your Verified Junior badge validated by our mentors. That's your proof for clients.",
          tag: "Badge",
        },
        {
          step: 4,
          icon: "04",
          title: "Apply",
          desc: "Access Junior-Only missions and land your first paid projects.",
          tag: "Marketplace",
        },
      ],
      badgeProofTitle: "Badges: your proof, not just rewards",
      badgeProofDesc:
        "Each badge certifies a real skill. Clients see your badges on your profile before choosing you.",
      badgeProofItems: [
        {
          emoji: "WD",
          title: "Web Developer L1",
          proof: "Delivered a responsive landing page deployed online.",
        },
        {
          emoji: "RE",
          title: "React Developer",
          proof: "Built a complete SPA with components, state and routing.",
        },
        {
          emoji: "DA",
          title: "Data Analyst",
          proof: "Analysed a real dataset and built an interactive dashboard.",
        },
      ],
      finalTitle: "Ready to launch your career?",
      finalDesc:
        "Sign up for the private beta and be among the first to learn, build, and land your first projects.",
      finalCta: "Join the free beta",
      stats: {
        learners: "Active learners",
        projects: "Published projects",
        hired: "Juniors hired",
        clients: "Happy clients",
      },
    },
    footer: {
      tagline:
        "The studio for job-ready juniors.\nLearn → Practice → Get paid.",
      copyright: "All rights reserved.",
      madeForJuniors: "Built for ambitious juniors",
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
      logout: "Cerrar sesión",
    },
    home: {
      waitlist: "Beta privada — Cohorte 01",
      titlePrefix: "Conviértete en junior",
      titleGradient: "con pruebas concretas",
      subtitle:
        "Aprende construyendo, practica en misiones reales y gana tus primeros ingresos con experiencia que te hace contrat-able.",
      subtitleStrong: "Aprender / Practicar / Postular",
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
      journeyTitle: "Aprender → Construir → Certificarte → Postular",
      journeyDesc:
        "Un recorrido donde cada hora invertida cuenta. Progresas, lo demuestras, consigues proyectos.",
      journeySteps: [
        {
          step: 1,
          icon: "01",
          title: "Aprender",
          desc: "Sigue una ruta estructurada: vídeos, ejercicios y mini-proyectos guiados paso a paso.",
          tag: "JC Learn",
        },
        {
          step: 2,
          icon: "02",
          title: "Construir",
          desc: "Entrega proyectos reales para tu portfolio — landing page, app, dashboard.",
          tag: "JC Learn",
        },
        {
          step: 3,
          icon: "03",
          title: "Certificarte",
          desc: "Obtén tu badge Verified Junior validado por nuestros mentores. Es tu prueba ante los clientes.",
          tag: "Badge",
        },
        {
          step: 4,
          icon: "04",
          title: "Postular",
          desc: "Accede a misiones Junior-Only y consigue tus primeros proyectos pagados.",
          tag: "Marketplace",
        },
      ],
      badgeProofTitle: "Los badges: tus pruebas, no solo recompensas",
      badgeProofDesc:
        "Cada badge certifica una habilidad real. Los clientes ven tus badges en tu perfil antes de elegirte.",
      badgeProofItems: [
        {
          emoji: "WD",
          title: "Web Developer L1",
          proof:
            "Ha entregado una landing page responsive desplegada en línea.",
        },
        {
          emoji: "RE",
          title: "React Developer",
          proof:
            "Ha construido una SPA completa con componentes, estado y routing.",
        },
        {
          emoji: "DA",
          title: "Data Analyst",
          proof:
            "Ha analizado un dataset real y creado un dashboard interactivo.",
        },
      ],
      finalTitle: "¿Listo para lanzar tu carrera?",
      finalDesc:
        "Apúntate a la beta privada y sé de los primeros en aprender, construir y conseguir tus primeros proyectos.",
      finalCta: "Unirse a la beta gratis",
      stats: {
        learners: "Estudiantes activos",
        projects: "Proyectos publicados",
        hired: "Juniors contratados",
        clients: "Clientes satisfechos",
      },
    },
    footer: {
      tagline:
        "La fábrica de juniors empleables.\nAprender → Practicar → Cobrar.",
      copyright: "Todos los derechos reservados.",
      madeForJuniors: "Construido para juniors ambiciosos",
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
