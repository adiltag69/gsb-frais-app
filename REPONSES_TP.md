# Réponses aux questions — AP Partie 2 : Affichage

## Question 7 : quelles infos mettre en avant sur la carte ?

**En priorité (gros, en gras) :**
- **Année-mois** : c'est ce que le visiteur cherche en premier (« ma note d'octobre »).
- **ID de la note + ID visiteur** : servent à identifier la note (dans le titre).
- **Montant validé** : c'est l'info qui compte pour le visiteur (combien il sera remboursé), donc mis en couleur.
- **Montant saisi** : à comparer avec le montant validé.

**Au second plan (petit, gris) :**
- **Nombre de justificatifs** : utile mais secondaire.

**Masqués :**
- **ID état** : un simple chiffre (1, 2, 3) ne parle pas à l'utilisateur ; il faudrait plutôt afficher un libellé (« Clôturée », « Validée »…).
- **Date de modification** : info technique, peu utile sur la carte.

Un écran de téléphone fait ~360 px de large : afficher 8 infos sur une ligne serait illisible, donc on empile et on hiérarchise.

## Question 14 : avantage d'ActivityIndicator par rapport à `<Text>Chargement...</Text>`

- C'est un composant **natif** : il prend l'apparence standard du système (spinner Android / iOS), l'utilisateur le reconnaît tout de suite.
- Il est **animé**, ce qui montre que l'appli travaille et n'est pas bloquée.
- Il est **personnalisable** (`size`, `color`, `animating`) et ne dépend pas de la langue.
- Il gère l'**accessibilité** (lecteurs d'écran) mieux qu'un simple texte.
