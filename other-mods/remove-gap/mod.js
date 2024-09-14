Game.registerMod('removeGap',{
  init:function(){if(Game.ready){this.r()}else{Game.registerHook('create',this.r)};},
  r:function(){
    Game.Achievements["Affluent bakery"].icon=[0,0,this.i];
    Game.Achievements["Mass producer"].icon=[0,0,this.i];
  },
  i:'https://fractylizer.github.io/fractylcookie/other-mods/remove-gap/icon.png'
});