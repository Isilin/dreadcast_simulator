# Guide technique

Le frontend est une application React 19 + TypeScript construite avec Vite,
TanStack Router, TanStack Query et Zustand. Les donnees passent par des
fonctions serverless Vercel (`api/`, code partage dans `lib/`) adossees a
Supabase. Le code suit une organisation feature-sliced: chaque fonctionnalite
garde ses regles, ses donnees et son UI dans une frontiere explicite.

Les conventions de code sont dans [CODING_STANDARDS.md](CODING_STANDARDS.md).

## Demarrage local

```bash
git clone https://github.com/Isilin/dreadcast_simulator.git
cd dreadcast_simulator
corepack enable
yarn install
yarn dev
```

Ouvrir [http://localhost:5173](http://localhost:5173).

`yarn dev` proxifie les appels `/api/*` vers le deploiement Vercel
(`vite.config.ts`): le catalogue, les kits, les implants, les drogues et les
races demandent donc une API deployee fonctionnelle. Pour executer aussi les
fonctions de `api/` en local, utiliser `yarn vercel dev` (projet Vercel lie).

Quand le panneau Catalogue affiche `Catalogue indisponible`, le client a recu
une erreur de service: verifier les variables Supabase du projet Vercel et les
journaux des fonctions serverless. L'interface reste utilisable pour les builds
deja enregistres localement.

### Variables d'environnement (auth Supabase)

Le frontend accepte l'un des deux formats ci-dessous dans `.env.local`.

```bash
# Format Vite
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon

# Format Vercel/NEXT_PUBLIC
NEXT_PUBLIC_SIMULATOR_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SIMULATOR_SUPABASE_ANON_KEY=votre_cle_anon
```

Sans ces variables, la page de connexion s'affiche mais la connexion est
desactivee. Le schema et les regles d'acces de la base sont decrits dans
[supabase/README.md](supabase/README.md).

### Scripts

```bash
yarn dev          # Serveur de developpement (port 5173)
yarn build        # Build de production avec verification TypeScript
yarn analyze      # Build avec rapport de taille dans dist/stats.html
yarn test         # Tests unitaires Vitest
yarn lint         # Verification ESLint
yarn lint:fix     # Correction automatique des erreurs ESLint
yarn format       # Formatage avec Prettier
yarn preview      # Preview du build de production
```

Le dossier `.github/` contient la configuration GitHub Copilot (instructions,
prompts, agents) et les workflows GitHub Actions.

## Structure

```text
src/
  domain/          Types stables partages par plusieurs features
  feature/
    build/          Coordination de l'atelier et protocole drag-and-drop
    auth/           Session, connexion, deconnexion et UI de compte
    account/        Pseudo public du compte (definitif)
    community/      Communaute: publication, recherche, notes, recommandations
    persistence/    Chargement, snapshots, autosave et builds distants
    profile/        Race, genre et silhouette
    item/           Equipements et slots
    kit/            Kits et racks
    implant/        Implants et baie d'implants
    drug/           Drogues et slot actif
    title/          Titres debloques
    prerequisite/   Prerequis des items et kits (stats, titres, implants, race)
    suit/           Calcul des statistiques finales
    stats/          Presentation des competences
    subscription/   Abonnements
    theme/          Theme clair/sombre
  ui/               Composants generiques reutilisables
  routes/           Composition des pages et configuration TanStack Router
  styles/           Variables, helpers et animations globales
```

Chaque feature suit autant que possible le decoupage suivant:

```text
feature/<nom>/
  model/        Types, stores, selectors, regles et hooks metier
  services/     Requetes, DTO, schemas et mapping
  ui/           Composants propres au domaine, avec CSS Module co-localise
  index.ts      Surface publique de la feature
```

Les imports entre features passent par leur `index.ts` public. Les imports
internes restent relatifs a leur feature. `src/ui` ne contient que des
composants sans regle metier, par exemple les panneaux generiques et les lignes
de modules installes.

## Atelier de build

`feature/build` est la feature de workflow. `BuildWorkbench` compose les
panneaux et lit les stores de domaine, mais les composants d'equipement, de
kits, d'implants et de drogues restent dans leurs features respectives.

Le drag-and-drop est decoupe en trois niveaux:

- `drag-drop.types.ts` definit les unions de donnees transportees.
- `drag-drop.helpers.ts` valide les payloads inconnus et produit les annonces
  accessibles.
- `drop.handler.ts` applique les mutations metier sans dependance React.

`workbench-dnd.hook.ts` ne gere que les capteurs, l'etat du drag et le lien
entre `@dnd-kit` et le handler pur. Cette separation permet de tester les
branches de drop sans rendu DOM.

## Persistance et authentification

La persistance conserve le meme contrat public `useBuildPersistence`, mais ses
responsabilites sont separees:

- `persistence.loader.ts` charge le mode local ou distant et gere la migration
  du slot invite.
- `persistence.snapshot.ts` lit, cree et restaure les snapshots dans les
  stores de domaine.
- `autosave.hook.ts` observe les stores et debite les sauvegardes.
- `persistence.remote.ts` gere les builds distants.

L'autosave debite les sauvegardes de 250 ms et les envoie immediatement si
l'atelier est demonte (navigation vers la Communaute par exemple).
`fetchRemoteBuilds` attend les sauvegardes en cours avant de relire les builds.
Le slot actif est memorise pour l'onglet (`sessionStorage`) et `/?slot=N`
ouvre un slot precis, par exemple apres une copie depuis la Communaute.

L'authentification expose une facade compatible dans `auth.service.ts`.
`auth.session.ts` porte bootstrap, listener et lecture de session;
`auth.credentials.ts` porte connexion et deconnexion; `auth.client.ts` garde la
creation et la validation du client Supabase.

## Communaute

`feature/community` ne depend jamais de `feature/build`; l'atelier charge ses
points d'entree (`PublishBuildButton`, `SimilarBuildsButton`) en lazy pour
garder la Communaute hors du chunk de l'atelier.

- `model/` porte les regles pures: detection de specialisation, filtres
  (URL, requete API), calcul des stats d'un snapshot sans store
  (`computeSnapshotStats` via `computeSuitStats`), payloads et comparaison.
- `services/` valide avec zod tout ce qui vient de l'API, y compris les
  snapshots publies (donnees non fiables normalisees en `BuildSnapshot`).
- Les fiches et comparaisons rendent un build a partir de props: les stores
  de l'atelier ne sont jamais ecrases par un build consulte.
- Les regles d'acces (abonne, auteur, pseudo) sont appliquees en base par RLS
  et RPC (voir `supabase/README.md`); l'UI ne fait que les refleter.

L'abonnement actif se lit uniquement via `useActiveSubscription()`
(`feature/subscription`), meme regle que l'API et la base.

## Etat et donnees

Les stores Zustand appartiennent aux features de domaine. TanStack Query gere
les donnees distantes et les etats de chargement. Les snapshots persistants
stockent uniquement les identifiants et valeurs necessaires, puis restaurent
les objets complets a partir du catalogue courant.

Les composants UI ne contiennent pas de logique de requete ou de serialisation.
Les regles qui traversent plusieurs domaines restent dans `feature/build` ou
`feature/persistence`, selon qu'elles concernent le workflow ou le stockage.

## Styles

Chaque composant possede son fichier `*.module.css`. Les variables communes
restent dans `src/styles/theme.css`; les helpers et animations globaux restent
dans `src/styles/`. Les feuilles de route ne contiennent que la composition de
page et les contraintes de placement propres a la route.

## Validation

Depuis la racine du projet:

```bash
yarn test
yarn lint
yarn build
yarn analyze
```

Les tests de modele couvrent notamment la validation des payloads DnD, les
annonces d'accessibilite et les mutations de drop. Les parcours UI doivent etre
verifies sur desktop et mobile lors des changements touchant l'atelier.
