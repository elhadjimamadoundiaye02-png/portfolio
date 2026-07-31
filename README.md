[Uploading README.md…]()
# Portfolio — El Hadji Mamadou Ndiaye

Portfolio professionnel **100% statique**, hébergé sur **GitHub Pages**.

## Stack
- HTML5 / CSS3 / JavaScript vanilla (aucun framework, aucune dépendance à builder)
- Hébergement : GitHub Pages (gratuit, toujours actif)
- Témoignages : fichier statique `testimonials.json` (aucune base de données)
- Envoi des nouveaux témoignages : [Formspree](https://formspree.io) (formulaire → email, gratuit, sans code serveur)

> Ce projet n'utilise plus Render ni MongoDB Atlas. L'ancienne API
> (`portfolio-elma-api`) n'est plus nécessaire et peut être supprimée/arrêtée.

## Comment ajouter un témoignage validé

1. Vous recevez un email via Formspree avec le contenu du témoignage.
2. Vérifiez-le, puis ouvrez `testimonials.json`.
3. Ajoutez un objet dans le tableau, au format :

```json
{
  "name": "Nom complet",
  "role": "Fonction / Entreprise",
  "message": "Le témoignage...",
  "rating": 5
}
```

4. Commit + push sur `main` → le témoignage apparaît automatiquement sur le site (déploiement GitHub Pages en ~1 minute).

## Configurer le formulaire (une seule fois)

1. Créez un compte gratuit sur https://formspree.io
2. Créez un formulaire, copiez son ID (ex. `abcdwxyz`)
3. Dans `script.js`, remplacez :
   ```js
   const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqerjdrr";
   ```
   par votre propre endpoint.

## Déploiement

Ce repo est automatiquement déployé sur GitHub Pages à chaque push sur `main`.

URL : https://elhadjimamadoundiaye02-png.github.io/portfolio/
