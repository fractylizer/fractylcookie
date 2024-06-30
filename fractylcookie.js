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
    this.createAchievements()
  },
  check:function() {
    Game.mods['fractylCookie'].checkAchievements();
  },
  reset:function(hardreset) {
    if (!hardreset) {
      if (Math.round(Game.cookies)==69000000000000) {Game.Win('When the cookies ascend just nice');}
    }
  },
  createAchievements:function() {
    this.addAchievement("Pretty pink priorities", "Shape your clones as <b>the default, with pink skin.</b>",[1,0,this.icons],32600,'shadow');
    this.addAchievement("Regular person complex", "Name yourself <b>Fractyl</b>.<div class=\"warning\">Note: this doesn't have any penalties.</div><q>Out of everyone you could have named yourself after?</q>",[0,0,this.icons],30200.160,'shadow');
    this.addAchievement("Self-sacrifice", "Sell a You.<q>We're all so sad to see you go.</q>",[35,0],2600,'normal');
    this.addAchievement("Really?", "Use the <b>Extra Content Mod</b>.<q>I thought you had a life.<br>Seems I was mistaken.</q>",[2,0,this.icons],69421,'shadow');
    this.addAchievement("When the cookies ascend just nice", loc("Ascend with exactly <b>%1</b>.",loc("%1 cookie",LBeautify(6.9e13))),[25,7],30250.398,'shadow');
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
  },
  url:"https://fractylizer.github.io/fractylcookie/",
  icons:`https://fractylizer.github.io/fractylcookie/img/icons.png`
});