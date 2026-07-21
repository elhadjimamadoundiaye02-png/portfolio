# Comment ajouter tes rapports et liens GitHub

## 1. Ajouter un rapport PDF

Dépose ton PDF dans ce dossier (`documents/Rapports/`) en le nommant EXACTEMENT comme ci-dessous :

| Projet | Nom du fichier attendu |
|--------|------------------------|
| SecureBox / Sunudock | `rapport-securebox.pdf` |
| Hardening Linux | `rapport-hardening-linux.pdf` |
| Labos Réseaux GNS3 | `rapport-virtualisation-reseau.pdf` |
| Auth Centralisée ToIP | `rapport-auth-centralisee-toip.pdf` |
| VPN SAED (Stage) | `rapport-vpn-saed-stage.pdf` |
| BétailSécurité | `rapport-betail-securite.pdf` |
| Chatbot RAG | `rapport-chatbot-rag.pdf` |
| TikTokSafe Sénégal | `rapport-tiktoksafe.pdf` |
| TrafiSen | `rapport-trafisen.pdf` |
| VoiceAI Pro | `rapport-voiceai-pro.pdf` |

Une fois le PDF déposé ici et pushé sur GitHub → le bouton "Rapport" devient cliquable automatiquement.

---

## 2. Ajouter un lien GitHub

Ouvre `index.html` et cherche le projet concerné.
Trouve la ligne avec `link-github` et remplace `href="#"` par ton vrai lien :

```html
<!-- AVANT (lien désactivé) -->
<a class="project-link link-github" href="#" ...>

<!-- APRÈS (lien actif) -->
<a class="project-link link-github" href="https://github.com/elmatub/NOM-DU-REPO" ...>
```

Le bouton devient automatiquement cliquable et visible dès que tu remplaces le `#`.

---

## 3. Liens GitHub déjà configurés

- ✅ BétailSécurité → `https://github.com/elmatub/betail-securite-v2`
- ✅ TrafiSen → `https://github.com/elmatub/TrafiSen-v2`
- ⏳ Les autres → à compléter quand les repos seront publics
