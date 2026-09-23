# Architecture frontend

Le frontend est une application React 19 + TypeScript construite avec Vite,
TanStack Router, TanStack Query et Zustand. Le code suit une organisation
feature-sliced: chaque fonctionnalite garde ses regles, ses donnees et son UI
dans une frontiere explicite.

## Structure

```text
src/
  domain/          Types stables partages par plusieurs features
  feature/
    build/          Coordination de l'atelier et protocole drag-and-drop
    auth/           Session, connexion, deconnexion et UI de compte
    persistence/    Chargement, snapshots, autosave et partage de builds
    profile/        Race, genre et silhouette
    item/           Equipements et slots
    kit/            Kits et racks
    implant/        Implants et baie d'implants
    drug/           Drogues et slot actif
    stats/          Calcul et presentation des statistiques
    subscription/   Abonnements
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
- `persistence.remote.ts` gere les builds ordinaires.
- `shared-build.remote.ts` gere les liens de partage publics.

L'authentification expose une facade compatible dans `auth.service.ts`.
`auth.session.ts` porte bootstrap, listener et lecture de session;
`auth.credentials.ts` porte connexion et deconnexion; `auth.client.ts` garde la
creation et la validation du client Supabase.

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
