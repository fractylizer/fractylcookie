Game.Win('Third-party');

Game.registerMod('elessclessmless',{
  init:function(){
    if(Game.ready) this.createAchievements()
    else Game.registerHook("create", this.createAchievements)
    Game.registerHook("check", this.checkAchievements)
  },
  spritesheet:"https://lookas123.github.io/ECM/ExtraContent.png",
  createAchievements: function(){
    this.achievements = []
    this.achievements.push(new Game.Achievement("Small block of gold", "Click <b>14 golden cookies.</b> <q>Worth approximately 9 ingots.</q>",[0,0,this.spritesheet]))
    this.achievements.push(new Game.Achievement("Short cycle", "Ascend <b>20 times.</b> <q>Now you can tend to the cookie again. Because that's the point of the game.</q>",[1,0,this.spritesheet]))
    this.achievements.push(new Game.Achievement("Shiny wrinklers are too rare", "Have a <b>wrinkler</b>. <q>RNG be gone!</q>",[2,0,this.spritesheet]))
    this.achievements.push(new Game.Achievement("Passive income?", "Have your stock market profits surpass <b>one hour per year that Cookie Clicker has existed.</b> <q>Hey, this reminds me of birthday cookie!</q>",[3,0,this.spritesheet]))
    this.achievements.push(new Game.Achievement("Short-lived diet", "Unlock the <b>Farm</b>. <q>No need to get your hands dirty! Those hornets must be starving!</q>",[4,18, "https://lookas123.github.io/ECM/img/gardenPlants.png"]))
    this.achievements.push(new Game.Achievement("The hole between atoms", "Bake a normal number of cookies (current requirement: <b>2 thousand</b>). <q>Which at this point, is just... 2 thousand.</q>",[26,17]))
    this.achievements.push(new Game.Achievement("The will of the not-so wondrous wizard", "Unlock the <b>Grimoire</b>. <q>Phew! All this spelling nonsense is two hard.</q>",[27,11]))
    this.achievements.push(new Game.Achievement("Go inside", "Complete every ECM-less achievement. <q>You've earned it.</q>",[4,0,this.spritesheet]))
    for(let i of this.achievements){i.pool="shadow";i.order=69421;}
    LocalizeUpgradesAndAchievs()
  },
  checkAchievements: function(){
      if(Game.goldenClicks>=14) Game.Win("Small block of gold")
      if(Game.resets>=20)Game.Win("Short cycle")
      if(Game.Objects.Bank.minigameLoaded && Game.Objects.Bank.minigame.profit>=(Date.now()-new Date(2013,7,8))/31536000000) Game.Win("Passive income?")
      if(Game.cookiesEarned+Game.cookiesReset>2000 && Game.version <= 2.052) {Game.Win("The hole between atoms")} else {Game.Achievements["The hole between atoms"].won=0}
      if(Game.Objects["Wizard tower"].minigameLoaded)Game.Win("The will of the not-so wondrous wizard")
      if(Game.Objects.Farm.minigameLoaded)Game.Win("Short-lived diet")
      if(Game.wrinklers.some((w)=>{return w.sucked > 0})) Game.Win("Shiny wrinklers are too rare")
      if(Game.mods["elessclessmless"].achievements.every((a)=>{return a.won||(a.name=="Go inside")})) Game.Win("Go inside")
  },
  save: function(){
      let str = "";
      for(let i of this.achievements)str+=i.won
      return str;
  },
  load: function(str){
      for(let i in this.achievements)this.achievements[i].won=Number(str[i])
  }
})