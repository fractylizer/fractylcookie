Game.Win('Third-party');

Game.registerMod('fractylCookie',{
  init:function(){
    Game.registerHook('check', this.check);
    Game.registerHook('reset', function(hardreset) {Game.mods['fractylCookie'].reset(hardreset)});
    if(Game.ready) {this.create()}
    else {Game.registerHook('create', this.create)};
  },
  save:function(){
    let objToSave = {
      achievements:"",
      upgrades:"",
    };
    for(let i of this.achievements) {objToSave.achievements+=i.won};
    for(let i of this.upgrades) {objToSave.upgrades+=i.bought};
    return JSON.stringify(objToSave);
  },
  load:function(str){
    var data = JSON.parse(str);
    for(let i in data.achievements) {this.achievements[i].won = Number(data.achievements[i])}
    for(let i in data.upgrades) {this.upgrades[i].bought = Number(data.upgrades[i])}
  },
  addAchievement:function(name,desc,icon,achorder,pool) {
    this.achievements.push(new Game.Achievement(name,desc,icon))
    if (pool == "shadow") {
      Game.last.pool = 'shadow';
    }
    Game.last.order = achorder;
  },
  addCookieUpgrade:function(obj,upgorder){
    this.upgrades.push(Game.NewUpgradeCookie(obj));
    Game.last.order = upgorder;
  },
  achievements: [],
  upgrades: [],
  create:function() {
    Game.Loader.Replace('wrinkler.png',`https://fractylizer.github.io/fractylcookie/img/wrinkler.png`);
    Game.Loader.Replace('perfectCookie.png',`https://fractylizer.github.io/fractylcookie/img/perfectCookie.png`);
    Game.Loader.Replace('goldCookie.png',`https://fractylizer.github.io/fractylcookie/img/goldCookie.png`);
    Game.Loader.Replace('wrathCookie.png',`https://fractylizer.github.io/fractylcookie/img/wrathCookie.png`);
    Game.Objects['You'].sellFunction=function(){Game.Win('Self-sacrifice')}
    Game.Reset = Function(`
      (${Game.Reset.toString().replace(`if (Math.round(Game.cookies)==1000000000000) Game.Win('When the cookies ascend just right');`,`if (Math.round(Game.cookies)==1000000000000) Game.Win('When the cookies ascend just right'); if (Math.round(Game.cookies)==69000000000000) Game.Win('When the cookies ascend just nice');`)})();
    `)
    this.createAchievements()
    this.createUpgrades()
  },
  check:function() {
    Game.mods['fractylCookie'].checkAchievements();
  },
  reset:function(hardreset) {if(hardreset){}},
  createUpgrades:function() {
		this.addCookieUpgrade({name:'Fractyl cookies',desc:'A mostly plain cookie, with a white chocolate logo. A delicious reminder to give Fractyl all your money.',icon:[0,1,this.icons],power:5,price:9999999999999999*5},10020.2575);
		this.addCookieUpgrade({name:'Red velvet cookies',desc:'Fancy! The presence of white chocolate chips is a given.',icon:[1,1,this.icons],power:2,price:9999999999*5},10004);
    this.addCookieUpgrade({name:'Compact discs',desc:'Despite what you might assume, these are often not interchangable with cookies.',icon:[2,1,this.icons],require:'Box of not cookies',power:5,price:Math.pow(10,48)},10061)
    this.addCookieUpgrade({name:'Inverted cookies',desc:'The result of extensive photo manipulation. A magical sight.',icon:[4,0,this.icons],require:'Box of maybe cookies',power:5,price:Math.pow(10,49)},10051)
    this.addCookieUpgrade({name:'Sausage rolls',desc:'It\'s the pastry equivalent of a hotdog, and it stands out from the other pastries which are much more on-theme.',icon:[1,2,this.icons],require:'Box of pastries',power:4,price:Math.pow(10,49)},10041)
    this.addCookieUpgrade({name:'Triple chocolate cookies.',desc:'White, milk, and dark. The end to all chocolate conflict, and the beginning of a bright future.',icon:[0,2,this.icons],power:4,price:9999999999*5},10003)
    LocalizeUpgradesAndAchievs();
  },
  createAchievements:function() {
    this.addAchievement("Pretty pink priorities", "Shape your clones as <b>the default, with pink skin.</b>",[1,0,this.icons],32600,'shadow');
    this.addAchievement("Regular person complex", "Name yourself <b>Fractyl</b>.<div class=\"warning\">Note: this doesn't have any penalties.</div><q>Out of everyone you could have named yourself after?</q>",[0,0,this.icons],30200.1595,'shadow');
    this.addAchievement("Self-sacrifice", "Sell a You.<q>We're all so sad to see you go.</q>",[35,0],2600,'normal');
    this.addAchievement("Really?", "Use the <b>Extra Content Mod</b>.<q>I thought you had a life.<br>Seems I was mistaken.</q>",[2,0,this.icons],69422,'shadow');
    this.addAchievement("When the cookies ascend just nice", loc("Ascend with exactly <b>%1</b>.",loc("%1 cookie",LBeautify(6.9e13))),[3,0,this.icons],30250.398,'shadow');
    this.addAchievement("Fibonacci", "Have at least <b>1 of the most expensive building, 1 of the second-most expensive, 2 of the next, 3 of the next, 5 of the next</b> and so on (capped at 377).",[23,12],7000.08,'normal');
    this.addAchievement("Golden combination", "Have <b>2 positive multiplier buffs</b> active simultaneously.",[3,1,this.icons],10000.3,'normal');
    this.addAchievement("Golden triple", "Have <b>3 positive multiplier buffs</b> active simultaneously.",[4,1,this.icons],10000.301,'normal');
    this.addAchievement("Really-er?", "Use the <b>Extra-er Content-er Mod-er</b>.<q>You're gonna need thousands of frames per second, an autoclicker, and a LOT of free time.</q>",[5,0,this.icons],69423,'shadow');
    this.addAchievement("Really-less?", "Use the <b>Extra-less Content-less Mod-less</b>.<q>For the normal ones among us.</q>",[6,0,this.icons],69424,'shadow');
    LocalizeUpgradesAndAchievs();
  },
  checkAchievements:function() {
    if (Game.YouCustomizer.currentGenes[0]==0
      && (Game.YouCustomizer.currentGenes[2]==12)
      && (Game.YouCustomizer.currentGenes[3]==0)
      && (Game.YouCustomizer.currentGenes[4]==0)
      && (Game.YouCustomizer.currentGenes[5]==0)
      && (Game.YouCustomizer.currentGenes[5]==0)
    ) {Game.Win('Pretty pink priorities')};
    if (Game.bakeryName.toLowerCase() =='fractyl') {Game.Win('Regular person complex')};
    if (Game.mods['extraContent'] !== undefined) {Game.Win('Really?')}
    if (Game.mods['Eercermer'] !== undefined) {Game.Win('Really-er?')}
    if (Game.mods['elessclessmless'] !== undefined) {Game.Win('Really-less?')}
    let isafibonacci = 1;
    if (!Game.HasAchiev('Fibonacci')) {
      for (var i in Game.Objects) {
        if (Game.Objects[i].amount<Math.min(377,Game.mods['fractylCookie'].fibonacci((Game.ObjectsById.length-Game.Objects[i].id)))) isafibonacci=0;
      }
    }
    if (isafibonacci==1) Game.Win('Fibonacci');
    let buffs = Object.keys(Game.buffs);
    let badBuffs = ['Clot','Slap to the face','Senility','Locusts','Cave-in','Jammed machinery','Recession','Crisis of faith','Magivores','Black holes','Lab disaster','Dimensional calamity','Time jam','Predictable tragedy','Eclipse','Dry spell','Microcosm','Antipattern','Big crunch','Brain freeze','Clone strike','Cursed finger','Gifted out','Cookie storm']
    badBuffs.forEach(buff => {buffs = Game.mods['fractylCookie'].rifarr(buffs,buff)});
    if (buffs.length >= 2) {Game.Win('Golden combination')}
    if (buffs.length >= 3) {Game.Win('Golden ternary')}
  },
  rifarr:function(arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) {arr.splice(index, 1);}
    return arr;
  },
  fibonacci:function(n){return Math.round((Math.pow((1 + Math.sqrt(5)) / 2, n) - Math.pow((1 - Math.sqrt(5)) / 2, n)) / Math.sqrt(5));},
  url:"https://fractylizer.github.io/fractylcookie/",
  icons:`https://fractylizer.github.io/fractylcookie/img/icons.png`
});