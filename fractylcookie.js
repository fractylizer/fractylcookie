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
    };
    for(let i of this.achievements) {objToSave.achievements+=i.won};
    return JSON.stringify(objToSave);
  },
  load:function(str){
    var data = JSON.parse(str);
    for(let i in data.achievements) {this.achievements[i].won = Number(data.achievements[i])}
  },
  addAchievement:function(name,desc,icon,achorder,pool) {
    this.achievements.push(new Game.Achievement(name,desc,icon))
    if (pool == "shadow") {
      Game.last.pool = 'shadow';
    }
    Game.last.order = achorder;
  },
  achievements: [],
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
  reset:function(hardreset) {
    if (!hardreset) {
      if (Math.round(Game.cookies)==69000000000000) {Game.Win('When the cookies ascend just nice');}
    }
  },
  createUpgrades:function() {
		Game.NewUpgradeCookie({name:'Fractyl cookies',desc:'A mostly plain cookie, with a white chocolate logo. A delicious reminder to give Fractyl all your money.',icon:[0,1,this.icons],power:5,price:9999999999999999*5});
    Game.last.order = 10020.2575;
		Game.NewUpgradeCookie({name:'Red velvet cookies',desc:'Fancy! The presence of white chocolate chips is a given.',icon:[1,1,this.icons],power:2,price:9999999999*5});
    Game.last.order = 10003;
    LocalizeUpgradesAndAchievs();
  },
  createAchievements:function() {
    this.addAchievement("Pretty pink priorities", "Shape your clones as <b>the default, with pink skin.</b>",[1,0,this.icons],32600,'shadow');
    this.addAchievement("Regular person complex", "Name yourself <b>Fractyl</b>.<div class=\"warning\">Note: this doesn't have any penalties.</div><q>Out of everyone you could have named yourself after?</q>",[0,0,this.icons],30200.1595,'shadow');
    this.addAchievement("Self-sacrifice", "Sell a You.<q>We're all so sad to see you go.</q>",[35,0],2600,'normal');
    this.addAchievement("Really?", "Use the <b>Extra Content Mod</b>.<q>I thought you had a life.<br>Seems I was mistaken.</q>",[2,0,this.icons],69421,'shadow');
    this.addAchievement("When the cookies ascend just nice", loc("Ascend with exactly <b>%1</b>.",loc("%1 cookie",LBeautify(6.9e13))),[3,0,this.icons],30250.398,'shadow');
    this.addAchievement("Fibonacci", "Have at least <b>1 of the most expensive building, 1 of the second-most expensive, 2 of the next, 3 of the next, 5 of the next</b> and so on (capped at 377).",[23,12],7000.08,'normal');
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
    let isafibonacci = 1;
    if (!Game.HasAchiev('Fibonacci')) {
      for (var i in Game.Objects) {
        if (Game.Objects[i].amount<Math.min(377,Game.mods['fractylCookie'].fibonacci((Game.ObjectsById.length-Game.Objects[i].id)))) isafibonacci=0;
      }
    }
    if (isafibonacci==1) Game.Win('Fibonacci');

  },
  fibonacci:function(n){return Math.round((Math.pow((1 + Math.sqrt(5)) / 2, n) - Math.pow((1 - Math.sqrt(5)) / 2, n)) / Math.sqrt(5));},
  url:"https://fractylizer.github.io/fractylcookie/",
  icons:`https://fractylizer.github.io/fractylcookie/img/icons.png`
});