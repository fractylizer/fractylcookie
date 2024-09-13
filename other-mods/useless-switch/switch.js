
Game.Win('Third-party');

Game.registerMod('uselessSwitch',{
  init:function(){
    Game.registerHook('reset', function(hardreset) {Game.mods['uselessSwitch'].reset(hardreset)});
    if(Game.ready) {this.create()}
    else {Game.registerHook('create', this.create)};
  },
  switchOn:0,
  save:function(){return `${this.switchOn}`;},
  load:function(str){
    this.switchOn = Number(str);
    this.update();
  },
  update:function(){
    Game.Upgrades['Broken light switch [on?]'].bought = this.switchOn=0?1:0
    Game.Upgrades['Broken light switch [off]'].bought = this.switchOn
  },
  create:function() {
    new Game.Upgrade('Broken light switch [off]',loc("Turning this on will give you nothing. <br>Cost is equal to 1 cookie.",1),1,[1,0,this.icons]);
		Game.last.pool = 'toggle';
    Game.last.toggleInto = 'Broken light switch [on?]';
    Game.Unlock('Broken light switch [off]')
		new Game.Upgrade('Broken light switch [on?]',loc("The switch is currently giving you nothing. <br>Cost is equal to 1 cookie.",50),1,[0,0,this.icons]);
		Game.last.pool = 'toggle';
    Game.last.toggleInto = 'Broken light switch [off]';
    Game.Unlock('Broken light switch [on]')
    LocalizeUpgradesAndAchievs();
  },
  reset:function(hardreset) {
    if (hardreset) {
      this.switchOn = 0;
      this.update();
    }
  },
  icons:`https://fractylizer.github.io/fractylcookie/other-mods/useless-switch/icons.png`
});