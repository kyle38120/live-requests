// ─────────────────────────────────────────────────────────────
// Paste your Firebase web app config below.
// Firebase console → Project settings → General → Your apps → Config.
// These values are safe to publish: access is controlled by
// database.rules.json, not by keeping this file secret.
// ─────────────────────────────────────────────────────────────
window.FIREBASE_CONFIG = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://PASTE_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

// Working name, shown in page titles and the sign-in screen.
window.APP_NAME = "Live Requests";

window.isFirebaseConfigured = function () {
  return !!(window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.apiKey && window.FIREBASE_CONFIG.apiKey.indexOf("PASTE") !== 0);
};

// Starter catalog, used to fill a new song list on first sign-in.
window.STARTER_SONGS = [
  {id:1,title:"I Will Survive",artist:"Gloria Gaynor",era:"70s",genre:"Soul"},
  {id:2,title:"Dreams",artist:"Fleetwood Mac",era:"70s",genre:"Rock"},
  {id:3,title:"Stand By Me",artist:"Ben E. King",era:"60s",genre:"Soul"},
  {id:4,title:"Linger",artist:"The Cranberries",era:"90s",genre:"Rock"},
  {id:5,title:"Yellow",artist:"Coldplay",era:"2000s",genre:"Pop"},
  {id:6,title:"Kiss Me",artist:"Sixpence None the Richer",era:"90s",genre:"Pop"},
  {id:7,title:"Iris",artist:"Goo Goo Dolls",era:"90s",genre:"Pop"},
  {id:8,title:"Fade Into You",artist:"Mazzy Star",era:"90s",genre:"Rock"},
  {id:9,title:"Tennessee Whiskey",artist:"Chris Stapleton",era:"2010s",genre:"Country"},
  {id:10,title:"Landslide",artist:"Fleetwood Mac",era:"70s",genre:"Folk"},
  {id:11,title:"Kryptonite",artist:"3 Doors Down",era:"2000s",genre:"Rock"},
  {id:12,title:"No Rain",artist:"Blind Melon",era:"90s",genre:"Rock"},
  {id:13,title:"Crazy",artist:"Gnarls Barkley",era:"2000s",genre:"Pop"},
  {id:14,title:"Mr Brightside",artist:"The Killers",era:"2000s",genre:"Rock"},
  {id:15,title:"Don't Let Me Down",artist:"The Beatles",era:"60s",genre:"Rock"},
  {id:16,title:"Valerie",artist:"Amy Winehouse",era:"2000s",genre:"Soul"},
  {id:17,title:"What's Up",artist:"4 Non Blondes",era:"90s",genre:"Rock"},
  {id:18,title:"Creep",artist:"Radiohead",era:"90s",genre:"Rock"},
  {id:19,title:"Burning Down The House",artist:"Talking Heads",era:"80s",genre:"Rock"},
  {id:20,title:"Say It Ain't So",artist:"Weezer",era:"90s",genre:"Rock"},
  {id:21,title:"Drive",artist:"Incubus",era:"2000s",genre:"Rock"},
  {id:22,title:"Believe",artist:"Cher",era:"90s",genre:"Pop"},
  {id:23,title:"Zombie",artist:"The Cranberries",era:"90s",genre:"Rock"},
  {id:24,title:"Simple Man",artist:"Lynyrd Skynyrd",era:"70s",genre:"Rock"},
  {id:25,title:"My Hero",artist:"Foo Fighters",era:"90s",genre:"Rock"},
  {id:26,title:"Use Somebody",artist:"Kings of Leon",era:"2000s",genre:"Rock"},
  {id:27,title:"Rock And Roll",artist:"Led Zeppelin",era:"70s",genre:"Rock"},
  {id:28,title:"Toxic",artist:"Britney Spears",era:"2000s",genre:"Pop"},
  {id:29,title:"Me And Bobby McGee",artist:"Janis Joplin",era:"70s",genre:"Folk"},
  {id:30,title:"All Apologies",artist:"Nirvana",era:"90s",genre:"Rock"},
  {id:31,title:"Sweet Child O Mine",artist:"Guns N' Roses",era:"80s",genre:"Rock"},
  {id:32,title:"Superstition",artist:"Stevie Wonder",era:"70s",genre:"Soul"},
  {id:33,title:"Black Hole Sun",artist:"Soundgarden",era:"90s",genre:"Rock"},
  {id:34,title:"Better Man",artist:"Pearl Jam",era:"90s",genre:"Rock"},
  {id:35,title:"Call Me The Breeze",artist:"Lynyrd Skynyrd",era:"70s",genre:"Rock"},
  {id:36,title:"Can't You See",artist:"Marshall Tucker Band",era:"70s",genre:"Rock"},
  {id:37,title:"Dear Mr Fantasy",artist:"Traffic",era:"60s",genre:"Rock"},
  {id:38,title:"Espresso",artist:"Sabrina Carpenter",era:"2020s",genre:"Pop"},
  {id:39,title:"Flowers",artist:"Miley Cyrus",era:"2020s",genre:"Pop"},
  {id:40,title:"Magic Carpet Ride",artist:"Steppenwolf",era:"60s",genre:"Rock"},
  {id:41,title:"Folsom Prison Blues",artist:"Johnny Cash",era:"60s",genre:"Country"},
  {id:42,title:"Gunpowder And Lead",artist:"Miranda Lambert",era:"2000s",genre:"Country"},
  {id:43,title:"Have You Ever Seen The Rain",artist:"Creedence Clearwater Revival",era:"70s",genre:"Rock"},
  {id:44,title:"Hotel California",artist:"The Eagles",era:"70s",genre:"Rock"},
  {id:45,title:"House Of The Rising Sun",artist:"The Animals",era:"60s",genre:"Rock"},
  {id:46,title:"I Love Rock N Roll",artist:"Joan Jett",era:"80s",genre:"Rock"},
  {id:47,title:"I Put A Spell On You",artist:"Nina Simone",era:"60s",genre:"Soul"},
  {id:48,title:"I'm Like A Bird",artist:"Nelly Furtado",era:"2000s",genre:"Pop"},
  {id:49,title:"Jolene",artist:"Dolly Parton",era:"70s",genre:"Country"},
  {id:50,title:"Edge Of 17",artist:"Stevie Nicks",era:"80s",genre:"Rock"},
  {id:51,title:"Mary Jane's Last Dance",artist:"Tom Petty",era:"90s",genre:"Rock"},
  {id:52,title:"Free Fallin",artist:"Tom Petty",era:"80s",genre:"Rock"},
  {id:53,title:"Pink Pony Club",artist:"Chappell Roan",era:"2020s",genre:"Pop"},
  {id:54,title:"Roadhouse Blues",artist:"The Doors",era:"60s",genre:"Rock"},
  {id:55,title:"Under The Bridge",artist:"Red Hot Chili Peppers",era:"90s",genre:"Rock"},
  {id:56,title:"Witchy Woman",artist:"The Eagles",era:"70s",genre:"Rock"},
  {id:57,title:"You Oughta Know",artist:"Alanis Morissette",era:"90s",genre:"Rock"},
  {id:58,title:"Ain't No Sunshine",artist:"Bill Withers",era:"70s",genre:"Soul"},
  {id:59,title:"Use Me",artist:"Bill Withers",era:"70s",genre:"Soul"},
  {id:60,title:"Summertime",artist:"Nina Simone",era:"60s",genre:"Soul"},
  {id:61,title:"Knockin' On Heaven's Door",artist:"Bob Dylan",era:"70s",genre:"Folk"},
  {id:62,title:"Fast Car",artist:"Tracy Chapman",era:"80s",genre:"Folk"},
  {id:63,title:"Horse With No Name",artist:"America",era:"70s",genre:"Folk"},
  {id:64,title:"In Dreams",artist:"Sierra Ferrell",era:"2010s",genre:"Folk"},
  {id:65,title:"Far Away Across The Sea",artist:"Sierra Ferrell",era:"2010s",genre:"Folk"},
  {id:66,title:"The Sea",artist:"Sierra Ferrell",era:"2010s",genre:"Folk"},
  {id:67,title:"All Along The Watchtower",artist:"Jimi Hendrix",era:"60s",genre:"Rock"},
  {id:68,title:"Hey Joe",artist:"Jimi Hendrix",era:"60s",genre:"Rock"},
  {id:69,title:"Billie Jean",artist:"Michael Jackson",era:"80s",genre:"Pop"},
  {id:70,title:"Everybody Wants To Rule The World",artist:"Tears For Fears",era:"80s",genre:"Pop"},
  {id:71,title:"Seven Nation Army",artist:"The White Stripes",era:"2000s",genre:"Rock"}
];
