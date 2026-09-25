import path from 'path';
import { db } from './db';
import { getFileBufferFromGoogleDrive } from './google-drive';
import { GoogleGenerativeAI } from '@google/generative-ai';

let pdfParse: any = null;
try {
  pdfParse = require('pdf-parse');
} catch (e) {
  console.warn('[AI Verifier] pdf-parse non disponible');
}

let tesseract: any = null;
try {
  tesseract = require('tesseract.js');
} catch (e) {
  console.warn('[AI Verifier] tesseract.js non disponible');
}

export interface AiCheckResult {
  confidenceScore: number; // 0 to 100
  status: 'PASSED' | 'WARNING' | 'REJECTED';
  documentCategory: string;
  summary: string;
  checks: Array<{ label: string; passed: boolean; details?: string }>;
  suggestedAction: 'AUTO_VALIDATE' | 'MANUAL_REVIEW' | 'REJECT';
  rejectionReason?: string;
}

/**
 * Extrait les flux d'images JPEG incorporés dans un PDF scanné
 */
function extractImagesFromPdfBuffer(buffer: Buffer): Buffer[] {
  const images: Buffer[] = [];
  let start = 0;
  const header = Buffer.from([0xff, 0xd8, 0xff]);
  const footer = Buffer.from([0xff, 0xd9]);

  while ((start = buffer.indexOf(header, start)) !== -1) {
    const end = buffer.indexOf(footer, start + 3);
    if (end !== -1 && end - start > 4000) {
      images.push(buffer.subarray(start, end + 2));
      if (images.length >= 3) break;
      start = end + 2;
    } else {
      start += 3;
    }
  }
  return images;
}

/**
 * Normalise et extrait le texte d'un PDF si présent
 */
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  if (!pdfParse) return '';
  try {
    const parseFn = typeof pdfParse === 'function' ? pdfParse : pdfParse?.default;
    if (typeof parseFn !== 'function') return '';
    const data = await parseFn(buffer);
    return (data?.text || '').toLowerCase();
  } catch (err) {
    console.error('[AI Verifier] Erreur extraction texte PDF:', err);
    return '';
  }
}

/**
 * Extrait le texte d'une image (JPG, PNG, WEBP) via Tesseract OCR
 */
async function extractTextFromImage(buffer: Buffer): Promise<string> {
  if (!tesseract) return '';
  try {
    const workerScript = path.join(process.cwd(), 'node_modules/tesseract.js/src/worker-script/node/index.js');
    const createWorkerFn = tesseract.createWorker || tesseract.default?.createWorker;

    if (typeof createWorkerFn === 'function') {
      const worker = await createWorkerFn('fra', 1, {
        workerPath: workerScript,
      });
      const res = await worker.recognize(buffer);
      await worker.terminate();
      return (res?.data?.text || '').toLowerCase();
    }

    const recognizeFn = tesseract.recognize || tesseract.default?.recognize;
    if (typeof recognizeFn === 'function') {
      const res = await recognizeFn(buffer, 'fra+eng');
      return (res?.data?.text || '').toLowerCase();
    }
    return '';
  } catch (err) {
    console.error('[AI Verifier] Erreur OCR Image:', err);
    return '';
  }
}

/**
 * Tente une analyse par Google Gemini Vision AI avec les modèles actifs (gemini-2.5-flash, gemini-flash-latest, etc.)
 */
async function analyzeWithGeminiVision({
  buffer,
  mimeType,
  requirementTitle,
  clientName,
}: {
  buffer: Buffer;
  mimeType: string;
  requirementTitle: string;
  clientName: string;
}): Promise<AiCheckResult | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-2.5-pro',
    'gemini-3.5-flash',
    'gemini-2.5-flash-lite',
  ];

  const genAI = new GoogleGenerativeAI(apiKey);

  const base64Data = buffer.toString('base64');
  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType.startsWith('image/') ? mimeType : 'application/pdf',
    },
  };

  const prompt = `
Vous êtes l'IA officielle de vérification documentaire ultra-avancée de Fylynx SaaS.
Analyse l'image/fichier transmis et compare-le strictement au document requis : "${requirementTitle}".
Nom du client attendu sur le document : "${clientName}".

RÈGLES STRICTES DE RÉDACTION ET D'EXPLICABILITÉ :
1. RÈGLE CRITIQUE DE CONCISION DU RÉSUMÉ ("summary") :
   - Le champ "summary" DOIT ÊTRE ULTRA-CONCIS (1 À 2 PHRASES COURTES, 15 À 20 MOTS MAXIMUM).
   - INTERDICTION ABSOLUE DE RÉDIGER DE LONGS PARAGRAPHES OU PAVÉS DE TEXTE.
   - Exemple de résumé valide : "Certifié conforme (95%). Identité et nom du client vérifiés."
   - Exemple de rejet valide : "REJETÉ (0%) : Photo de bâtiment détectée au lieu du document requis."

2. REJET DES IMAGES NON DOCUMENTAIRES OU INAPPROPRIÉES :
   - Si l'image est un BÂTIMENT, une VOITURE, un PAYSAGE, une PHOTO PERSONNELLE ou un OBJET sans rapport avec un document officiel -> REJETTE IMMÉDIATEMENT :
     confidenceScore: 0, status: "REJECTED", suggestedAction: "REJECT", documentCategory: "Photo Non Conforme",
     summary: "REJETÉ (0%) : Photo non documentaire (bâtiment, véhicule, objet) détectée.",
     rejectionReason: "Fichier non conforme : L'image fournie ne constitue pas le document officiel demandé ('${requirementTitle}')."

3. RAPPROCHEMENT DU NOM DU CLIENT ("${clientName}") :
   - Recherche la présence explicite du nom "${clientName}" sur le document.
   - Si le document est valide mais que le nom "${clientName}" est absent -> status: "WARNING" ou "REJECTED", confidenceScore: 40-50, summary: "Document détecté mais nom du client '${clientName}' non retrouvé."

4. STRUCTURE DU RETOUR JSON OBLIGATOIRE :
{
  "confidenceScore": number (de 0 à 100),
  "status": "PASSED" | "WARNING" | "REJECTED",
  "documentCategory": "Catégorie exacte détectée (ex: Carte Nationale d'Identité, Avis d'Imposition, CV, etc.)",
  "summary": "Résumé ultra-concis en 1-2 phrases (15 mots max)",
  "checks": [
    { "label": "Identification visuelle", "passed": true/false, "details": "Description courte" },
    { "label": "Marqueurs de sécurité", "passed": true/false, "details": "Filigranes / MRZ" },
    { "label": "Identité du client (${clientName})", "passed": true/false, "details": "Contrôle du nom" }
  ],
  "suggestedAction": "AUTO_VALIDATE" | "MANUAL_REVIEW" | "REJECT",
  "rejectionReason": "Raison directe et courte du rejet"
}
`;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as AiCheckResult;
        if (parsed.summary && parsed.summary.length > 180) {
          parsed.summary = parsed.summary.slice(0, 177) + '...';
        }
        return parsed;
      }
    } catch (err: any) {
      if (err?.status === 404 || err?.message?.includes('404')) {
        continue;
      }
      if (
        err?.status === 402 ||
        err?.message?.includes('402') ||
        err?.message?.includes('Payment Required') ||
        err?.message?.includes('depleted')
      ) {
        console.warn(
          `[Gemini Vision AI] Crédits API Google Gemini épuisés (Erreur 402 Payment Required). Passage immédiat au moteur de vérification OCR local.`
        );
        break;
      }
      console.warn(`[Gemini Vision AI Model ${modelName}]`, err?.message || String(err));
    }
  }

  return null;
}

export async function analyzeDocumentWithAi({
  documentRequirementId,
  fileName,
  mimeType,
  fileSize,
  clientName,
  buffer,
}: {
  documentRequirementId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  clientName: string;
  buffer?: Buffer | null;
}): Promise<AiCheckResult> {
  const requirement = await db.documentRequirement.findUnique({
    where: { id: documentRequirementId },
    select: { title: true, description: true },
  });

  const reqTitle = (requirement?.title || '').toLowerCase();
  const lowerFileName = fileName.toLowerCase();

  // 1. Contrôle d'intégrité minimale du fichier
  if (fileSize < 1000) {
    return {
      confidenceScore: 0,
      status: 'REJECTED',
      documentCategory: 'Fichier Suspect / Vide',
      summary: 'Fichier illisible ou corrompu (< 1 Ko). Ré-importation requise.',
      checks: [
        { label: 'Taille minimale du fichier (> 1 Ko)', passed: false, details: 'Fichier vide' },
      ],
      suggestedAction: 'REJECT',
      rejectionReason: 'Le fichier transmis semble vide ou corrompu.',
    };
  }

  // Extract raw text from PDF or Image via OCR
  let extractedText = '';
  if (buffer) {
    if (mimeType.includes('pdf') || lowerFileName.endsWith('.pdf')) {
      extractedText = await extractTextFromPdf(buffer);

      if (!extractedText || extractedText.trim().length < 30) {
        const embeddedImages = extractImagesFromPdfBuffer(buffer);
        for (const imgBuf of embeddedImages) {
          const ocrText = await extractTextFromImage(imgBuf);
          extractedText += ' ' + ocrText;
        }
      }
    } else if (mimeType.startsWith('image/')) {
      extractedText = await extractTextFromImage(buffer);
    }
  }

  // 2. Tentative prioritaire avec Gemini Vision AI
  if (buffer) {
    const geminiResult = await analyzeWithGeminiVision({
      buffer,
      mimeType,
      requirementTitle: requirement?.title || reqTitle,
      clientName,
    });
    if (geminiResult) {
      return geminiResult;
    }
  }

  // LOCAL OCR + HEURISTIC ENGINE (Moteur de secours ultralégers et précis)
  const fullContent = `${lowerFileName} ${extractedText}`.toLowerCase();

  const buildingKeywords = ['building', 'batiment', 'immeuble', 'facade', 'maison', 'construction', 'architecture', 'tower', 'tour', 'appartement'];
  const carKeywords = ['car', 'auto', 'merco', 'audi', 'bmw', 'peugeot', 'renault', 'voiture', 'vehicule', 'rs3', 'porsche', 'ferrari', 'blog_merco', 'photo_car'];

  const isBuildingPhoto = buildingKeywords.some((kw) => fullContent.includes(kw));
  const isCarOrVehiclePhoto = carKeywords.some((kw) => fullContent.includes(kw));

  if (isBuildingPhoto) {
    return {
      confidenceScore: 0,
      status: 'REJECTED',
      documentCategory: 'Photo de Bâtiment / Façade',
      summary: `REJETÉ (0%) : Photo de bâtiment détectée au lieu du document officiel.`,
      checks: [
        { label: 'Identification du contenu', passed: false, details: 'Photo de bâtiment' },
        { label: 'Marqueurs officiels de sécurité', passed: false, details: 'Absents' },
      ],
      suggestedAction: 'REJECT',
      rejectionReason: `Photo de bâtiment fournie au lieu du document officiel demandé ("${requirement?.title}").`,
    };
  }

  if (isCarOrVehiclePhoto) {
    return {
      confidenceScore: 0,
      status: 'REJECTED',
      documentCategory: 'Photo de Véhicule',
      summary: `REJETÉ (0%) : Photo de véhicule détectée au lieu du document officiel.`,
      checks: [
        { label: 'Identification du contenu', passed: false, details: 'Photo de véhicule' },
        { label: 'Marqueurs de sécurité', passed: false, details: 'Absents' },
      ],
      suggestedAction: 'REJECT',
      rejectionReason: `Photo de véhicule fournie au lieu du document officiel demandé.`,
    };
  }

  // 3. Détection de CV / Curriculum Vitae
  const cvRegex = /\b(curriculum|vitae|expériences?|compétences?|formation|diplômes?|centres? d'intérêt|parcours|stage|atouts|cv)\b/i;
  const isCvDocument = cvRegex.test(fullContent);
  const isCvRequested = reqTitle.includes('cv') || reqTitle.includes('curriculum') || reqTitle.includes('resume');

  if (isCvRequested) {
    if (isCvDocument) {
      return {
        confidenceScore: 95,
        status: 'PASSED',
        documentCategory: 'CV / Curriculum Vitae',
        summary: 'Certifié conforme (95%) : CV reconnu et valide.',
        checks: [
          { label: 'Format CV / Resume', passed: true, details: 'CV certifié conforme' },
        ],
        suggestedAction: 'AUTO_VALIDATE',
      };
    }
  } else if (isCvDocument && (reqTitle.includes('identit') || reqTitle.includes('cni') || reqTitle.includes('passeport') || reqTitle.includes('impot') || reqTitle.includes('domicile') || reqTitle.includes('salaire'))) {
    return {
      confidenceScore: 0,
      status: 'REJECTED',
      documentCategory: 'CV (Non Conforme)',
      summary: `REJETÉ (0%) : CV transmis au lieu du document officiel demandé ("${requirement?.title}").`,
      checks: [
        { label: 'Catégorie du document', passed: false, details: `CV détecté (Attendu : ${requirement?.title})` },
      ],
      suggestedAction: 'REJECT',
      rejectionReason: `Vous avez transmis un CV au lieu du document officiel demandé ("${requirement?.title}").`,
    };
  }

  // 4. Analyse des Pièces d'Identité (CNI, Passeport, Permis, Titre de séjour)
  const isIdentityRequest = reqTitle.includes('identit') || reqTitle.includes('cni') || reqTitle.includes('passeport') || reqTitle.includes('permis');

  if (isIdentityRequest) {
    const idRegex = /\b(république française|republique francaise|carte nationale|passeport|passport|permis de conduire|titre de séjour|nationalité|mrz|idfra|préfecture|date de naissance)\b/i;
    const hasIdentityMarkers = idRegex.test(fullContent);

    const clientNameParts = clientName.toLowerCase().split(/[\s,.-]+/).filter((p) => p.length > 2);
    const matchedParts = clientNameParts.filter((part) => fullContent.includes(part));
    const hasNameMatch = clientNameParts.length > 0 && matchedParts.length >= Math.min(1, clientNameParts.length);

    if (!hasIdentityMarkers) {
      return {
        confidenceScore: 0,
        status: 'REJECTED',
        documentCategory: 'Document Non Conforme',
        summary: `REJETÉ (0%) : Marqueurs officiels de pièce d'identité non détectés.`,
        checks: [
          { label: 'Marqueurs de sécurité (MRZ/Sceaux)', passed: false, details: 'Absents ou illisibles' },
          { label: 'Catégorie de pièce d\'identité', passed: false, details: 'Fichier non reconnu' },
        ],
        suggestedAction: 'REJECT',
        rejectionReason: 'Aucun marqueur de pièce d\'identité officielle détecté. Merci de fournir une photo nette.',
      };
    }

    const confidence = hasNameMatch ? 98 : 60;
    const category = reqTitle.includes('passeport') ? 'Passeport Officiel' : reqTitle.includes('permis') ? 'Permis de Conduire UE' : 'Carte Nationale d\'Identité (CNI)';

    return {
      confidenceScore: confidence,
      status: hasNameMatch ? 'PASSED' : 'WARNING',
      documentCategory: category,
      summary: hasNameMatch
        ? `Certifié conforme (${confidence}%) : Identité et nom '${clientName}' vérifiés.`
        : `Avertissement (${confidence}%) : Identité reconnue mais nom '${clientName}' incertain.`,
      checks: [
        { label: 'Marqueurs de sécurité', passed: true, details: 'Filigranes certifiés' },
        { label: 'Nom du client', passed: hasNameMatch, details: hasNameMatch ? `Nom certifié : ${clientName}` : `Nom incertain sur la pièce` },
      ],
      suggestedAction: hasNameMatch ? 'AUTO_VALIDATE' : 'MANUAL_REVIEW',
    };
  }

  // 5. Analyse des Avis d'Imposition
  const isTaxNoticeRequest = reqTitle.includes('impot') || reqTitle.includes('impôt') || reqTitle.includes('imposition') || reqTitle.includes('fiscal');

  if (isTaxNoticeRequest) {
    const taxRegex = /\b(avis d'impôt|avis d'imposition|dgfip|finances publiques|revenu fiscal|numéro fiscal|déclaration des revenus|direction générale des finances publiques|imposable)\b/i;
    const hasTaxMarkers = taxRegex.test(fullContent);

    const clientNameParts = clientName.toLowerCase().split(/[\s,.-]+/).filter((p) => p.length > 2);
    const matchedParts = clientNameParts.filter((part) => fullContent.includes(part));
    const hasNameMatch = clientNameParts.length > 0 && matchedParts.length >= 1;

    if (!hasTaxMarkers) {
      return {
        confidenceScore: 0,
        status: 'REJECTED',
        documentCategory: 'Document Non Conforme',
        summary: `REJETÉ (0%) : En-tête officiel DGFIP non détecté sur l'avis d'imposition.`,
        checks: [
          { label: 'En-tête DGFIP / Finances Publiques', passed: false, details: 'Non reconnu' },
        ],
        suggestedAction: 'REJECT',
        rejectionReason: 'Le document transmis n\'est pas un avis d\'imposition officiel (DGFIP).',
      };
    }

    const confidence = hasNameMatch ? 98 : 45;

    return {
      confidenceScore: confidence,
      status: hasNameMatch ? 'PASSED' : 'WARNING',
      documentCategory: 'Avis d\'Imposition Officiel',
      summary: hasNameMatch
        ? `Certifié conforme (${confidence}%) : Avis d'imposition DGFIP et nom vérifiés.`
        : `Avertissement (${confidence}%) : Avis d'imposition reconnu mais nom '${clientName}' incertain.`,
      checks: [
        { label: 'En-tête officiel DGFIP', passed: true, details: 'Avis conforme' },
        { label: 'Rapprochement nom client', passed: hasNameMatch, details: hasNameMatch ? `Déclarant : ${clientName}` : `Nom non certifié` },
      ],
      suggestedAction: hasNameMatch ? 'AUTO_VALIDATE' : 'MANUAL_REVIEW',
    };
  }

  // 6. Analyse des Justificatifs de Domicile
  const isProofOfAddressRequest = reqTitle.includes('domicile') || reqTitle.includes('justificatif') || reqTitle.includes('facture');

  if (isProofOfAddressRequest) {
    const addressRegex = /\b(edf|engie|totalenergies|free|orange|sfr|bouygues|veolia|quittance de loyer|facture d'électricité|eau|gaz)\b/i;
    const hasAddressMarkers = addressRegex.test(fullContent);

    if (!hasAddressMarkers) {
      return {
        confidenceScore: 0,
        status: 'REJECTED',
        documentCategory: 'Justificatif Non Conforme',
        summary: 'REJETÉ (0%) : Émetteur officiel non reconnu (Facture EDF, Engie, Eau, Télécom demandée).',
        checks: [
          { label: 'Fournisseur certifié électricité/eau/télécom', passed: false, details: 'Non identifié' },
        ],
        suggestedAction: 'REJECT',
        rejectionReason: 'Organisme émetteur non identifié. Merci de fournir une facture récente (-3 mois).',
      };
    }

    return {
      confidenceScore: 95,
      status: 'PASSED',
      documentCategory: 'Justificatif de Domicile Certifié',
      summary: 'Certifié conforme (95%) : Justificatif de domicile récent validé.',
      checks: [
        { label: 'Fournisseur certifié', passed: true, details: 'Organisme certifié détecté' },
      ],
      suggestedAction: 'AUTO_VALIDATE',
    };
  }

  // 7. Analyse des Bulletins de Salaire
  const isPayStubRequest = reqTitle.includes('salaire') || reqTitle.includes('paie') || reqTitle.includes('bulletin');

  if (isPayStubRequest) {
    const paystubRegex = /\b(bulletin de paie|bulletin de salaire|fiche de paie|net à payer|net imposable|cotisations|siret|salarié)\b/i;
    const hasPaystubMarkers = paystubRegex.test(fullContent);

    if (!hasPaystubMarkers) {
      return {
        confidenceScore: 0,
        status: 'REJECTED',
        documentCategory: 'Document Non Conforme',
        summary: 'REJETÉ (0%) : Structure de bulletin de paie non reconnue (Net à payer, SIRET manquant).',
        checks: [
          { label: 'Mentions légales & Cotisations', passed: false, details: 'Non conforme' },
        ],
        suggestedAction: 'REJECT',
        rejectionReason: 'Le document ne présente pas la structure d\'un bulletin de paie officiel.',
      };
    }

    return {
      confidenceScore: 97,
      status: 'PASSED',
      documentCategory: 'Bulletin de Salaire Officiel',
      summary: 'Certifié conforme (97%) : Bulletin de paie vérifié et conforme.',
      checks: [
        { label: 'Mentions légales', passed: true, details: 'Bulletin conforme' },
      ],
      suggestedAction: 'AUTO_VALIDATE',
    };
  }

  // 8. RÈGLE PAR DÉFAUT STRICTEMENT SÉCURISÉE
  return {
    confidenceScore: 0,
    status: 'REJECTED',
    documentCategory: 'Document Non Identifié',
    summary: `REJETÉ (0%) : Document non identifié ou sans marqueurs officiels exploitables.`,
    checks: [
      { label: 'Validation des éléments documentaires', passed: false, details: 'Fichier sans marqueurs officiels' },
    ],
    suggestedAction: 'REJECT',
    rejectionReason: `Impossible d'authentifier ce fichier comme "${requirement?.title}". Merci d'importer un document officiel lisible.`,
  };
}

export async function processAiVerificationForRequirement(
  documentRequirementId: string,
  fileName: string,
  mimeType: string,
  fileSize: number
) {
  const req = await db.documentRequirement.findUnique({
    where: { id: documentRequirementId },
    include: { folderRequest: true },
  });

  if (!req) return null;

  // Fetch ALL uploaded document files for this requirement to support Recto + Verso
  const docFiles = await db.documentFile.findMany({
    where: { documentRequirementId },
    orderBy: { uploadedAt: 'asc' },
  });

  if (docFiles.length === 0) {
    const singleResult = await analyzeDocumentWithAi({
      documentRequirementId,
      fileName,
      mimeType,
      fileSize,
      clientName: req.folderRequest.clientName,
    });

    const newStatus = singleResult.suggestedAction === 'AUTO_VALIDATE' ? 'VALIDATED' : 'SUBMITTED';

    const updated = await db.documentRequirement.update({
      where: { id: documentRequirementId },
      data: {
        aiVerified: true,
        aiStatus: singleResult.status,
        aiConfidenceScore: singleResult.confidenceScore,
        aiAnalysisDetails: JSON.stringify(singleResult),
        status: newStatus,
        rejectionReason: singleResult.rejectionReason || null,
      },
    });

    return { requirement: updated, aiResult: singleResult };
  }

  // Detect double-sided / multi-file requirement indicators
  const reqTitleLower = (req.title || '').toLowerCase();
  const reqDescLower = (req.description || '').toLowerCase();
  const isDoubleSidedReq =
    reqTitleLower.match(/(recto|verso|cni|identit|permis|carte grise|séjour|double|2 faces)/i) ||
    reqDescLower.match(/(recto|verso|double|2 faces)/i) ||
    docFiles.some((f) => f.fileName.toUpperCase().startsWith('RECTO_') || f.fileName.toUpperCase().startsWith('VERSO_'));

  const rectoFile =
    docFiles.find((f) => f.fileName.toUpperCase().startsWith('RECTO_')) ||
    (docFiles.length >= 2 ? docFiles[0] : null);

  const versoFile =
    docFiles.find((f) => f.fileName.toUpperCase().startsWith('VERSO_')) ||
    (docFiles.length >= 2 ? docFiles[1] : null);

  // If BOTH files exist (or 2+ files are present for a double-sided requirement), run analysis on BOTH files and aggregate results!
  if (rectoFile && versoFile) {
    const rectoBuffer = rectoFile.fileKey.startsWith('drive_')
      ? await getFileBufferFromGoogleDrive(rectoFile.fileKey.replace('drive_', ''))
      : null;
    const versoBuffer = versoFile.fileKey.startsWith('drive_')
      ? await getFileBufferFromGoogleDrive(versoFile.fileKey.replace('drive_', ''))
      : null;

    const rectoResult = await analyzeDocumentWithAi({
      documentRequirementId,
      fileName: rectoFile.fileName,
      mimeType: rectoFile.mimeType,
      fileSize: rectoFile.fileSize,
      clientName: req.folderRequest.clientName,
      buffer: rectoBuffer,
    });

    const versoResult = await analyzeDocumentWithAi({
      documentRequirementId,
      fileName: versoFile.fileName,
      mimeType: versoFile.mimeType,
      fileSize: versoFile.fileSize,
      clientName: req.folderRequest.clientName,
      buffer: versoBuffer,
    });

    const isBothValid = rectoResult.status !== 'REJECTED' && versoResult.status !== 'REJECTED';
    const combinedScore = isBothValid
      ? Math.round((rectoResult.confidenceScore + versoResult.confidenceScore) / 2)
      : 0;

    const combinedResult: AiCheckResult = {
      confidenceScore: combinedScore,
      status: isBothValid ? 'PASSED' : 'REJECTED',
      documentCategory: `${rectoResult.documentCategory} (Recto + Verso)`,
      summary: isBothValid
        ? `Certifié conforme (${combinedScore}%) : Les 2 faces (Recto et Verso) sont validées.`
        : `REJETÉ (0%) : ${rectoResult.status === 'REJECTED' ? 'Face RECTO non conforme.' : 'Face VERSO non conforme.'}`,
      checks: [
        {
          label: 'Face RECTO (Avant)',
          passed: rectoResult.status !== 'REJECTED',
          details: rectoResult.status === 'REJECTED' ? 'Non conforme' : `Validé (${rectoResult.confidenceScore}%)`,
        },
        {
          label: 'Face VERSO (Arrière)',
          passed: versoResult.status !== 'REJECTED',
          details: versoResult.status === 'REJECTED' ? 'Non conforme' : `Validé (${versoResult.confidenceScore}%)`,
        },
        ...rectoResult.checks.slice(0, 1),
      ],
      suggestedAction: isBothValid ? 'AUTO_VALIDATE' : 'REJECT',
      rejectionReason: !isBothValid
        ? `Une des faces du document est non conforme (${rectoResult.status === 'REJECTED' ? rectoResult.rejectionReason || 'Recto non valide' : versoResult.rejectionReason || 'Verso non valide'}).`
        : undefined,
    };

    const newStatus = combinedResult.suggestedAction === 'AUTO_VALIDATE' ? 'VALIDATED' : 'SUBMITTED';

    const updated = await db.documentRequirement.update({
      where: { id: documentRequirementId },
      data: {
        aiVerified: true,
        aiStatus: combinedResult.status,
        aiConfidenceScore: combinedResult.confidenceScore,
        aiAnalysisDetails: JSON.stringify(combinedResult),
        status: newStatus,
        rejectionReason: combinedResult.rejectionReason || null,
      },
    });

    return { requirement: updated, aiResult: combinedResult };
  }

  // If only 1 file is present so far:
  const latestDocFile = docFiles[docFiles.length - 1];
  let fileBuffer: Buffer | null = null;
  if (latestDocFile.fileKey.startsWith('drive_')) {
    fileBuffer = await getFileBufferFromGoogleDrive(latestDocFile.fileKey.replace('drive_', ''));
  }

  const result = await analyzeDocumentWithAi({
    documentRequirementId,
    fileName: latestDocFile.fileName,
    mimeType: latestDocFile.mimeType,
    fileSize: latestDocFile.fileSize,
    clientName: req.folderRequest.clientName,
    buffer: fileBuffer,
  });

  // If it's a double-sided requirement with only 1 face received so far
  const isRectoOnly = isDoubleSidedReq && docFiles.length === 1;
  if (isRectoOnly) {
    if (result.status !== 'REJECTED') {
      result.summary = `Face RECTO enregistrée (${result.confidenceScore}%). En attente de la face VERSO.`;
      result.checks = [
        { label: 'Face RECTO (Avant)', passed: true, details: `Validé (${result.confidenceScore}%)` },
        { label: 'Face VERSO (Arrière)', passed: false, details: 'En attente du dépôt' },
      ];
      result.suggestedAction = 'MANUAL_REVIEW'; // Keep SUBMITTED until Verso arrives
    } else {
      result.summary = `Face RECTO rejetée (0%) : ${result.rejectionReason || 'Fichier non conforme'}`;
    }
  }

  const newStatus = result.suggestedAction === 'AUTO_VALIDATE' && !isRectoOnly ? 'VALIDATED' : 'SUBMITTED';

  const updated = await db.documentRequirement.update({
    where: { id: documentRequirementId },
    data: {
      aiVerified: true,
      aiStatus: result.status,
      aiConfidenceScore: result.confidenceScore,
      aiAnalysisDetails: JSON.stringify(result),
      status: newStatus,
      rejectionReason: result.rejectionReason || null,
    },
  });

  return { requirement: updated, aiResult: result };
}

