// successitapDoms.js


if ( localStorage.test == 'true' ) {
  var NB_SIGNS = 5;  // 36
  var NB_LETTERS = 5; // 26

  var MINI_WLIST_SIZE = 2;  // 4   taille paquets de mots entre mots FOX
  var NB_WSUB_CYCLES = 2;  // 6   nb de paquets de mots

  var MAX_TRIAL_DURATION = 5000;  // 5000 durée max pour enregistrement d'un essai
}
else {
  var NB_SIGNS = 26; // 36
  var NB_LETTERS = 26;

  var MINI_WLIST_SIZE = 4;  // 4   taille paquet de mots entre mots FOX
  var NB_WSUB_CYCLES = 2;  // 6   nb mini cycles de paquet + mot FOX

  var MAX_TRIAL_DURATION = 5000;  // 5000 durée max pour enregistrement d'un essai

}

var levelNameTranslate = { speed: 'sp', dom1: 'd1', sig1: 's1', memory1: 'm1', words1: 'w1',
 dictation1: 'i1', dom2: 'd2', sig2: 's2', memory2: 'm2', words2: 'w2', dictation2: 'i2' };

var successitapSigns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '_', "'", '"', ',', ';', ':', '?', '!', '.', '&'];

var foxEnWordList = ['quick', 'brown', 'fox', 'jumps', 'lazy', 'dog'];
var foxFrWordList = ['porter', 'vieux', 'whisky', 'juge', 'blond', 'fume'];

var shortEnWordList = ['a','able','about','above','after','all','also','an','and','any','as','ask','at',
'back','bad','be','because','beneath','big','but','by','call','can','case','child','come','company',
'could','day','different','do','early','even','eye','fact','feel','few','find','first','for','from',
'get','give','go','good','government','great','group','hand','have','he','her','high','him','his',
'how','if','important','in','into','it','its','just','know','large','last','leave','life','like',
'little','long','look','make','man','me','most','my','new','next','no','not','now','number','of',
'old','on','one','only','or','other','others','our','out','over','own','part','people','person',
'place','point','problem','public','right','same','say','see','seem','she','small','so','some','take',
'tell','than','that','the','their','them','then','there','these','they','thing','think','this','time',
'to','try','two','under','up','us','use','want','way','we','week','well','what','when','which','who',
'will','with','woman','work','world','would','year','you','young','your'];

var shortFrWordList = ['aimer','ainsi','aller','alors','ami','amour','appeler','arriver','attendre',
'aussi','autre','avant','avec','avoir','bateau','beau','bien','bavoir','chambre','chaque','chercher',
'chose','comme','comprendre','contre','croire','demander','depuis','dernier','devant','devoir','dieu',
'dire','donner','encore','enfant','enfin','entendre','entrer','esprit','faire','falloir','femme',
'fille','grand','gras','heure','homme','idole','image','jamais','jeter','jeune','kaki','kayak','kiwi',
'kyste','lagune','lancer','laser','lequel','maintenant','maison','mari','mettre','moment','monde',
'monsieur','mourir','nouveau','objet','odeur','olive','pacha','parler','partir','passer','pays',
'pendant','penser','petit','porter','pouvoir','premier','prendre','quand','quatre','quelque','ramer',
'regarder','rendre','reprendre','rester','savoir','sembler','sentir','soleil','sortir','tenir','terre',
'toujours','trouver','union','urgence','usine','utile','vache','venir','vingt','vivre','votre',
'vouloir','vous','wagon','western','yeti','yeux','yoga','zapper','zeste','zoo'];

var successitapConfigs = [
  [1,0,0,0,0,0],// a

  [1,2,0,0,0,0],// b

  [1,0,2,0,0,0],// c

  [1,0,0,2,0,0],// d

  [1,0,0,0,2,0],// e

  [0,1,0,0,0,0],// f

  [0,1,2,0,0,0],// g

  [0,1,0,2,0,0],// h

  [0,1,0,0,0,2],// i

  [2,1,0,0,0,0],// j

  [0,0,1,0,0,0],// k

  [0,0,1,2,0,0],// l

  [0,0,1,0,2,0],// m

  [0,0,1,0,0,2],// n

  [2,0,1,0,0,0],// o

  [0,2,1,0,0,0],// p

  [0,0,0,1,0,0],// q

  [0,0,0,1,2,0],// r

  [0,0,0,1,0,2],// s

  [2,0,0,1,0,0],// t

  [0,2,0,1,0,0],// u

  [0,0,0,0,1,0],// v

  [0,0,0,0,1,2],// w

  [2,0,0,0,1,0],// x

  [0,0,2,0,1,0],// y

  [0,0,0,2,1,0],// z

  [0,0,0,0,0,1],// Sp

  [0,1,0,0,2,0],// '

  [0,2,0,0,1,0],// "

  [1,0,0,0,0,2],// ,

  [2,0,0,0,0,1],// ;

  [0,2,0,0,0,1],// :

  [0,0,2,0,0,1],// ?

  [0,0,0,2,0,1],// !

  [0,0,0,0,2,1],// .

  [0,0,2,1,0,0] // &
];

var simultapConfigs = [
  [1,0,0,0,0,0],// a

  [1,1,0,1,0,0],// b

  [1,1,1,0,0,0],// c

  [1,0,0,1,1,0],// d

  [1,0,1,0,1,0],// e

  [0,1,0,0,0,0],// f

  [0,1,1,0,0,1],// g

  [0,1,0,1,0,1],// h

  [0,1,0,0,0,1],// i

  [1,1,0,0,0,0],// j

  [0,0,1,0,0,0],// k

  [0,0,1,1,0,0],// l

  [0,0,1,0,1,0],// m

  [0,0,1,0,0,1],// n

  [1,0,1,0,0,0],// o

  [0,1,1,0,0,0],// p

  [0,0,0,1,0,0],// q

  [0,0,0,1,1,0],// r

  [0,0,0,1,0,1],// s

  [1,0,0,1,0,0],// t

  [0,1,0,1,0,0],// u

  [0,0,0,0,1,0],// v

  [0,0,0,0,1,1],// w

  [1,0,0,0,1,0],// x

  [0,0,1,0,1,1],// y

  [0,0,0,1,1,1],// z

  [0,0,0,0,0,1],// Sp

  [0,1,0,0,1,0],// '

  [0,1,1,0,1,0],// "

  [1,0,0,0,0,1],// ,

  [1,1,0,0,0,1],// ;

  [0,1,0,0,1,1],// :

  [0,0,1,1,0,1],// ?

  [1,0,0,1,0,1],// !

  [1,0,0,0,1,1],// .

  [1,0,1,1,0,0] // &
];
