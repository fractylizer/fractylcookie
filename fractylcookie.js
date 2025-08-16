Game.Win('Third-party');

Game.registerMod('fractylCookie',{
  init:function(){
    Game.registerHook('check', this.check);
    Game.registerHook('reset', function(hardreset) {Game.mods['fractylCookie'].reset(hardreset)});
    if(Game.ready) {this.create()}
    else {Game.registerHook('create', this.create)};
  },
  save:function(){
    let objToSave = ""
    for(let i of this.achievements) {objToSave+=i.won};
    objToSave += "|"
    for(let i of this.upgrades) {objToSave+=i.bought};
    objToSave += "|"
    objToSave+=Game.Upgrades['Fractyl switch [off]'].bought
    return objToSave;
  },
  load:function(str){
    var data = str;
    console.log(data)
    let dataAch = str.split("|")[0]
    let dataUpg = str.split("|")[1]
    let dataFM = str.split("|")[2]
    for(let i in dataAch) {this.achievements[i].won = Number(dataAch[i])}
    for(let i in dataUpg) {this.upgrades[i].bought = Number(dataUpg[i])}
    if (dataFM == 1) {
      Game.Upgrades['Fractyl switch [off]'].bought = 1;
      Game.Upgrades['Fractyl switch [on]'].bought = 0;
      Game.Unlock('Fractyl switch [on]')
      this.fractylMode(1);
    } else {
      Game.Upgrades['Fractyl switch [off]'].bought = 0;
      Game.Upgrades['Fractyl switch [on]'].bought = 1;
      Game.Unlock('Fractyl switch [off]')
      this.fractylMode(0);
    }
  },
  addAchievement:function(name,desc,icon,achorder,pool) {
    this.achievements.push(new Game.Achievement(name,desc,icon))
    if (pool == "shadow") {
      Game.last.pool = 'shadow';
    }
    Game.last.order = achorder;
  },
  addTieredAchievement(name,desc,building,tier,icon,achorder){
    console.log(building)
    this.achievements.push(new Game.Achievement(name,loc("Have <b>%1</b>.",loc("%1 "+Game.Objects[building].bsingle,LBeautify(Game.Tiers[tier].achievUnlock)))+desc,icon));
    Game.SetTier(building,tier);
    Game.last.order = achorder;
  },
  addLevel20Achievement:function(name,desc,icon,obj,achorder) {
    this.addAchievement(name,desc,icon,achorder,'normal')
    Game.Objects[obj].levelAchiev20 = Game.last;
  },
  addCookieUpgrade:function(obj,upgorder){
    this.upgrades.push(Game.NewUpgradeCookie(obj));
    Game.last.order = upgorder;
    Game.cookieUpgrades.push(Game.last);
  },
  addPrestigeUpgrade:function(name,desc,cost,icon,parents,order,posx,posy){
    this.upgrades.push(new Game.Upgrade(name,desc,cost,icon))
    Game.last.pool = 'prestige';
    let newParents = parents.map(function(e) { 
      e = Game.Upgrades[e]; 
      return e;
    });
    Game.last.parents = newParents;
    Game.last.order = order;
    Game.last.posX=posx
    Game.last.posY=posy
    Game.PrestigeUpgrades.push(Game.last)
  },
  achievements: [],
  upgrades: [],
  fractylMode:function(activate){
    if (activate == 1) {
      Game.Loader.Replace('wrinkler.png',`https://fractylizer.github.io/fractylcookie/img/wrinkler.png`);
      Game.Loader.Replace('perfectCookie.png',`https://fractylizer.github.io/fractylcookie/img/perfectCookie.png`);
    } else if (activate == 0) {
      Game.Loader.Replace(`wrinkler.png`,'wrinkler.png');
      Game.Loader.Replace(`perfectCookie.png`,'perfectCookie.png');
    }
  },
  create:function() {
    Game.Tiers[16]={name:'Stellarbutter',unlock:650,achievUnlock:750,iconRow:0,color:'#526f4d',price:500000000000000000000000000000000000000000000}
    Game.NewUpgradeCookie=function(obj)
		{
			var upgrade=new Game.Upgrade(obj.name,loc("Cookie production multiplier <b>+%1%</b>.",'[x]').replace('[x]',Beautify((typeof(obj.power)==='function'?obj.power(obj):obj.power)))+(EN?'<q>'+obj.desc+'</q>':''),obj.price,obj.icon);
			upgrade.power=obj.power;
			upgrade.pool='cookie';
			var toPush={cookies:obj.price/20,name:obj.name};
			if (obj.require) toPush.require=obj.require;
			if (obj.season) toPush.season=obj.season;
			if (!obj.locked) Game.UnlockAt.push(toPush);upgrade.unlockAt = toPush;
			return upgrade;
		}
    Game.Objects['You'].sellFunction=function(){Game.Win('Self-sacrifice')}
    Game.Reset = Function(`
      (${Game.Reset.toString().replace(`if (Math.round(Game.cookies)==1000000000000) Game.Win('When the cookies ascend just right');`,`if (Math.round(Game.cookies)==1000000000000) Game.Win('When the cookies ascend just right'); if (Math.round(Game.cookies)==69000000000000) Game.Win('When the cookies ascend just nice');`)})();
    `)
    this.createAchievements()
    this.createUpgrades()
    
    // Update levelUp function
    Object.keys(Game.Objects).forEach((key) => {
      let obj = Game.Objects[key];
      obj.levelUp = function(me){
				return function(free){Game.spendLump(me.level+1,loc("level up your %1",me.plural),function()
				{
					me.level+=1;
					if (me.level>=10 && me.levelAchiev10) Game.Win(me.levelAchiev10.name);
					if (me.level>=20 && me.levelAchiev20) Game.Win(me.levelAchiev20.name);
					if (!free) PlaySound('snd/upgrade.mp3',0.6);
					Game.LoadMinigames();
					me.refresh();
					if (l('productLevel'+me.id)){var rect=l('productLevel'+me.id).getBounds();Game.SparkleAt((rect.left+rect.right)/2,(rect.top+rect.bottom)/2-24+32-TopBarOffset);}
					if (me.minigame && me.minigame.onLevel) me.minigame.onLevel(me.level);
				},free)();};
			}(obj);
    });
  },
  check:function() {
    Game.mods['fractylCookie'].checkAchievements();
  },
  reset:function(hardreset) {
    if (hardreset) {
      for(let i of this.achievements) {this.achievements[i].owned = 0};
      for(let i of this.upgrades) {this.upgrades[i].bought = 0};
    }
  },
  createUpgrades:function() {

		this.addCookieUpgrade({name:'Fractyl cookies',desc:'A mostly plain cookie, with a white chocolate logo. A delicious reminder to give Fractyl all your money.',icon:[0,1,this.icons],power:5,price:9999999999999999*5},10020.2575);
		this.addCookieUpgrade({name:'Red velvet cookies',desc:'Fancy! The presence of white chocolate chips is a given.',icon:[1,1,this.icons],power:2,price:9999999999*5},10004);
    this.addCookieUpgrade({name:'Compact discs',desc:'Despite what you might assume, these are often not interchangable with cookies.',icon:[2,1,this.icons],require:'Box of not cookies',power:5,price:Math.pow(10,48)},10061)
    this.addCookieUpgrade({name:'Inverted cookies',desc:'The result of extensive photo manipulation. A magical sight.',icon:[4,0,this.icons],require:'Box of maybe cookies',power:5,price:Math.pow(10,49)},10051)
    this.addCookieUpgrade({name:'Sausage rolls',desc:'It\'s the pastry equivalent of a hotdog, so it stands out from the other pastries which are much more on-theme.',icon:[1,2,this.icons],require:'Box of pastries',power:4,price:Math.pow(10,49)},10041)
    this.addCookieUpgrade({name:'Triple chocolate cookies',desc:'White, milk, and dark. The end to all chocolate conflict, and the beginning of a bright future.',icon:[0,2,this.icons],power:4,price:9999999999*5},10003)

    let chocPacket = 'Packet of chocolate cookies'
		this.addPrestigeUpgrade(chocPacket,loc("Contains an assortment of chocolate cookies.")
    +'<q>If it ain\'t broke, create a chocolate version!</q>',25,[5,1,this.icons],['Heavenly cookies'],0.1);
    Game.Upgrades['Starter kit'].parents.push(Game.Upgrades[chocPacket],50,-200)

    // Chocolate cookies
    this.addCookieUpgrade({name:'Chocolate peanut butter cookies',desc:'A common form of the chocolate cookie. Made using fresh chocolate peanuts.',icon:[3,3,this.icons],require:chocPacket,power:2,price:200000000},10033)
    this.addCookieUpgrade({name:'Chocolate coconut cookies',desc:'These are more common in cake form. Feel free to berate the inventor for not dubbing them "cocoacoconut cookies".',icon:[2,2,this.icons],require:chocPacket,power:2,price:200000000},10033.01)
    this.addCookieUpgrade({name:'Chocolate almond cookies',desc:'Similar in appearance to a chocolated-covered almond with too much chocolate.',icon:[4,2,this.icons],require:chocPacket,power:2,price:200000000},10033.02)
    this.addCookieUpgrade({name:'Chocolate hazelnut cookies',desc:'Reminiscent of a particular spread. Would not recommended trying to maximise the surface area of your cookies, though.',icon:[5,2,this.icons],require:chocPacket,power:2,price:200000000},10033.03)
    this.addCookieUpgrade({name:'Chocolate walnut cookies',desc:'These were stumbled upon during an investigation into the possible sentience of walnuts. The investigation is actively being interrupted by rogue walnuts escaping the walnut facility.',icon:[6,2,this.icons],require:chocPacket,power:2,price:200000000},10033.04)
    this.addCookieUpgrade({name:'Chocolate cashew cookies',desc:'You did your research properly before making these, right? You don\'t know what things cashews could achieve when in contact with foreign ingredients.',icon:[3,2,this.icons],require:chocPacket,power:2,price:200000000},10033.05)
    this.addCookieUpgrade({name:'Chocolate fractyl cookies',desc:'These could do with a bit of contrast, couldn\'t they?',icon:[2,3,this.icons],require:chocPacket,power:2,price:9999999999999999*7},10033.05)

    // Fractyl switch
		order=50001;
		new Game.Upgrade('Fractyl switch [off]',loc("Turning this on will activate <b>Fractyl mode</b>, which adds the Fractyl logo to the big cookie and wrinklers. <br>Costs 1 cookie.",1),1,[0,3,this.icons]);
		Game.last.pool='toggle';Game.last.toggleInto='Fractyl switch [on]';
		Game.last.buyFunction=function(){Game.mods['fractylCookie'].fractylMode(1)}
    Game.last.order = 50002;
		new Game.Upgrade('Fractyl switch [on]',loc("<b>Fractyl mode</b> is currently active. <br>Turning it off will revert the big cookie and wrinklers to normal. <br>Costs 1 cookie.",1),1,[1,3,this.icons]);
		Game.last.pool='toggle';Game.last.toggleInto='Fractyl switch [off]';
		Game.last.buyFunction=function(){Game.mods['fractylCookie'].fractylMode(0)}
    Game.last.order = 50003;
    Game.Unlock('Fractyl switch [on]')

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

    // Level 20 achievements
    this.addLevel20Achievement("Double thumbs up", "Reach level <b>20</b> cursors.",[0,27],'Cursor',1071);
    this.addLevel20Achievement("Old-fashioned", "Reach level <b>20</b> grandmas.",[1,27],'Grandma',1121);
    this.addLevel20Achievement("Barnyard fever", "Reach level <b>20</b> farms.",[2,27],'Farm',1221);
    this.addLevel20Achievement("Between a rock and a hard place", "Reach level <b>20</b> mines.",[3,27],'Mine',1321);
    this.addLevel20Achievement("One million gears", "Reach level <b>20</b> factories.<q>And spinning things.</q>",[4,27],'Factory',1421);
    this.addLevel20Achievement("Dollars on the penny", "Reach level <b>20</b> banks.",[15,27],'Bank',1446);
    this.addLevel20Achievement("Escalator to heaven", "Reach level <b>20</b> temples.",[16,27],'Temple',1471);
    this.addLevel20Achievement("Wonderful wizards of wonderful wizardry", "Reach level <b>20</b> wizard towers.",[17,27],'Wizard tower',1496);
    this.addLevel20Achievement("Intergalactic planetary", "Reach level <b>20</b> shipments.",[5,27],'Shipment',1521);
    this.addLevel20Achievement("Elementary", "Reach level <b>20</b> alchemy labs.",[6,27],'Alchemy lab',1621);
    this.addLevel20Achievement("Remote getaway", "Reach level <b>20</b> portals.",[7,27],'Portal',1721);
    this.addLevel20Achievement("Blast to and from the past", "Reach level <b>20</b> time machines.",[8,27],'Time machine',1821);
    this.addLevel20Achievement("Antimattermentarianism", "Reach level <b>20</b> antimatter condensers.",[13,27],'Antimatter condenser',1921);
    this.addLevel20Achievement("Faster than light", "Reach level <b>20</b> prisms.",[14,27],'Prism',2021);
    this.addLevel20Achievement("You never know", "Reach level <b>20</b> chancemakers.",[19,27],'Chancemaker',2121);
    this.addLevel20Achievement("Each solar system an atom", "Reach level <b>20</b> fractal engines.",[20,27],'Fractal engine',2221);
    this.addLevel20Achievement("Forward compatibility", "Reach level <b>20</b> javascript consoles.",[32,27],'Javascript console',2321);
    this.addLevel20Achievement("Hyperbolic space", "Reach level <b>20</b> idleverses.",[33,27],'Idleverse',2421);
    this.addLevel20Achievement("Just think about it", "Reach level <b>20</b> cortex bakers.",[34,27],'Cortex baker',2521);
    this.addLevel20Achievement("Group selfie", "Reach level <b>20</b> You.",[35,27],'You',2621);

    // Extra tiered achievements
    //this.addAchievement("Hands-on experience",loc("Have <b>%1</b>.",loc("%1 cursor",LBeautify(1100))),[0,30],1051)
    this.addTieredAchievement("Like wine", "","Grandma",16,[1,4,this.icons],1101);
    this.addTieredAchievement("Plow down", "","Farm",16,[2,4,this.icons],1201);
    this.addTieredAchievement("Buried treasure", "","Mine",16,[3,4,this.icons],1301);
    this.addTieredAchievement("Kuiper conveyor belt", "","Factory",16,[4,4,this.icons],1401);
    this.addTieredAchievement("Must be funny", "","Bank",16,[15,4,this.icons],1426);
    this.addTieredAchievement("Pray by pray", "","Temple",16,[16,4,this.icons],1451);
    this.addTieredAchievement("We love casting spells", "","Wizard tower",16,[17,4,this.icons],1476);
    this.addTieredAchievement("Such a timeless flight", "","Shipment",16,[5,4,this.icons],1501);
    this.addTieredAchievement("Qualitative and quantitative", "","Alchemy lab",16,[6,4,this.icons],1601);
    this.addTieredAchievement("Both shadow and substance", "","Portal",16,[7,4,this.icons],1701);
    this.addTieredAchievement("A time a dozen", "","Time machine",16,[8,4,this.icons],1801);
    this.addTieredAchievement("Strike that, reverse it", "","Antimatter condenser",16,[13,4,this.icons],1901);
    this.addTieredAchievement("A lightbulb moment", "","Prism",16,[14,4,this.icons],2001);
    this.addTieredAchievement("Head over tail", "","Chancemaker",16,[19,4,this.icons],2101);
    this.addTieredAchievement("Cantor icing sugar", "","Fractal engine",16,[20,4,this.icons],2201);
    this.addTieredAchievement("[object Object]", "<q>You may want to contact the author of this game.</q>","Javascript console",16,[21,4,this.icons],2301);
    this.addTieredAchievement("Grand theft cosmos", "","Idleverse",16,[22,4,this.icons],2401);
    this.addTieredAchievement("Brainiac", "","Cortex baker",16,[23,4,this.icons],2501);
    this.addTieredAchievement("The more the merrier", "","You",16,[24,4,this.icons],2601);

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