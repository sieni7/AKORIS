# Conventions Markdown

## Principes generaux

- Encodage UTF-8.
- Une ligne vide entre les blocs de niveau different.
- Pas d'espaces en fin de ligne.
- Terminer chaque fichier par une ligne vide.
- Largeur de ligne maximale : 120 caracteres.

## Titres

- Utiliser `#` pour le titre principal (un seul H1 par fichier).
- Respecter la hierarchie : H1 > H2 > H3 > H4.
- Pas de saut de niveau (ne pas passer de H2 a H4).
- Les titres en Pascal Case pour la documentation technique, en francais pour la documentation metier.

## Listes

- Utiliser `-` pour les listes non ordonnees.
- Utiliser `1.` pour les listes ordonnees (toujours `1.` pour le markdown).
- Indenter de 2 espaces pour les sous-listes.

## Code

- Utiliser les blocs de code avec langage specifie : ```typescript.
- Utiliser `inline` pour les references dans le texte.
- Un bloc de code ne doit pas depasser 80 colonnes.

## Tableaux

- Utiliser les pipes `|` avec alignement.
- Aligner les separateurs avec les en-têtes.
- Pas de tableaux complexes (fusion de cellules).

## Liens

- Utiliser les liens de reference `[texte][ref]` pour les sources recurrentes.
- URLs completes et valides.
- Liens internes en chemins relatifs.

## Images

- Stocker les images dans un dossier `images/` adjacent.
- Utiliser le format `![description](chemin)`.
- Toujours fournir un texte alternatif.
