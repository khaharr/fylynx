export interface Article {
  slug: string;
  title: string;
  description: string;
  category: 'Guide Pratique' | 'Anti-Fraude & IA' | 'Marque Blanche' | 'Automatisation & API';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  keywords: string[];
  featured?: boolean;
  contentHtml: string;
}

export const BLOG_ARTICLES: Article[] = [
  {
    slug: 'comment-recuperer-document-justificatif-client',
    title: 'Comment récupérer un document justificatif client rapidement et sans relance interminable ?',
    description: 'Guide étape par étape pour obtenir 100% des pièces justificatives de vos clients en moins de 48h grâce aux liens de dépôt mobiles et aux relances automatiques.',
    category: 'Guide Pratique',
    author: {
      name: 'Alexandre Mercier',
      role: 'Expert en Dématérialisation & GED',
      avatar: '/fylynx-logo.png',
    },
    publishedAt: '2026-09-24',
    readTime: '7 min de lecture',
    keywords: [
      'comment récupérer document justificatif client',
      'collecte documents client',
      'demande de pièces justificatives',
      'relance client justificatif',
      'dépôt sécurisé document',
    ],
    featured: true,
    contentHtml: `
      <h2>1. Les 3 raisons pour lesquelles vos clients tardent à envoyer leurs pièces</h2>
      <p>
        Si vous passez des heures à relancer vos clients pour obtenir une pièce d'identité, un RIB ou un justificatif de domicile, vous n'êtes pas seul. En moyenne, <strong>65% des retards dans l'ouverture d'un dossier</strong> sont dus à des blocages lors de la collecte documentaire.
      </p>
      <p>Voici les 3 freins principaux rencontrés par vos clients :</p>
      <ul>
        <li><strong>La complexité du processus :</strong> Devoir scanner un document papier, le transférer par e-mail ou créer un compte sur un portail complexe décourage les clients.</li>
        <li><strong>L'oubli et le manque de rappel structuré :</strong> Sans relance automatique aux moments clés, la demande est noyée au milieu d'autres e-mails.</li>
        <li><strong>Le doute sur la conformité de la pièce :</strong> Le client envoie un document périmé ou flou, nécessitant des allers-retours incessants.</li>
      </ul>

      <h2>2. La solution moderne : Le lien unique de dépôt mobile en 1-clic</h2>
      <p>
        Pour supprimer ces frictions, la meilleure pratique en 2026 consiste à envoyer un <strong>lien sécurisé unique par e-mail</strong>. 
      </p>
      <p>
        Lorsque le client clique sur le lien depuis son smartphone :
      </p>
      <ol>
        <li>Aucun mot de passe ou création de compte n'est requis (zéro friction).</li>
        <li>L'appareil photo s'ouvre directement pour prendre le document en photo.</li>
        <li>L'IA Fylynx vérifie immédiatement la lisibilité et la récence avant la validation.</li>
      </ol>

      <h2>3. Automatiser les relances quotidiennes par e-mail</h2>
      <p>
        En paramétrant des relances automatiques courtoises (tous les 24h ou 48h), Fylynx s'occupe de rappeler au client uniquement les pièces manquantes. Vous recevez une notification en temps réel dès que le dossier est complet.
      </p>
      <p>
        <strong>Résultat constaté :</strong> 94% des dossiers sont complétés et certifiés en moins de 48 heures.
      </p>

      <h2>4. Modèle d'e-mail type pour demander des pièces justificatives</h2>
      <p>Voici un exemple de message clair et incitatif à envoyer à vos clients :</p>
      <blockquote style="background: rgba(15, 23, 42, 0.6); border-left: 4px solid #6366f1; padding: 12px 16px; margin: 16px 0;">
        "Bonjour [Prénom du client],<br/><br/>
        Afin de finaliser la constitution de votre dossier [Nom du projet], merci de bien vouloir déposer vos pièces justificatives via votre espace sécurisé unique :<br/>
        👉 <strong>[Lien unique de dépôt mobile]</strong><br/><br/>
        Cela ne vous prendra que 30 secondes depuis votre smartphone. Merci pour votre confiance !<br/>
        L'équipe [Nom de votre entreprise]"
      </blockquote>

      <h2>5. Conclusion</h2>
      <p>
        Ne laissez plus la collecte de pièces freiner la croissance de votre entreprise. Avec Fylynx, simplifiez le dépôt pour vos clients et gagnez jusqu'à 15 heures par semaine.
      </p>
    `,
  },
  {
    slug: 'guide-complet-collecte-pieces-justificatives-immobilier',
    title: 'Guide Immobilier : Optimiser la collecte des dossiers de location & vente',
    description: 'Agences immobilières et administrateurs de biens : comment constituer des dossiers locataires et acquéreurs conformes et certifiés en 24h.',
    category: 'Guide Pratique',
    author: {
      name: 'Alexandre Mercier',
      role: 'Expert en Dématérialisation & GED',
      avatar: '/fylynx-logo.png',
    },
    publishedAt: '2026-09-23',
    readTime: '6 min de lecture',
    keywords: [
      'collecte dossier location immobilier',
      'pièces justificatives locataire',
      'vérification fiche de paie immobilier',
      'dossier acquéreur compromis',
      'Fylynx immobilier',
    ],
    featured: false,
    contentHtml: `
      <h2>1. Les enjeux de la collecte documentaire en agence immobilière</h2>
      <p>
        Qu'il s'agisse de constituer un dossier de candidature locative ou de rassembler les pièces nécessaires à la signature d'un compromis de vente, les négociateurs et gestionnaires immobiliers passent un temps considérable à réclamer et vérifier les pièces justificatives.
      </p>
      <h2>2. Détecter les faux bulletins de paie et avis d'imposition</h2>
      <p>
        Grâce au module d'inspection par IA Fylynx Vision, chaque dossier candidat est analysé en 3 secondes. Le système contrôle la cohérence des montants sur les fiches de paie et l'authenticité de l'avis d'imposition.
      </p>
      <h2>3. Organiser vos exports par dossier client</h2>
      <p>
        Une fois le dossier complété, exportez l'intégralité des pièces archivées et chiffrées au format ZIP en 1-clic pour transmission directe au notaire ou au propriétaire bailleur.
      </p>
    `,
  },
  {
    slug: 'conformite-rgpd-stockage-documents-clients-souverain',
    title: 'Conformité RGPD & Stockage Souverain : Où et comment stocker les documents clients ?',
    description: 'Cryptage AES-256, serveurs ISO 27001 certifiés en France/UE et règles de conservation pour protéger la confidentialité des données sensibles de vos clients.',
    category: 'Guide Pratique',
    author: {
      name: 'Dr. Sophie Laurent',
      role: 'Responsable Recherche IA & Vision',
      avatar: '/fylynx-logo.png',
    },
    publishedAt: '2026-09-22',
    readTime: '5 min de lecture',
    keywords: [
      'conformité RGPD pièces justificatives',
      'stockage souverain france europe',
      'chiffrement AES-256 documents',
      'sécurité données clients',
      'ISO 27001 SaaS',
    ],
    featured: false,
    contentHtml: `
      <h2>1. Les obligations du RGPD pour les pièces justificatives</h2>
      <p>
        Stocke-t-on les pièces d'identité et les justificatifs de domicile de ses clients dans une boîte mail non sécurisée ? La réponse de la CNIL est catégorique : c'est une violation grave du RGPD.
      </p>
      <h2>2. Le chiffrement AES-256 et le stockage souverain Fylynx</h2>
      <p>
        Fylynx garantit que chaque document déposé est immédiatement chiffré au repos avec la norme bancaire AES-256 et hébergé sur des infrastructures hautement sécurisées certifiées ISO 27001 situées exclusivement en France et dans l'Union Européenne.
      </p>
      <h2>3. Purge et durée de conservation automatique</h2>
      <p>
        Définissez des règles de purge automatique après la clôture d'un dossier pour respecter le principe de minimisation des données imposé par la réglementation européenne.
      </p>
    `,
  },
  {
    slug: 'top-5-erreurs-collecte-documents-b2b',
    title: 'Top 5 des erreurs à éviter absolument lors de la collecte de documents B2B',
    description: 'Découvrez les pièges les plus fréquents qui font fuir vos clients et découvrez les bonnes pratiques pour transformer vos processus d’onboarding.',
    category: 'Guide Pratique',
    author: {
      name: 'Julien Lambert',
      role: 'Directeur Produit & Design UI/UX',
      avatar: '/fylynx-logo.png',
    },
    publishedAt: '2026-09-21',
    readTime: '6 min de lecture',
    keywords: [
      'erreurs collecte de documents',
      'onboarding client b2b',
      'relance client efficace',
      'processus de vérification documentaire',
      'meilleures pratiques SaaS',
    ],
    featured: false,
    contentHtml: `
      <h2>1. Demander des documents inutiles ou redondants</h2>
      <p>
        Exiger 10 pièces justificatives alors que 3 suffisent augmente le taux d'abandon de 50%. Simplifiez vos modèles de demande au strict minimum.
      </p>
      <h2>2. Utiliser l'e-mail classique comme canal de réception</h2>
      <p>
        Les pièces jointes par e-mail dépassent souvent la taille maximale, tombent dans les spams et ne sont pas chiffrées. Privilégiez toujours un portail sécurisé.
      </p>
      <h2>3. Ne pas informer le client en temps réel lors du rejet d'une pièce</h2>
      <p>
        Si une pièce est rejetée (floue ou périmée), le client doit en être averti immédiatement par e-mail avec l'explication exacte pour renvoyer la bonne pièce sans attendre.
      </p>
    `,
  },
  {
    slug: 'comment-automatiser-collecte-pieces-justificatives',
    title: 'Comment automatiser la relance et la collecte de pièces justificatives en 2026 ?',
    description: 'Découvrez comment éliminer les e-mails chaotiques, réduire le temps de traitement de 80% et offrir un dépôt 1-clic mobile ultra-sécurisé à vos clients.',
    category: 'Guide Pratique',
    author: {
      name: 'Alexandre Mercier',
      role: 'Expert en Dématérialisation & GED',
      avatar: '/fylynx-logo.png',
    },
    publishedAt: '2026-09-20',
    readTime: '6 min de lecture',
    keywords: [
      'collecte de pièces justificatives',
      'relance automatique client',
      'logiciel GED',
      'dépôt de documents sécurisé',
      'onboarding client automatisé',
    ],
    featured: false,
    contentHtml: `
      <h2>1. Le problème historique : le chaos du suivi documentaire manuel</h2>
      <p>
        Pour la majorité des professionnels (agences immobilières, cabinets d'expertise comptable, courtiers, organismes de formation, services RH), la collecte des pièces justificatives est l'une des tâches les plus chronophages et ingrates. 
      </p>
      <p>
        Relancer manuellement par e-mail ou téléphone un client qui a oublié d'envoyer sa pièce d'identité ou son justificatif de domicile réclamé il y a 10 jours fait perdre des dizaines d'heures par mois et détériore l'image de marque.
      </p>

      <h2>2. La révolution du dépôt mobile en 1-clic sans mot de passe</h2>
      <p>
        Les clients de 2026 ne veulent plus créer un énième compte sur un espace client complexe ou scanner laborieusement leurs documents. 
      </p>
      <p>
        En recevant un <strong>lien unique sécurisé par e-mail</strong>, le client ouvre directement l'appareil photo de son smartphone, prend en photo son justificatif, et le dépose en moins de 30 secondes. 
      </p>

      <h2>3. Relances automatiques par e-mail</h2>
      <p>
        En configurant un flux de relances programmées (tous les jours ou tous les 3 jours), la plateforme s'occupe de rappeler courtoisement au client les pièces manquantes spécifiques jusqu'à la complétude totale du dossier.
      </p>
      <ul>
        <li><strong>Gain de temps :</strong> +80% de réduction du temps de collecte.</li>
        <li><strong>Taux de complétude :</strong> 94% des dossiers complétés sous 48 heures.</li>
        <li><strong>Sécurité :</strong> Chiffrement AES-256 au repos et conformité stricte RGPD.</li>
      </ul>

      <h2>4. Conclusion : Passez à l'action avec Fylynx</h2>
      <p>
        Adopter Fylynx vous permet de moderniser instantanément la collecte de vos dossiers. Essayez gratuitement pendant 14 jours sans carte bancaire !
      </p>
    `,
  },
  {
    slug: 'ia-anti-fraude-verification-documentaire-kyc',
    title: 'IA & Anti-Fraude Documentaire : Certifiez vos pièces justificatives en 2 secondes',
    description: 'Faux bulletins de paie, avis d’imposition photoshopés, pièces expirées... Comment l’IA de Fylynx inspecte les marqueurs officiels de sécurité instantanément.',
    category: 'Anti-Fraude & IA',
    author: {
      name: 'Dr. Sophie Laurent',
      role: 'Responsable Recherche IA & Vision',
      avatar: '/fylynx-logo.png',
    },
    publishedAt: '2026-09-18',
    readTime: '8 min de lecture',
    keywords: [
      'détection fraude documentaire',
      'contrôle IA fiche de paie',
      'avis d\'imposition frauduleux',
      'vérification CNI passeport',
      'KYC automatique',
    ],
    featured: false,
    contentHtml: `
      <h2>1. La hausse des fraudes documentaires en France</h2>
      <p>
        Avec la démocratisation des outils de retouche et d'IA générative, la falsification d'avis d'imposition, de fiches de paie et de justificatifs de domicile a augmenté de plus de 45% sur les deux dernières années.
      </p>

      <h2>2. Comment fonctionne l'IA de vérification Fylynx Vision ?</h2>
      <p>
        Contrairement à un simple contrôle visuel humain faillible, le moteur IA de Fylynx effectue 4 niveaux d'analyse approfondie en moins de 2 secondes :
      </p>
      <ol>
        <li><strong>Analyse de la structure & filigranes :</strong> Contrôle des bandes MRZ, tampons de la DGFIP, en-têtes officiels (EDF, Engie, Orange, etc.).</li>
        <li><strong>Rapprochement d'identité :</strong> Vérification de la stricte correspondance entre le nom du client et les informations extraites du document.</li>
        <li><strong>Détection des retouches numériques :</strong> Analyse au niveau du pixel pour détecter les modifications de texte ou de montants sur Photoshop.</li>
        <li><strong>Contrôle de récence :</strong> Vérification de la date d'émission (-3 mois pour les justificatifs de domicile).</li>
      </ol>

      <h2>3. Des rapports clairs transmis dans votre Dashboard et par Email</h2>
      <p>
        Dès qu'un document est soumis, vous recevez un diagnostic clair avec un score de confiance (0% à 100%) et la mention <em>✅ Certifié Conforme</em> ou <em>⚠️ Anomalie détectée</em>.
      </p>
    `,
  },
  {
    slug: 'marque-blanche-portail-client-cabinet-comptable-immobilier',
    title: 'Portail Client en Marque Blanche : Valorisez l\'image de votre cabinet',
    description: 'Affichez votre propre logo, vos couleurs d\'entreprise et vos consignes sur l\'interface de dépôt client pour instaurer un climat de confiance inégalé.',
    category: 'Marque Blanche',
    author: {
      name: 'Julien Lambert',
      role: 'Directeur Produit & Design UI/UX',
      avatar: '/fylynx-logo.png',
    },
    publishedAt: '2026-09-15',
    readTime: '5 min de lecture',
    keywords: [
      'portail client sur mesure',
      'marque blanche SaaS',
      'expérience client cabinet comptable',
      'personnalisation entreprise',
      'image de marque',
    ],
    featured: false,
    contentHtml: `
      <h2>1. L'importance de la confiance lors de la collecte de données sensibles</h2>
      <p>
        Demander à un client de transmettre une pièce d'identité ou un avis d'imposition nécessite une confiance absolue. Si l'interface de dépôt est générique ou sans logo, le client hésite.
      </p>

      <h2>2. Personnalisation à 100% de votre portail client</h2>
      <p>
        Avec les formules Pro, IA Enterprise et Agence Scale de Fylynx, vous bénéficiez de la marque blanche intégrale :
      </p>
      <ul>
        <li><strong>Logo d'entreprise :</strong> Importez votre logo PNG/SVG affiché en haut de l'interface client.</li>
        <li><strong>Couleurs de marque :</strong> Appliquez le code couleur exact de votre charte graphique.</li>
        <li><strong>Message d'accueil sur mesure :</strong> Rédigez vos propres consignes pour guider vos clients.</li>
      </ul>

      <h2>3. Résultats constatés par nos clients</h2>
      <p>
        Les cabinets d'expertise comptable et agences immobilières utilisant la marque blanche enregistrent un taux de dépôt au premier envoi supérieur de 32%.
      </p>
    `,
  },
  {
    slug: 'integration-zapier-make-notion-automatisation-documents',
    title: 'Intégration Zapier, Make & Notion : Automatisez votre workflow à 100%',
    description: 'Synchronisez instantanément vos dossiers validés vers Notion, HubSpot, Salesforce ou Google Drive grâce aux Webhooks SSL et l\'API Développeur.',
    category: 'Automatisation & API',
    author: {
      name: 'Thomas Dubois',
      role: 'Lead Architecte API & Webhooks',
      avatar: '/fylynx-logo.png',
    },
    publishedAt: '2026-09-10',
    readTime: '7 min de lecture',
    keywords: [
      'API gestion documentaire',
      'webhook zapier notion',
      'automatisation des dossiers',
      'make integromat',
      'crm hubspot salesforce',
    ],
    featured: false,
    contentHtml: `
      <h2>1. Pourquoi connecter votre GED à votre écosystème logiciel ?</h2>
      <p>
        Une fois un dossier client validé, devoir retélécharger manuellement les fichiers pour les reclasser dans votre CRM ou votre base Notion est une perte de temps inutile.
      </p>

      <h2>2. Les Webhooks temps réel et l'API Développeur</h2>
      <p>
        Grâce aux Webhooks HTTP de Fylynx (disponibles sur la formule <strong>Agence Scale</strong>), un événement <code>request.completed</code> est déclenché automatiquement dès que l'ensemble des pièces d'un dossier sont certifiées.
      </p>
      <p>
        Ce déclencheur permet d'exécuter des scénarios automatisés dans Zapier, Make ou n8n :
      </p>
      <ul>
        <li>Création automatique d'une fiche client dans Notion avec liens vers les pièces Google Drive.</li>
        <li>Changement du statut de l'opportunité dans HubSpot ou Salesforce.</li>
        <li>Envoi d'un message Slack / Teams à votre équipe.</li>
      </ul>
    `,
  },
];

const ARTICLE_TRANSLATIONS: Record<string, Record<string, Partial<Article>>> = {
  en: {
    'comment-recuperer-document-justificatif-client': {
      title: 'How to collect client supporting documents quickly without endless reminders?',
      description: 'Step-by-step guide to get 100% of your clients\' supporting documents in under 48 hours using mobile upload links and automated reminders.',
      readTime: '7 min read',
      author: { name: 'Alexandre Mercier', role: 'Document Automation & EDMS Expert', avatar: '/fylynx-logo.png' },
      keywords: ['collect client supporting documents', 'client document collection', 'supporting document request', 'client document reminder', 'secure document upload'],
      contentHtml: `
        <h2>1. The 3 main reasons clients delay sending their documents</h2>
        <p>If you spend hours chasing clients for ID cards, bank details, or proof of address, you are not alone. On average, <strong>65% of onboarding delays</strong> are caused by document collection bottlenecks.</p>
        <p>Here are the 3 main friction points faced by clients:</p>
        <ul>
          <li><strong>Process complexity:</strong> Having to scan paper documents, attach them to emails, or register on complex portals deters clients.</li>
          <li><strong>Forgetfulness & lack of reminders:</strong> Without automated follow-ups at key moments, requests get lost in overcrowded inboxes.</li>
          <li><strong>Uncertainty about document validity:</strong> Clients send expired or blurry documents, causing frustrating email exchanges.</li>
        </ul>
        <h2>2. The modern solution: 1-Click mobile upload link</h2>
        <p>To eliminate friction, the best practice in 2026 is sending a <strong>unique secure link via email</strong>.</p>
        <p>When the client clicks the link on their smartphone:</p>
        <ol>
          <li>No password or account creation is required (zero friction).</li>
          <li>The camera opens directly to take a crisp photo of the document.</li>
          <li>Fylynx AI instantly verifies legibility and issue date before submission.</li>
        </ol>
        <h2>3. Automate daily email reminders</h2>
        <p>By scheduling courteous automated follow-ups (every 24h or 48h), Fylynx reminds clients only about missing items. You receive real-time notifications once the file is complete.</p>
        <p><strong>Proven result:</strong> 94% of client files are completed and certified in less than 48 hours.</p>
      `,
    },
    'guide-complet-collecte-pieces-justificatives-immobilier': {
      title: 'Real Estate Guide: Optimize tenant and buyer document collection',
      description: 'Real estate agencies and property managers: how to gather compliant and certified tenant and buyer files in 24 hours.',
      readTime: '6 min read',
      author: { name: 'Alexandre Mercier', role: 'Document Automation & EDMS Expert', avatar: '/fylynx-logo.png' },
      keywords: ['real estate rental file collection', 'tenant supporting documents', 'pay slip verification real estate', 'buyer agreement file', 'Fylynx real estate'],
      contentHtml: `
        <h2>1. Document collection challenges in real estate agencies</h2>
        <p>Whether assembling a rental application or gathering documents for a sales agreement, real estate agents and property managers spend significant time requesting and verifying documents.</p>
        <h2>2. Detect fake pay slips and tax notices</h2>
        <p>With Fylynx Vision AI inspection module, every applicant file is analyzed in 3 seconds. The system verifies amount consistency on pay slips and authenticity of tax documents.</p>
        <h2>3. Organize your ZIP exports by client file</h2>
        <p>Once the file is complete, export all archived and encrypted documents into an organized ZIP format with 1 click for direct transmission to the notary or landlord.</p>
      `,
    },
    'conformite-rgpd-stockage-documents-clients-souverain': {
      title: 'GDPR Compliance & Sovereign Storage: Where and how to store client documents?',
      description: 'AES-256 encryption, ISO 27001 certified servers in France/EU, and retention rules to safeguard sensitive client data.',
      readTime: '5 min read',
      author: { name: 'Dr. Sophie Laurent', role: 'Head of AI & Vision Research', avatar: '/fylynx-logo.png' },
      keywords: ['GDPR supporting document compliance', 'sovereign storage france europe', 'AES-256 document encryption', 'client data security', 'ISO 27001 SaaS'],
      contentHtml: `
        <h2>1. GDPR obligations for supporting documents</h2>
        <p>Storing client IDs and proof of address in unencrypted email inboxes is a severe GDPR violation according to data protection authorities.</p>
        <h2>2. AES-256 Encryption & Sovereign Fylynx Storage</h2>
        <p>Fylynx guarantees that every uploaded document is immediately encrypted at rest using bank-grade AES-256 standards and hosted on ISO 27001 certified infrastructure located strictly in France and the EU.</p>
        <h2>3. Automated purging and retention policies</h2>
        <p>Define automatic purge rules after file closure to comply with data minimization principles mandated by European regulations.</p>
      `,
    },
    'top-5-erreurs-collecte-documents-b2b': {
      title: 'Top 5 mistakes to avoid when collecting B2B client documents',
      description: 'Discover the most common pitfalls that frustrate clients and learn best practices to streamline your onboarding process.',
      readTime: '6 min read',
      author: { name: 'Julien Lambert', role: 'Head of Product & UI/UX Design', avatar: '/fylynx-logo.png' },
      keywords: ['document collection mistakes', 'b2b client onboarding', 'effective client reminders', 'document verification process', 'SaaS best practices'],
      contentHtml: `
        <h2>1. Requesting unnecessary or redundant documents</h2>
        <p>Requiring 10 supporting documents when 3 are sufficient increases abandonment rates by 50%. Keep your request templates to the essential minimum.</p>
        <h2>2. Relying on standard email as a reception channel</h2>
        <p>Email attachments frequently exceed size limits, get marked as spam, and lack encryption. Always prefer a dedicated secure portal.</p>
        <h2>3. Failing to notify clients in real time when a document is rejected</h2>
        <p>If a document is rejected (blurry or expired), the client must be notified immediately by email with the exact reason so they can resubmit without delay.</p>
      `,
    },
  },
  ar: {
    'comment-recuperer-document-justificatif-client': {
      title: 'كيفية جمع المستندات المطلوبة من العملاء بسرعة وبدون تذكيرات مستمرة؟',
      description: 'دليل خطوة بخطوة للحصول على 100% من المستندات والوثائق الثبوتية لعملائك في أقل من 48 ساعة بفضل روابط الرفع عبر الجوال والتذكيرات التلقائية.',
      readTime: '7 دقائق قراءة',
      author: { name: 'ألكسندر ميرسييه', role: 'خبير الأتمتة وإدارة المستندات الرقمية', avatar: '/fylynx-logo.png' },
      contentHtml: `
        <h2>1. الأسباب الثلاثة الرئيسية لتأخر العملاء في إرسال مستنداتهم</h2>
        <p>إذا كنت تقضي ساعات في ملاحقة العملاء للحصول على بطاقة الهوية أو كشف الحساب البنكي، فلست وحدك. في المتوسط، <strong>65% من تأخيرات فتح الملفات</strong> تعود إلى عقبات جمع المستندات.</p>
        <h2>2. الحل الحديث: رابط الرفع الفريد بنقرة واحدة عبر الجوال</h2>
        <p>لإلغاء أي تعقيد، فإن أفضل ممارسة في عام 2026 هي إرسال <strong>رابط أمن وفريد عبر البريد الإلكتروني</strong>.</p>
        <h2>3. أتمتة التذكيرات اليومية عبر البريد الإلكتروني</h2>
        <p>بإعداد تذكيرات تلقائية ودية كل 24 أو 48 ساعة، يتولى Fylynx تذكير العميل فقط بالقطع المفقودة.</p>
      `,
    },
  },
  de: {
    'comment-recuperer-document-justificatif-client': {
      title: 'Wie Sie Kundendokumente schnell und ohne endlose Nachfassaktionen anfordern?',
      description: 'Schritt-für-Schritt-Anleitung, um 100% der Nachweise Ihrer Kunden in unter 48 Stunden über mobile Upload-Links und automatische Erinnerungen zu erhalten.',
      readTime: '7 Min. Lesezeit',
      author: { name: 'Alexandre Mercier', role: 'Experte für Dokumenten-Automatisierung', avatar: '/fylynx-logo.png' },
      contentHtml: `
        <h2>1. Die 3 Hauptgründe, warum Kunden Dokumente zu spät senden</h2>
        <p>Wenn Sie Stunden damit verbringen, Ausweise oder Adressnachweise nachzufordern, sind Sie nicht allein. Im Durchschnitt sind <strong>65% der Verzögerungen</strong> auf Engpässe bei der Dokumentenerfassung zurückzuführen.</p>
        <h2>2. Die moderne Lösung: Der 1-Klick-Upload-Link für Smartphones</h2>
        <p>Senden Sie Ihren Kunden einen <strong>einzigen sicheren Link per E-Mail</strong> ohne Registrierungszwang.</p>
        <h2>3. Automatische tägliche E-Mail-Erinnerungen</h2>
        <p>Mit Fylynx werden Kunden automatisch und höflich an fehlende Unterlagen erinnert.</p>
      `,
    },
  },
  es: {
    'comment-recuperer-document-justificatif-client': {
      title: '¿Cómo recuperar documentos justificativos de clientes rápidamente sin recordatorios interminables?',
      description: 'Guía paso a paso para obtener el 100% de los documentos de sus clientes en menos de 48h gracias a los enlaces de subida móvil y recordatorios automáticos.',
      readTime: '7 min de lectura',
      author: { name: 'Alexandre Mercier', role: 'Experto en Automatización Documental', avatar: '/fylynx-logo.png' },
      contentHtml: `
        <h2>1. Las 3 razones principales por las que sus clientes tardan en enviar sus documentos</h2>
        <p>Si pasa horas persiguiendo a clientes para obtener DNI o justificantes de domicilio, no está solo. El <strong>65% de los retrasos</strong> se deben a bloqueos en la recolección documental.</p>
        <h2>2. La solución moderna: Enlace único de subida móvil en 1 clic</h2>
        <p>Envíe un <strong>enlace seguro por correo electrónico</strong> sin necesidad de crear cuenta.</p>
        <h2>3. Automatizar recordatorios diarios por correo electrónico</h2>
        <p>Fylynx recuerda automáticamente a sus clientes únicamente las piezas que faltan.</p>
      `,
    },
  },
  zh: {
    'comment-recuperer-document-justificatif-client': {
      title: '如何快速收集客户证明文件且无需反复人工催促？',
      description: '借助手机移动端上传链接和自动邮件提醒，在 48 小时内获取 100% 客户合规证明文件的逐步指南。',
      readTime: '7 分钟阅读',
      author: { name: 'Alexandre Mercier', role: '文档自动化与 GED 专家', avatar: '/fylynx-logo.png' },
      contentHtml: `
        <h2>1. 客户延迟提交证明文件的 3 大主因</h2>
        <p>如果您经常花费数小时催促客户提交身份证或地址证明，您并不孤单。平均 <strong>65% 的立案延迟</strong>都是由于文件收集卡顿造成的。</p>
        <h2>2. 现代解决方案：手机端一键安全上传链接</h2>
        <p>通过邮件向客户发送<strong>唯一的安全直达链接</strong>，免去注册密码的繁琐过程。</p>
        <h2>3. 自动化每日邮件提醒</h2>
        <p>Fylynx 会定期且礼貌地自动提醒客户未交补齐的文件。</p>
      `,
    },
  },
};

export function getAllArticles(lang: string = 'fr'): Article[] {
  return BLOG_ARTICLES.map((article) => {
    if (lang === 'fr' || !ARTICLE_TRANSLATIONS[lang]?.[article.slug]) {
      return article;
    }
    const t = ARTICLE_TRANSLATIONS[lang][article.slug];
    return {
      ...article,
      ...t,
      author: t.author || article.author,
    };
  });
}

export function getArticleBySlug(slug: string, lang: string = 'fr'): Article | undefined {
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) return undefined;
  if (lang === 'fr' || !ARTICLE_TRANSLATIONS[lang]?.[slug]) {
    return article;
  }
  const t = ARTICLE_TRANSLATIONS[lang][slug];
  return {
    ...article,
    ...t,
    author: t.author || article.author,
  };
}
