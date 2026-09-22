// MOONWORKS NEW TIERS MOD BEGIN

var mod = {};

mod = {
    init:function(){
        var mod = this;

        mod.version = 1;
        mod.imagePrefix = Game.local?'MoonworksNewTiers/img':'https://moonworks64.github.io/MoonworksNewTiers/img';
        mod.modString = `Game.mods['MoonworksNewTiers']`;
        mod.modAchievementList = [];
        mod.modUpgradeList = [];

        mod.butterBiscuitUpgrades = [];
        mod.clickUpgrades = [];
        mod.cursorUpgrades = [];
        mod.kittenUpgrades = [];

        mod.clickAchievements = [];
        mod.cursorAchievements = [];
        mod.levelAchievements = [];

        mod.totalBuildingsAchievements = [];
        mod.totalUpgradesAchievements = [];
        mod.totalHeavenlyUpgradesAchievements = [];
        mod.eachBuildingsAchievements = [];

        mod.ascendedCookiesAchievements = [];

        mod.limits = {
            maxCursorAchiev: 1500,
            maxTotalBuildingsAchiev: 25000
        };

        mod.columnReroute = {
            32:21,
            33:22,
            34:23,
            35:24
        };

        mod.newUnshackleUpgradeTier = function(obj) {
            var tier = Game.Tiers[obj.tier];
            var tierNum = Number(obj.tier.replace('mnt', ''));
            var upgrade=new Game.Upgrade('Unshackled '+tier.name.toLowerCase(),loc("Unshackles all <b>%1-tier upgrades</b>, making them more powerful.<br>Only applies to unshackled buildings.",cap(loc("[Tier]"+tier.name,0,tier.name)))+(EN?'<q>'+obj.q+'</q>':''),Math.pow(tierNum,7.5)*10000000,[10,tier.iconRow, mod.imagePrefix + '/icons.png']);
            upgrade.pool='prestige';
            upgrade.parents=[tierNum==16?'Unshackled glimmeringue':Game.Tiers['mnt'+(tierNum-1)].unshackleUpgrade];
            if (tierNum == 29) upgrade.parents.push('Permanent upgrade slot V');
            for (var ii in upgrade.parents) {upgrade.parents[ii]=Game.Upgrades[upgrade.parents[ii]];}
            tier.unshackleUpgrade=upgrade.name;
            upgrade.posX=750-Math.sin(tierNum*0.3-2)*300;
            upgrade.posY=200-Math.cos(tierNum*0.3-2)*300;

            Game.PrestigeUpgrades.push(upgrade);
            return upgrade;
        };

        mod.clickUpgrade = function(name,q,tier) {
            var tierNum = Number(tier.replace('mnt', ''));
            var icon = [11,(tierNum-16), mod.imagePrefix + '/icons.png'];
            var cost = 50000 * 100**(tierNum-1);
            var requirement = 10**(3+(tierNum-1)*2);
            var power = 1;
            var upgrade = new Game.Upgrade(name, loc("Clicking gains <b>+%1% of your CpS</b>.",power)+q, cost, icon);

            Game.MakeTiered(upgrade, tier);
            mod.clickUpgrades[name] = {power:power, requirement:requirement};

            return upgrade;
        };

        mod.cursorUpgrade = function(name,q,tier,power) {
            var tierNum = Number(tier.replace('mnt', ''));
            var icon = [0,(tierNum-16), mod.imagePrefix + '/icons.png'];
            var cost = 10000000 * 1000**(tierNum-7);
            var requirement = 550 + 50*(tierNum-15);
            var upgrade = new Game.Upgrade(name, loc("Multiplies the gain from %1 by <b>%2</b>.", [getUpgradeName("Thousand fingers"),power])+q, cost, icon);
            
            Game.MakeTiered(upgrade, tier);
            mod.cursorUpgrades[name] = {power:power, requirement:requirement};

            return upgrade;
        };

        mod.kittenUpgrade = function(name,q,tier) {
            var tierNum = Number(tier.replace('mnt', ''));
            var icon = Game.GetIcon('Kitten', tier);
            // For some reason, some kitten upgrades before kitten managers get *10000 instead of *1000 for the cost
            var cost = 900000000000000000000 * 1000**(tierNum-5);
            var requirement = tierNum-1;
            var power = 0.105 - (0.005 * (tierNum-15));
            var upgrade = new Game.Upgrade(name, loc("You gain <b>more CpS</b> the more milk you have.")+q, cost, icon);
            
            upgrade.kitten = 1;
            Game.MakeTiered(upgrade, tier);
            mod.kittenUpgrades[name] = {power:power, requirement:requirement};

            return upgrade;
        };

        mod.butterBiscuitUpgrade = function(name, desc, tier) {
            var butterBiscuitMult = 100000000;
            var icon = [28, tier-10, mod.imagePrefix + '/icons.png'];
            var cost = Number('9'.repeat(18 + (3 * tier)));
            var requirement = (tier+1) * 50;
            var upgrade = Game.NewUpgradeCookie({name:name,desc:desc,icon:icon,power:10,price: cost*butterBiscuitMult,locked:1});
            
            Game.cookieUpgrades.push(upgrade);
            mod.butterBiscuitUpgrades[name] = {requirement: requirement};

            return upgrade;
        };

        mod.addMilk = function(name, tier) {
            var icon = [29, tier-25, mod.imagePrefix + '/icons.png'];
            var toPush = {name:name,icon:icon,type:0,pic:'milkPlain'};
            var i = Game.AllMilks.length;
            
            Game.AllMilks.push(toPush);

            Game.AllMilks[i].bname=Game.AllMilks[i].name;
			Game.AllMilks[i].name=loc(Game.AllMilks[i].name);
			Game.AllMilks[i].pic+='.png';
			if (Game.AllMilks[i].type==0)
			{
				Game.AllMilks[i].rank=Game.Milks.length;
				Game.Milks.push(Game.AllMilks[i]);
			};
        };

        mod.bankAchievement = function(name, q) {
            var icon = [31, Game.BankAchievements.length-48, mod.imagePrefix + '/icons.png']
            var achiev = Game.BankAchievement(name, q);
            achiev.icon = icon;
            return achiev;
        };

        mod.cpsAchievement = function(name, q) {
            var icon = [31, Game.CpsAchievements.length-48, mod.imagePrefix + '/icons.png']
            var achiev = Game.CpsAchievement(name, q);
            achiev.icon = icon;
            return achiev;
        };

        mod.tieredAchievement = function(name,desc,building,tier) {
            var achiev=new Game.Achievement(name, loc("Have <b>%1</b>.", loc("%1 "+Game.Objects[building].bsingle,LBeautify(Game.Tiers[tier].achievUnlock)))+desc, Game.GetIcon(building,tier));
			Game.SetTier(building,tier);
			return achiev;
        };

        mod.clickAchievement = function(name,tier,q) {
            var tierNum = Number(tier.replace('mnt', ''));
            var icon = [11,(tierNum-16), mod.imagePrefix + '/icons.png'];
            var requirement = 10**(3+(tierNum-1)*2);
            var achiev = new Game.Achievement(name, loc("Make <b>%1</b> from clicking.", loc("%1 cookie",LBeautify(requirement)))+(q||''), icon);
            
            mod.clickAchievements[name] = {requirement:requirement};

            return achiev;
        };

        mod.cursorAchievement = function(name,q,tier) {
            var building = 'Cursor';
            var requirement = Game.Tiers[tier].achievUnlock*2;
            var achiev = new Game.Achievement(name, loc("Have <b>%1</b>.", loc("%1 "+Game.Objects[building].bsingle, LBeautify(requirement)))+q, Game.GetIcon(building,tier));
            mod.cursorAchievements[name] = {requirement:requirement};
            return achiev;
        };

        mod.productionAchievement = function(name,building,tier,q,mult) {
			var building=Game.Objects[building];
            var col = building.iconColumn;
            if (mod.columnReroute[col]) col = mod.columnReroute[col];
            var icon=[col, 21+(tier-3), mod.imagePrefix + '/icons.png'];
			var n=12+building.n+(mult||0) + ((tier-1)*7);
			var pow=Math.pow(10,n);
			var achiev=new Game.Achievement(name,loc("Make <b>%1</b> just from %2.",[loc("%1 cookie",{n:pow,b:toFixed(pow)}),building.plural])+(q?'<q>'+q+'</q>':''),icon);
			building.productionAchievs.push({pow:pow,achiev:achiev});
			return achiev;
        };

        mod.levelAchievement = function(name,buildingName,tier,q) {
            var building = Game.Objects[buildingName];
            var col = building.iconColumn;
            var icon = [col, 26+(tier-1)];
            if (tier > 2) { // Modded tiers
                if (mod.columnReroute[col]) col = mod.columnReroute[col];
                icon = [col,13+(tier-2), mod.imagePrefix + '/icons.png'];
            };
            var requirement = tier * 10;
			if (requirement > 20) return;
            var achiev = new Game.Achievement(name,loc("Reach level <b>%1</b> %2.",[requirement,building.plural])+(q||''),icon);
            building['levelAchiev'+requirement]=Game.last;
            mod.levelAchievements[name] = {building:buildingName, requirement:requirement};

			return achiev;
        };

        mod.totalBuildingsAchievement = function(name,q,tier) {
            var icon = [26, tier-10, mod.imagePrefix + '/icons.png'];
            if (tier <= 9) { // Vanilla tiers which are just unimplemented
                icon = [32 + (tier-8), 6];
            };
            var requirement = (tier-3) * 2500;
			var achiev = new Game.Achievement(name, loc("Own <b>%1</b>.",loc("%1 building",LBeautify(requirement)))+q, icon);
            
            mod.totalBuildingsAchievements[name] = {requirement:requirement};

			return achiev;
        };

        mod.totalUpgradesAchievement = function(name,q,tier) {
            var icon = [25, tier-10, mod.imagePrefix + '/icons.png'];
            var requirement = (tier-2) * 100;
			var achiev = new Game.Achievement(name, loc("Purchase <b>%1</b>.",loc("%1 upgrade",LBeautify(requirement)))+q, icon);
            
            mod.totalUpgradesAchievements[name] = {requirement:requirement};

			return achiev;
        };

        mod.totalHeavenlyUpgradesAchievement = function(name,q,tier) {
            var icon = [28, tier-2, mod.imagePrefix + '/icons.png'];
            var requirement = tier * 100;
			var achiev = new Game.Achievement(name, loc("Own <b>%1</b> heavenly upgrades.",requirement)+q, icon);
            
            mod.totalHeavenlyUpgradesAchievements[name] = {requirement:requirement};

			return achiev;
        };

        mod.eachBuildingsAchievement = function(name,q,tier) {
            var icon = [27, tier-10, mod.imagePrefix + '/icons.png'];
            var requirement = (tier+1) * 50;
			var achiev = new Game.Achievement(name, loc("Have at least <b>%1 of everything</b>.",requirement)+q, icon);
            
            mod.eachBuildingsAchievements[name] = {requirement:requirement};

			return achiev;
        };

        mod.ascendedCookiesAchievement = function(name,q,tier) {
            var icon = [30, Math.floor((tier-19)/3), mod.imagePrefix + '/icons.png'];
            var requirement = 10**(3*(tier+1));
			var achiev = new Game.Achievement(name, loc("Ascend with <b>%1</b> baked.",loc("%1 cookie",LBeautify(requirement)))+q, icon);
            
            mod.ascendedCookiesAchievements[name] = {requirement:requirement};

			return achiev;
        };

        // Go through all of the mod's achievements + upgrades and see if they're obtainable or not
        mod.updateAchievShadow = function(overrides) {
            overrides = overrides || {};

            for (var i in mod.limits) {
                mod.limits[i] = Math.max(mod.limits[i], overrides[i] || 0);
            };
            
            var totalUpgrades = 0;
            var totalHeavenlyUpgrades = 0;
            for (var i in Game.Upgrades) {
                var me = Game.Upgrades[i];
                if (me.pool=='' || me.pool=='cookie' || me.pool=='tech') totalUpgrades++;
                if (me.pool=='prestige') totalHeavenlyUpgrades++;
            };

            for (var i in mod.cursorAchievements) {
                var pool = 'normal';
                if (mod.limits.maxCursorAchiev < mod.cursorAchievements[i].requirement) pool = 'shadow';
                Game.Achievements[i].pool = pool;
            };

            for (var i in mod.totalBuildingsAchievements) {
                var pool = 'normal';
                if (mod.limits.maxTotalBuildingsAchiev < mod.totalBuildingsAchievements[i].requirement) pool = 'shadow';
                Game.Achievements[i].pool = pool;
            };

            for (var i in mod.totalUpgradesAchievements) {
                var pool = 'normal';
                if (totalUpgrades < mod.totalUpgradesAchievements[i].requirement) pool = 'shadow';
                Game.Achievements[i].pool = pool;
            };

            for (var i in mod.totalHeavenlyUpgradesAchievements) {
                var pool = 'normal';
                if (totalHeavenlyUpgrades < mod.totalHeavenlyUpgradesAchievements[i].requirement) pool = 'shadow';
                Game.Achievements[i].pool = pool;
            };
        };

        // Injections! Scary! Hacky! Very vulnerable to breaking things! Run for the hills!!!!!
        // Nerf existing cursor upgrades
        Game.Upgrades['Quintillion fingers'].baseDesc = loc("Multiplies the gain from %1 by <b>%2</b>.", [getUpgradeName("Thousand fingers"),10])+'<q>man, just go click click click click click, it\'s real easy, man.</q>'
        Game.mouseCps = new Function('return ' + Game.mouseCps.toString().replace(
            `if (Game.Has('Quintillion fingers')) add*=	20;`, 
            `if (Game.Has('Quintillion fingers')) add*=	10;`)
        )();
        Game.Objects.Cursor.cps = new Function('return ' + Game.Objects.Cursor.cps.toString().replace(
            `if (Game.Has('Quintillion fingers')) add*=	20;`, 
            `if (Game.Has('Quintillion fingers')) add*=	10;`)
        )();

        Game.Upgrades['Sextillion fingers'].baseDesc = loc("Multiplies the gain from %1 by <b>%2</b>.", [getUpgradeName("Thousand fingers"),10])+'<q>sometimes<br>things just<br>click</q>';
        Game.mouseCps = new Function('return ' + Game.mouseCps.toString().replace(
            `if (Game.Has('Sextillion fingers')) add*=	20;`, 
            `if (Game.Has('Sextillion fingers')) add*=	10;`)
        )();
        Game.Objects.Cursor.cps = new Function('return ' + Game.Objects.Cursor.cps.toString().replace(
            `if (Game.Has('Sextillion fingers')) add*=	20;`, 
            `if (Game.Has('Sextillion fingers')) add*=	10;`)
        )();

        Game.Upgrades['Septillion fingers'].baseDesc = loc("Multiplies the gain from %1 by <b>%2</b>.", [getUpgradeName("Thousand fingers"),10])+'<q>[cursory flavor text]</q>';
        Game.mouseCps = new Function('return ' + Game.mouseCps.toString().replace(
            `if (Game.Has('Septillion fingers')) add*=	20;`, 
            `if (Game.Has('Septillion fingers')) add*=	10;`)
        )();
        Game.Objects.Cursor.cps = new Function('return ' + Game.Objects.Cursor.cps.toString().replace(
            `if (Game.Has('Septillion fingers')) add*=	20;`, 
            `if (Game.Has('Septillion fingers')) add*=	10;`)
        )();

        Game.Upgrades['Octillion fingers'].baseDesc = loc("Multiplies the gain from %1 by <b>%2</b>.", [getUpgradeName("Thousand fingers"),5])+'<q>Turns out you <b>can</b> quite put your finger on it.</q>';
        Game.mouseCps = new Function('return ' + Game.mouseCps.toString().replace(
            `if (Game.Has('Octillion fingers')) add*=	20;`, 
            `if (Game.Has('Octillion fingers')) add*=	5;`)
        )();
        Game.Objects.Cursor.cps = new Function('return ' + Game.Objects.Cursor.cps.toString().replace(
            `if (Game.Has('Octillion fingers')) add*=	20;`, 
            `if (Game.Has('Octillion fingers')) add*=	5;`)
        )();

        Game.Upgrades['Nonillion fingers'].baseDesc = loc("Multiplies the gain from %1 by <b>%2</b>.", [getUpgradeName("Thousand fingers"),5])+'<q>Only for the freakiest handshakes.</q>';
        Game.mouseCps = new Function('return ' + Game.mouseCps.toString().replace(
            `if (Game.Has('Nonillion fingers')) add*=	20;`, 
            `if (Game.Has('Nonillion fingers')) add*=	5;`)
        )();
        Game.Objects.Cursor.cps = new Function('return ' + Game.Objects.Cursor.cps.toString().replace(
            `if (Game.Has('Nonillion fingers')) add*=	20;`, 
            `if (Game.Has('Nonillion fingers')) add*=	5;`)
        )();

        Game.Upgrades['Decillion fingers'].baseDesc = loc("Multiplies the gain from %1 by <b>%2</b>.", [getUpgradeName("Thousand fingers"),5])+'<q>If you still can\'t quite put your finger on it, you must not be trying very hard.</q>';
        Game.mouseCps = new Function('return ' + Game.mouseCps.toString().replace(
            `if (Game.Has('Decillion fingers')) add*=	20;`, 
            `if (Game.Has('Decillion fingers')) add*=	5;`)
        )();
        Game.Objects.Cursor.cps = new Function('return ' + Game.Objects.Cursor.cps.toString().replace(
            `if (Game.Has('Decillion fingers')) add*=	20;`, 
            `if (Game.Has('Decillion fingers')) add*=	5;`)
        )();

        Game.Upgrades['Undecillion fingers'].baseDesc = loc("Multiplies the gain from %1 by <b>%2</b>.", [getUpgradeName("Thousand fingers"),5])+'<q>Whatever you touch<br>turns to dough in your clutch.</q>';
        Game.mouseCps = new Function('return ' + Game.mouseCps.toString().replace(
            `if (Game.Has('Undecillion fingers')) add*=	20;`, 
            `if (Game.Has('Undecillion fingers')) add*=	5;`)
        )();
        Game.Objects.Cursor.cps = new Function('return ' + Game.Objects.Cursor.cps.toString().replace(
            `if (Game.Has('Undecillion fingers')) add*=	20;`, 
            `if (Game.Has('Undecillion fingers')) add*=	5;`)
        )();
        
        // Cursor upgrades cookies per click
        mod.cursorUpgradeCookiesPerClickFunc = function() {
            var cursorUpgrades = mod.cursorUpgrades;
            for (var i in cursorUpgrades) {
                if (Game.Has(i)) add*=cursorUpgrades[i].power;
            };
        };
        Game.mouseCps = new Function('return ' + Game.mouseCps.toString().replace(
            `if (Game.Has('Million fingers')) add*=		5;`, 
            `if (Game.Has('Million fingers')) add*=		5;(`+
            mod.cursorUpgradeCookiesPerClickFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();

        // Cursor upgrades cursor cps
        mod.cursorUpgradeCursorCpsFunc = function() {
            var cursorUpgrades = mod.cursorUpgrades;
            for (var i in cursorUpgrades) {
                if (Game.Has(i)) add*=cursorUpgrades[i].power;
            };
        };
        Game.Objects.Cursor.cps = new Function('return ' + Game.Objects.Cursor.cps.toString().replace(
            `if (Game.Has('Million fingers')) add*=		5;`, 
            `if (Game.Has('Million fingers')) add*=		5;(`+
            mod.cursorUpgradeCursorCpsFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();
        
        // Cursor upgrades unlock
        mod.cursorUpgradeUnlockFunc = function() {
            for (var i in mod.cursorUpgrades) {
                if (Game.Objects.Cursor.amount>=mod.cursorUpgrades[i].requirement) Game.Unlock(i);
            };
        };
        Game.Objects.Cursor.buyFunction = new Function('return ' + Game.Objects.Cursor.buyFunction.toString().replace(
            `if (this.amount>=550) Game.Unlock('Undecillion fingers');`, 
            `if (this.amount>=550) Game.Unlock('Undecillion fingers');(`+
            mod.cursorUpgradeUnlockFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();

        // Click upgrades cookies per click
        mod.clickUpgradeCookiesPerClickFunc = function() {
            for (var i in mod.clickUpgrades) {
                if (Game.Has(i)) add+=Game.cookiesPs*(mod.clickUpgrades[i].power/100);
            };
        };
        Game.mouseCps = new Function('return ' + Game.mouseCps.toString().replace(
            `if (Game.Has('Omniplast mouse')) add+=Game.cookiesPs*0.01;`, 
            `if (Game.Has('Omniplast mouse')) add+=Game.cookiesPs*0.01;(`+ 
            mod.clickUpgradeCookiesPerClickFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();

        // Click upgrades unlock
        mod.clickUpgradeUnlockFunc = function() {
            for (var i in mod.clickUpgrades) {
                if (Game.handmadeCookies>=mod.clickUpgrades[i].requirement) {Game.Unlock(i);}
            };
        };
        Game.Logic = new Function('return ' + Game.Logic.toString().replace(
            `if (Game.handmadeCookies>=1000) {Game.Win('Clicktastic');Game.Unlock('Plastic mouse');}`, 
            `if (Game.handmadeCookies>=1000) {Game.Win('Clicktastic');Game.Unlock('Plastic mouse');};(`+ 
            mod.clickUpgradeUnlockFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();

        // Kitten upgrades cps
        mod.kittenCpSFunc = function() {
            for (var i in mod.kittenUpgrades) {
                if (Game.Has(i)) catMult*=(1+Game.milkProgress*mod.kittenUpgrades[i].power*milkMult);
            };
        };
        Game.CalculateGains = new Function('return ' + Game.CalculateGains.toString().replace(
            `if (Game.Has('Fortune #103')) catMult*=(1+Game.milkProgress*0.05*milkMult);`, 
            `if (Game.Has('Fortune #103')) catMult*=(1+Game.milkProgress*0.05*milkMult);(`+ 
            mod.kittenCpSFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();

        // Kitten upgrade unlocks
        mod.kittenUnlockFunc = function() {
            for (var i in mod.kittenUpgrades) {
                if (Game.milkProgress>=mod.kittenUpgrades[i].requirement) Game.Unlock(i);
            };
        };
        Game.Logic = new Function('return ' + Game.Logic.toString().replace(
            `if (Game.milkProgress>=14) Game.Unlock('Kitten strategists');`, 
            `if (Game.milkProgress>=14) Game.Unlock('Kitten strategists');(`+ 
            mod.kittenUnlockFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();

        // Butter biscuits
        mod.butterBiscuitsUnlockFunc = function() {
            for (var i in mod.butterBiscuitUpgrades) {
                if (minAmount>=mod.butterBiscuitUpgrades[i].requirement) {Game.Unlock(i);}
            };
        };
        Game.Logic = new Function('return ' + Game.Logic.toString().replace(
            `if (minAmount>=700) {Game.Win('Septcentennial');Game.Unlock('Personal biscuit');}`, 
            `if (minAmount>=700) {Game.Win('Septcentennial');Game.Unlock('Personal biscuit');};(`+ 
            mod.butterBiscuitsUnlockFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();
        
        // Click achievements obtain
        mod.clickAchievFunc = function() {
            for (var i in mod.clickAchievements) {
                if (Game.handmadeCookies>=mod.clickAchievements[i].requirement) {Game.Win(i);}
            };
        };
        Game.Logic = new Function('return ' + Game.Logic.toString().replace(
            `if (Game.handmadeCookies>=1000) {Game.Win('Clicktastic');Game.Unlock('Plastic mouse');}`, 
            `if (Game.handmadeCookies>=1000) {Game.Win('Clicktastic');Game.Unlock('Plastic mouse');};(`+ 
            mod.clickAchievFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();

        // Cursor achievements obtain
        mod.cursorAchievFunc = function() {
            for (var i in mod.cursorAchievements) {
                if (Game.Objects.Cursor.amount>=mod.cursorAchievements[i].requirement) Game.Win(i);
            };
        };
        Game.Objects.Cursor.buyFunction = new Function('return ' + Game.Objects.Cursor.buyFunction.toString().replace(
            `if (this.amount>=550) Game.Unlock('Undecillion fingers');`, 
            `if (this.amount>=550) Game.Unlock('Undecillion fingers');(`+
            mod.cursorAchievFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();

        // Building levels
        for (var i in Game.Objects) {
            var building = Game.Objects[i];

            building.levelUp = new Function('me', 'return ' + building.levelUp.toString().replace(
                `if (me.level>=10 && me.levelAchiev10) Game.Win(me.levelAchiev10.name);`, 
                `if (me.level>=10 && me.levelAchiev10) Game.Win(me.levelAchiev10.name);`+
                `for (var i in `+mod.modString+`.levelAchievements) {
                    if (me.name == `+mod.modString+`.levelAchievements[i].building && me.level>=`+mod.modString+`.levelAchievements[i].requirement) Game.Win(i) ;
                };`)
            )(building);
        };

        // Total building achievements
        mod.totalBuildingsAchievFunc = function() {
            for (var i in mod.totalBuildingsAchievements) {
                if (buildingsOwned>=mod.totalBuildingsAchievements[i].requirement) {Game.Win(i);}
            };
        };
        Game.Logic = new Function('return ' + Game.Logic.toString().replace(
            `if (buildingsOwned>=10000) Game.Win('Myriad');`, 
            `if (buildingsOwned>=10000) Game.Win('Myriad');(`+ 
            mod.totalBuildingsAchievFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();

        // Total upgrades achievements
        mod.totalUpgradesAchievFunc = function() {
            for (var i in mod.totalUpgradesAchievements) {
                if (Game.UpgradesOwned>=mod.totalUpgradesAchievements[i].requirement) {Game.Win(i);}
            };
        };
        Game.Logic = new Function('return ' + Game.Logic.toString().replace(
            `if (Game.UpgradesOwned>=700) Game.Win('Oft we mar what\'s well');`, 
            `if (Game.UpgradesOwned>=700) Game.Win('Oft we mar what\'s well');(`+ 
            mod.totalUpgradesAchievFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();

        // Total heavenly upgrades achievements
        mod.totalHeavenlyUpgradesAchievFunc = function() {
            for (var i in mod.totalHeavenlyUpgradesAchievements) {
                if (prestigeUpgradesOwned>=mod.totalHeavenlyUpgradesAchievements[i].requirement) {Game.Win(i);}
            };
        };
        Game.Reincarnate = new Function('return ' + Game.Reincarnate.toString().replace(
            `if (prestigeUpgradesOwned>=100) Game.Win('All the stars in heaven');`, 
            `if (prestigeUpgradesOwned>=100) Game.Win('All the stars in heaven');(`+ 
            mod.totalHeavenlyUpgradesAchievFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();

        // # of each building achievements
        mod.eachBuildingsAchievFunc = function() {
            for (var i in mod.eachBuildingsAchievements) {
                if (minAmount>=mod.eachBuildingsAchievements[i].requirement) {Game.Win(i);}
            };
        };
        Game.Logic = new Function('return ' + Game.Logic.toString().replace(
            `if (minAmount>=700) {Game.Win('Septcentennial');Game.Unlock('Personal biscuit');}`, 
            `if (minAmount>=700) {Game.Win('Septcentennial');Game.Unlock('Personal biscuit');};(`+ 
            mod.eachBuildingsAchievFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();

        // Ascending with cookies baked achievements
        mod.ascendedCookiesAchievFunc = function() {
            for (var i in mod.ascendedCookiesAchievements) {
                if (cookiesForfeited>=mod.ascendedCookiesAchievements[i].requirement) {Game.Win(i);}
            };
        };
        Game.Reset = new Function('return ' + Game.Reset.toString().replace(
            `if (cookiesForfeited>=1000000000000000) Game.Win('Nihilism');`, 
            `if (cookiesForfeited>=1000000000000000) Game.Win('Nihilism');(`+ 
            mod.ascendedCookiesAchievFunc.toString().replaceAll('mod', mod.modString) + ')();')
        )();

        // Change a weird condition in Game.crate
        Game.crate = new Function('return ' + Game.crate.toString().replace(
            `if (!enabled) clickStr='Game.AchievementsById['+me.id+'].click();';`, 
            `if (context=='stats') clickStr='Game.AchievementsById['+me.id+'].click();';`)
        )();

        // Add functionality for functions on upgrade in stats click
        Game.crate = new Function('return ' + Game.crate.toString().replace(
            `if (me.pool=='prestige') classes+=' heavenly';`, 
            `if (me.pool=='prestige') classes+=' heavenly';`+
            `if (context=='stats' && Game.UpgradesById[me.id] && Game.UpgradesById[me.id].statsClick) clickStr='Game.UpgradesById['+me.id+'].statsClick();';`)
        )();

        // Fix some devil spaghetti code that literally just causes a bug and nothing else
        // For some god forsaken reason, modded icons appear on ghost HU's and vanilla ones don't
        // I'm like 90% sure that writeIcon function is useless and I don't know what it does or why it's there other than cause that bug
        Game.BuildAscendTree = new Function('return ' + Game.BuildAscendTree.toString().replace(
            `str+='<div class="crate upgrade heavenly ghosted" id="heavenlyUpgrade'+me.id+'" style="position:absolute;left:'+me.posX+'px;top:'+me.posY+'px;'+writeIcon(me.icon)+'"></div>';`, 
            `str+='<div class="crate upgrade heavenly ghosted" id="heavenlyUpgrade'+me.id+'" style="position:absolute;left:'+me.posX+'px;top:'+me.posY+'px;"></div>';`)
        )();

        // Fix milk icons in the stats menu not working with modded icons
        Game.UpdateMenu = new Function('return ' + Game.UpdateMenu.toString().replace(
            `,'top')+' style="background:url('+Game.resPath+'img/icons.png?v='+Game.version+') '+(-milk.icon[0]*48)+'px '+(-milk.icon[1]*48)+'px;margin:2px 0px;" class="trophy"></div>';`,
            `,'top')+' style="background:url('+Game.resPath+'img/icons.png?v='+Game.version+') '+(-milk.icon[0]*48)+'px '+(-milk.icon[1]*48)+'px;margin:2px 0px;'+writeIcon(milk.icon)+';" class="trophy"></div>';`)
        )();
        
        // Wrap vanilla functions
        mod.oldGetIcon = Game.GetIcon;
        Game.GetIcon = function(type, tier) {
            if (Game.Tiers[tier].isMnt) {
                var col=0;
			    if (type=='Kitten') col=18; else col=Game.Objects[type].iconColumn;
                if (mod.columnReroute[col]) col = mod.columnReroute[col];
			    return [col, Game.Tiers[tier].iconRow, mod.imagePrefix + '/icons.png'];
            } else {
                return mod.oldGetIcon(type, tier);
            };
        };

        var order = 0;
        mod.oldAchievement = Game.Achievement;
        Game.Achievement = function(name,desc,icon) {
            var newAchiev = new mod.oldAchievement(name,desc,icon);
            if (order) newAchiev.order=order+newAchiev.id*0.001;
            return newAchiev;
        };

        mod.oldUpgrade = Game.Upgrade;
        Game.Upgrade = function(name,desc,price,icon,buyFunction) {
            var newUpgrade = new mod.oldUpgrade(name,desc,price,icon,buyFunction);
            if (order) newUpgrade.order=order+newUpgrade.id*0.001;
            return newUpgrade;
        };

        // Make new tiers
        Game.Tiers['mnt16'] = {isMnt:1,name:'Deeplucky',unlock:650,achievUnlock:750,iconRow:0,color:'#00599E',price:		500000000000000000000000000000000000000000000}; // *1000 compared to glimmeringue
        Game.Tiers['mnt17'] = {isMnt:1,name:'Gumflower',unlock:700,achievUnlock:800,iconRow:1,color:'#D4C1BC',price:		5000000000000000000000000000000000000000000000000};
        Game.Tiers['mnt18'] = {isMnt:1,name:'Flossiloss',unlock:750,achievUnlock:850,iconRow:2,color:'#DC4162',price:		50000000000000000000000000000000000000000000000000000};
        Game.Tiers['mnt19'] = {isMnt:1,name:'Glowcorn',unlock:800,achievUnlock:900,iconRow:3,color:'#F01700',price:		500000000000000000000000000000000000000000000000000000000};
        Game.Tiers['mnt20'] = {isMnt:1,name:'Mousstarch',unlock:850,achievUnlock:950,iconRow:4,color:'#955E39',price:		5000000000000000000000000000000000000000000000000000000000000};
        Game.Tiers['mnt21'] = {isMnt:1,name:'Sparklepop',unlock:900,achievUnlock:1000,iconRow:5,color:'#7E7AB9',price:	    50000000000000000000000000000000000000000000000000000000000000000};
        Game.Tiers['mnt22'] = {isMnt:1,name:'Saccharish',unlock:950,achievUnlock:1050,iconRow:6,color:'#E0E0E0',price:		500000000000000000000000000000000000000000000000000000000000000000000};
        Game.Tiers['mnt23'] = {isMnt:1,name:'Boondough',unlock:1000,achievUnlock:1100,iconRow:7,color:'#C39338',price:		5000000000000000000000000000000000000000000000000000000000000000000000000};
        Game.Tiers['mnt24'] = {isMnt:1,name:'Milkbom',unlock:1050,achievUnlock:1150,iconRow:8,color:'#FAEDB9',price:		50000000000000000000000000000000000000000000000000000000000000000000000000000};
        Game.Tiers['mnt25'] = {isMnt:1,name:'Nougative',unlock:1100,achievUnlock:1200,iconRow:9,color:'#3A812B',price:		500000000000000000000000000000000000000000000000000000000000000000000000000000000};
        Game.Tiers['mnt26'] = {isMnt:1,name:'Bourboron',unlock:1150,achievUnlock:1250,iconRow:10,color:'#CA130A',price:	5000000000000000000000000000000000000000000000000000000000000000000000000000000000000};
        Game.Tiers['mnt27'] = {isMnt:1,name:'Petricolate',unlock:1200,achievUnlock:1300,iconRow:11,color:'#9AB834',price:	50000000000000000000000000000000000000000000000000000000000000000000000000000000000000000};
        Game.Tiers['mnt28'] = {isMnt:1,name:'Mudgnette',unlock:1250,achievUnlock:1350,iconRow:12,color:'#7E5A40',price:	500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000};
        Game.Tiers['mnt29'] = {isMnt:1,name:'Glazelcy',unlock:1300,achievUnlock:1400,iconRow:13,color:'#A000D5',price:		5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000};
        
        // New upgrades
        var startOfModNum = Game.UpgradesN;

        mod.newUnshackleUpgradeTier({tier:'mnt16',q:'A thick material found in gooey reseviors in the furthest reachest of space, deeplucky\'s first encounter with mankind was during a perilous cosmic voyage gone wrong. A fuel capsule had burst and as the astronauts were drifting through space, deeplucky provided a gooey, sweet and sticky source of food, enough so that the astronauts managed to make it back home with some to spare. This miracle gave the "lucky" part of the name.'});
        mod.newUnshackleUpgradeTier({tier:'mnt17',q:'Gumflower is the sap secreted by giant eucalyptus trees when planted in denser atmospheres than our own. Determined to survive, they ramp up sucrose production and undergo many molecular changes, giving the sap a very herbal taste. For early close-solar settlers, smearing gumflower on oneself was a common way to prevent sunburns.'});
        mod.newUnshackleUpgradeTier({tier:'mnt18',q:'Flossiloss is the result of spinning gumflower a bit too fast - incorporating so much air that it takes on a similar texture to fairy floss. Trying to grab it is like trying to grab onto a whispy cloud.'});
        mod.newUnshackleUpgradeTier({tier:'mnt19',q:'A close neighbour of diamonds, glowcorn is an incredibly smooth and glassy material that often finds use in elaborate mirror displays and grand ball rooms. Try not too stare too closely though, as it perturbs strange visions back to the surface.'});
        mod.newUnshackleUpgradeTier({tier:'mnt20',q:'Mousstarch is the densest fudge known to man. Every drop of it is full of incredibly gooey cocoa delight, with a slight gelatinous aftertaste that keeps the mouth salviating for hours afterwards.'});
        mod.newUnshackleUpgradeTier({tier:'mnt21',q:'For all the brightest and most iridescent stars, during their beautiful collapse, sparklepop will form. This highly chromatic and tingly substance sparkles beyond any comparison. Once digested, it pops around in the stomach acid, even jolting people around by their belly in certain doses.'});
        mod.newUnshackleUpgradeTier({tier:'mnt22',q:'An incredibly crumbly and fine powder, even when packed down and compressed, saccharish displays many properties similar to crystallized snow. Some boreal forests on foreign planets are often covered in this stuff, creating the most austere and breathtaking views in the harshest climates. Scientists postulate that it\'s a close relative of sugar lumps as it tends to stiffen up in prescense of those who are highly successful.'});
        mod.newUnshackleUpgradeTier({tier:'mnt23',q:'Boondough is the pure essence of a cookie distilled into a flavourful form. Soft and pillowy, it has a surprising yeasty kick after a few seconds of chewing. When it\'s not being eaten, it makes for comfortable rugs and curtains, as well as insulation in heavy-duty freezers.'});
        mod.newUnshackleUpgradeTier({tier:'mnt24',q:'Combine boondough with some celestial milk and you get milkbom - an incredibly snappy and delicious variant of white chocolate. Rivers of strawberry run through it, emblematic of its cosmic origins, creating a gorgeous marbled texture that some use as a base for statues.'});
        mod.newUnshackleUpgradeTier({tier:'mnt25',q:'Nougative is an artificial substance that tastes and reeks of rotten eggs. This can be abused for good though: By tasting nougative, whatever someone eats or experiences next will be percieved as much better than it actually is.'});
        mod.newUnshackleUpgradeTier({tier:'mnt26',q:'Bourboron is highly electro-sensitive, placing a toaster near a block of it enacts a circuit within the hexagonal alloy layers. Recent developments have used it as fuel once heated, both for lightbulbs and shockingly volatile aircraft engines.'});
        mod.newUnshackleUpgradeTier({tier:'mnt27',q:'On a rainy day, rogue patches of moss feeding off of a slow drip of cocoa and snake venom may grow into petricolate. Incredibly poisonous, the only way to safely eat it is by gently placing one\'s hand on it, the molecules will perforate you skin and after an hour or so, make it to your tongue.'});
        mod.newUnshackleUpgradeTier({tier:'mnt28',q:'A liquid at room temperature, yet quite temperature retentive, freezing mudgnette quickly became a fast and popular plastic replacement method upon it\'s discovery. Simply pour some into a mold, leave it in a freezer, and hey presto! Lightweight containers to your heart\'s content. It was quickly recalled after it was discovered leaving needles inside capillaries.'});
        mod.newUnshackleUpgradeTier({tier:'mnt29',q:'Ludicrously expensive to make and incredibly difficult to maintain the consistency of, glazelcy is only for the richest of the rich - the superiors of the superiors. Without the sweetened caramel glaze overtop, it would quickly combust and throw itself across everything in sight. Consuming it requires eating the entire delectable confectionary in one fell bite.'});

        // It seems that these upgrades effectively become *CursorCps at a certain building level, so reigning them in is needed to stop cursors from being too powerful
        // + Mines being the most powerful building is a nice change of pace
        order=100;
        mod.cursorUpgrade('Duodecillion fingers','<q>Great for pointing out mistakes in the baking line.</q>','mnt16', 5);
        mod.cursorUpgrade('Tredecillion fingers','<q>Which hand was your watch on again?</q>','mnt17', 5);
        mod.cursorUpgrade('Quattuordecillion fingers','<q>More room for more sick looking rings.</q>','mnt18', 5);
        mod.cursorUpgrade('Quindecillion fingers','<q>Now you can scratch your back while you pour your coffee and read the paper!</q>','mnt19', 5);
        mod.cursorUpgrade('Sexdecillion fingers','<q>Pull my finger.</q>','mnt20', 2);
        mod.cursorUpgrade('Septendecillion fingers','<q>You may need to hire someone just to cut all your nails in a timely manner.</q>','mnt21', 2);
        mod.cursorUpgrade('Octodecillion fingers','<q>Are you still there inside all those arms?</q>','mnt22', 2);
        mod.cursorUpgrade('Novemdecillion fingers','<q>It\'s faster to just walk on your hands than your feet - moving around in a giant ball of palms.</q>','mnt23', 2);
        mod.cursorUpgrade('Vigintillion fingers','<q>How high can these fingers count?</q>','mnt24', 2);
        mod.cursorUpgrade('Unvigintillion fingers','<q>Become an arm wrestle champion!</q>','mnt25', 2);
        mod.cursorUpgrade('Duovigintillion fingers','<q>Catch anything thrown your way!</q>','mnt26', 2);
        mod.cursorUpgrade('Trevigintillion fingers','<q>Only for the most efficient nose-picking techniques.<br>Just wash your hands afterwards.</q>','mnt27', 2);
        mod.cursorUpgrade('Quattuorvigintillion fingers','<q>Painting your nails takes up about 11 buckets of paint.</q>','mnt28', 2);
        mod.cursorUpgrade('Quinvigintillion fingers','<q>And don\'t even think about using gloss on them either!</q>','mnt29', 2);

        order=150;
        mod.clickUpgrade('Imaginarium mouse','<q>This mouse is so sensitive to the electromagnetic waves around it, that simply thinking of clicking it causes it to click.</q>','mnt16');
        mod.clickUpgrade('Cosmickel mouse','<q>Entire universes have come together to make a mouse on an intergalactic scale. Stars and space dust making up the internal circuits and shell, with a solar system in the middle for a mouse wheel. Clicks coming from this mouse ripple across the space time continuum, clicking cookies everywhere that have and will exist.</q>','mnt17');
        mod.clickUpgrade('Springanyl mouse','<q>One click and it starts bouncing off the walls and ceiling, clicking even faster and faster until it breaks through a load-bearing wall.</q>','mnt18');
        mod.clickUpgrade('Pure mouse','<q>100% mouse and 0% anything else baby. Nothing in the way to impede it\'s immense clicking capabilities.</q>','mnt19');
        mod.clickUpgrade('Explicadite mouse','<q>Made up of a material only found in extremely violent atomic fission events. A cat prancing about from over a lightyear away can cause it to violently ring back and forth, sending a cascade of clicks your way.</q>','mnt20');
        mod.clickUpgrade('Gamer mouse','<q>Featuring fancy rainbow lighting.</q>','mnt21');
        mod.clickUpgrade('Atomimantulate mouse','<q>Even trying to gently place you finger on this mouse causes atoms to break apart, this causes a chain reaction where stray electrons click the mouse, further splitting more atoms again and again in a never-ending chain reaction of clicks.</q>','mnt22');
        mod.clickUpgrade('Infinity mouse','<q>One click is rumoured to click half the cookies in the universe. This immense power is gated behind 6 jewels guarded by supreme entities throughout the galaxy, thankfully you found the box in storage where you had been keeping them from a cosmic expansion a few years back.</q>','mnt23');
        mod.clickUpgrade('Amalgamantium mouse','<q>What a freakish sight! Someone has taken some other poor mice and smashed them into one! Although the sight does make you slightly queasy, it still retains all the properties of those mice, letting you take the best mice you\'ve obtained so far, and click them all at a single press of a button.</q>','mnt24');
        mod.clickUpgrade('Biological mouse','<q>What is slightly confusing computer paraphenalia at first, soon reveals itself to be a marvel at clicking. The cellular and electrochemical structure of a living being is able to perform clicks at speeds that other manufactured methods cannot comprehend.</q>','mnt25');
        mod.clickUpgrade('Trackball mouse','<q>A relic of the past that uses a physical ball that must be rolled around to change your cursor\'s position. While it may be an antique, it has 0 delay between pressing the mouse button down and a response on the monitor, greatly enhancing your clicking abilities!</q>','mnt26');
        mod.clickUpgrade('Replicanon mouse','<q>This mouse is only a few atoms thick, but it replicates itself across anything it comes across when clicked. After a few gentle brushes it had spread around the lab and began stretching through the surrounding gardens of your research complex, at which point it was being clicked unassumedly by people just going about their day at an ever accelerating pace. Within a week, your scientists estimated it had plagued 60% of the universe and had covered every living organism to exist. Slight existential, contaminental dread aside, this self-replicating behaviour allows it to be clicked by things that weren\'t even intending to click it!</q>','mnt27');
        mod.clickUpgrade('Metaminium mouse','<q>Made of a material that transcends the game itself.<br>Clicking this upgrade in the stats menu will click the cookie!</q>','mnt28');
        Game.last.statsClick = function() {
            Game.ClickCookie();
            Game.BigCookieState = 1;
            setTimeout(function(){Game.BigCookieState = 0;},50);
        };
        mod.clickUpgrade('Ergonomic mouse','<q>Sometimes improving your clicks isn\'t about the fanciest hardware or science-defying material it\'s made of. Sometimes all you need is a mouse that fits your hand just right. This one has been made from a cast of your hand to maximise comfortableness, just resting your hand on it you can\'t even tell it\'s there!</q>','mnt29');

        order=20000;
        mod.kittenUpgrade('Kitten supervisors','<q>everything will go purrfectly, sir.</q>','mnt16');
        mod.kittenUpgrade('Kitten amanuenses','<q>I\'ll send that letter meow, sir.</q>','mnt17');
        mod.kittenUpgrade('Kitten secretaries','<q>is that everything, sir?</q>','mnt18');
        mod.kittenUpgrade('Kitten surveyors','<q>we can build right meow, sir.</q>','mnt19');
        mod.kittenUpgrade('Kitten publicists','<q>the meowd will love you, sir.</q>','mnt20');
        mod.kittenUpgrade('Kitten archivists','<q>everything is backed up, sir.</q>','mnt21');
        mod.kittenUpgrade('Kitten lawyers','<q>your record will be clean, sir.</q>','mnt22');
        mod.kittenUpgrade('Kitten editors','<q>your mistakes are happy accidents, sir.</q>','mnt23');
        mod.kittenUpgrade('Kitten chauffeurs','<q>we can go anywhere, sir.</q>','mnt24');
        mod.kittenUpgrade('Kitten kitten caretakers','<q>they will get their favourite brush, sir.</q>','mnt25');
        mod.kittenUpgrade('Kitten masseuses','<q>meow does this feel, sir.</q>','mnt26');
        mod.kittenUpgrade('Kitten receptionists','<q>who wouldn\'t want to work with you, sir.</q>','mnt27');
        mod.kittenUpgrade('Kitten officers','<q>order will be maintained, sir.</q>','mnt28');
        mod.kittenUpgrade('Kitten therapists','<q>and how does that make you feel, sir.</q>','mnt29');

        order=10300;
        mod.butterBiscuitUpgrade('Cast dough butter biscuit', 'Rewarded for owning 750 of everything.<br>This biscuit\'s dough was poured into a mold of your own face, you don\'t ever remember ever getting a mold of your face made, but that\'s the magic of your bakers at work. Every detail down the pores of your skin is baked into this biscuit, making it a rather difficult eat. Instead, you\'ll put on display with the rest of your biscuits.', 14);
        mod.butterBiscuitUpgrade('Imaginarical chocolate butter biscuit', 'Rewarded for owning 800 of everything.<br>This biscuit looks like any other plain milk chocolate butter biscuit, but through imbued magic, it boosts the meditative state of mind for those around it. By just thinking about it, you can imagine how your own face looks at this current moment with stunning clarity. It\'s a rather freaky sight, as it makes you realise how other people have seen you this entire time.', 15);
        mod.butterBiscuitUpgrade('Mimic chocolate butter biscuit', 'Rewarded for owning 850 of everything.<br>This biscuit\'s chocolate is actually a living organism which has evolved to mimic the appearance of anything that looks at it. Staring at it, the chocolate gradually matches up with your face, contorting its muscles into an eventually highly refined self-portrait of yourself.', 16);
        mod.butterBiscuitUpgrade('Crude chocolate butter biscuit', 'Rewarded for owning 900 of everything.<br>It appears the chocolate icing of this butter biscuit has been piped in an amatuer render of your face.', 17);
        mod.butterBiscuitUpgrade('3D butter biscuit', 'Rewarded for owning 950 of everything.<br>Through highly advanced baking techniques, this biscuit has risen far into the 3rd axis. By staring at it from a certain angle, your perspective lines up with what appears to be a silhoette of your face.', 18);
        mod.butterBiscuitUpgrade('Solid gold chocolate butter biscuit', 'Rewarded for owning 1,000 of everything.<br>A fitting reward for such a high accomplishment, the chocolate on this butter biscuit is made of entirely out of gold. It weighs a ton and we wouldn\'t recommend trying to bite into it. Within the luminous reflections however, the outline of your face can be seen shining through.', 19);
        mod.butterBiscuitUpgrade('Quantum butter biscuit', 'Rewarded for owning 1,050 of everything.<br>This biscuit is an ever-changing transient state, morphing between all other owned butter biscuits on a quantum scale. It never fully takes on the form of any other butter biscuit, but by squinting your eyes a bit, a collage of your face can be seen.', 20);
        mod.butterBiscuitUpgrade('Surveillance chocolate butter biscuit', 'Rewarded for owning 1,100 of everything.<br>The chocolate of this biscuit has been programmed to display a live, 24 hour camera feed. For this particular biscuit, the camera feed is constantly focused on your face. No matter where you go or how hard you try to hide, there always seems to be a camera that you can\'t see which perfectly captures your image and displays it on the screen for the world to view.', 21);
        mod.butterBiscuitUpgrade('Companion biscuit', 'Rewarded for owning 1,150 of everything.<br>This biscuit, instead of the usual rectangle chocolate icing, has a small strawberry chocolate heart piped on it\'s front side. Despite your scientists assurances, you swear that you hear the biscuit talking to you, whispering instructions. For the past week everything you\'ve done has been at the companion biscuit\'s request. You won\'t let anyone near it or inspect it, it\'s yours to take care of. Looking down at the personal biscuit you feel your heart swell, and begin to hallucinate it transforming into a figure of your child self.', 22);
        mod.butterBiscuitUpgrade('Atomically engraved butter biscuit', 'Rewarded for owning 1,200 of everything.<br>While on the surface this butter biscuit looks like any other, through a supplied microscope you can see that the very atoms that make it up are in your image. For the safety of the universe, it\'s been encased in a glass box where you may stare at it from a distance.', 23);
        mod.butterBiscuitUpgrade('[Your favourite chocolate here] chocolate butter biscuit', 'Rewarded for owning 1,250 of everything.<br>With new AI prediction technology, this chocolate is able to predict with 100% accuracy, the favourite chocolate of whoever is to eat it. As you discover and invent new flavours of cookies, and discovering more of life, your favourite is always changing. So now you have a biscuit which no matter what, will always taste delicious! As a mark of this highly personalized delight, an engraving of yourself has been made in the chocolate.', 24);
        mod.butterBiscuitUpgrade('Degloved biscuit', 'Rewarded for owning 1,300 of everything.<br>Oh fiddlesticks! Someone went and tore off your face during your sleep and stuck it on this biscuit. Luckily you have plenty of clones in storage for a replacement face, so by the next morning you look basically the same. Your old face though, still holds some sentimental value, and you decide to keep this biscuit around. Not only as a record of your accomplishments, but to forever mark the face of your yesterday self.', 25);
        mod.butterBiscuitUpgrade('Oily chocolate biscuit', 'Rewarded for owning 1,350 of everything.<br>The chocolate coating this biscuit is incredibly oily, and takes on almost a painterly appearance. From the strokes of icing, a gorgeous portrait of your face can be made out. Strangely, after recieving this biscuit your own face stopped showing any signs of decay or aging. But when you would sign a contract, finish plundering an inhabited planet, or gorged yourself in the many luxeries of life you\'ve come to afford, the once beautiful portrait of yourself within the icing of this biscuit began to deform and mutate. After about a month, it took on the most hideous appearance; horrible and distained; a visual collection of every sin you\'ve committed.', 26);
        mod.butterBiscuitUpgrade('Chocolateless butterless biscuit', 'Rewarded for owning 1,400 of everything<br>This biscuit doesn\'t have anything special about it. It doesn\'t even have any butter infused with it! Staring at the sad sight of what would\'ve been a grand reward for your accomplishments, you decide to tinker with it a bit. Perhaps you could make your own biscuit that reflects your achievements in your own way? It\'s been a while since you\'ve done anything hands on and made your own biscuit. How about for this one you make it look like yourself?', 27);

        order=200;Game.TieredUpgrade('Extended memory','<q>Extends the memory capacity of very old grandmas, so they can still remember how to make a cookie.</q>','Grandma','mnt16');
		order=300;Game.TieredUpgrade('Greenhouse planets','<q>You\'ve had an issue with your factories constantly expending planets by greatly increasing the amount of greenhouse gas within the atmosphere, causing your workforce to burn up and miss their quotas. But it suddenly hits you that you could use those greenhouse gasses to make planet-sized greenhouses! Ignoring your climatists concerns that "That isn\'t how greenhouse gasses work", you use that useless real estate to host planet-sized greenhouses perfect for your cookie farming needs!</q>','Farm','mnt16');
		order=400;Game.TieredUpgrade('Heat protective suits','<q>Wearing these suits allow your workers to comfortably delve into molten rock and dig up whatever they can find there. Most cookies they\'ll find will be burnt but just below that is a layer of perfectly crispy cookies that go very nicely with a glass of milk.</q>','Mine','mnt16');
		order=500;Game.TieredUpgrade('Automatic factories','<q>Building an entirely new factory takes too much time, this factory automates the process so you don\'t have to lift a finger.</q>','Factory','mnt16');
		order=525;Game.TieredUpgrade('Minted icing','<q>Some guy in a grey shirt was trying to explain this one to you. Apparently minting your icing means it becomes a unique, verified item that is stored in a golden cookie chain or something? And that somehow has monetary value despite being easily bakeable by any other baker? You aren\'t really sure how that holds up or if it\'s too antiquated to intergrate into your company financing but if it makes more cookies it\'s probably worth it.</q>','Bank','mnt16');
		order=550;Game.TieredUpgrade('Cookie commandments','<q>A set of commandments that all followers of the cookie god must follow to attain cookiehood.</q>','Temple','mnt16');
		order=575;Game.TieredUpgrade('Murmered casting','<q>In the halls and libraries of your wizard towers, wizards shout their incantations with unrivaled fevor, unfortunately they\'ve been getting too excited about the whole process, and now casters are needing to shout louder and louder for the magic realm to hear their calls. But via sensitive training and a lump sum of 12 million toad tongues to the magic realm, wizards can now just quitely whisper their wishes into reality. Also makes it far less embaressing when one of them needs to cry "Exblim! Eniliatrio! Confuscia!" to clean up cat droppings.</q>','Wizard tower','mnt16');
		order=600;Game.TieredUpgrade('Tracking parcels','<q>Now your clients can see their order approaching via a corporate memphis style map of the universe. With a small red dot showing the location of their shipment, they will habitually check the map every 5 seconds only to see that nothing has changed.</q>','Shipment','mnt16');
		order=700;Game.TieredUpgrade('Concoctions to serve competing enterprises at business parties','<q>Eye of newt, and toe of frog,<br>Wool of bat, and tongue of dog,<br>Adder\'s fork, and blind-worm\'s sting,<br>Lizard\'s leg, and owlet\'s wing,-<br>For a charm of powerful trouble,<br>Like a hell-broth boil and bubble.<br>Double, double toil and trouble;<br>Fire burn, and caldron bubble.</q>','Alchemy lab','mnt16');
        order=800;Game.TieredUpgrade('A way out of home','<q>The nostalgic and melancholic rush of seeing your old kitchen from the last upgrade was quickly washed away when you realized you hadn\'t brought a portal to return back into your office. No matter, by breaking apart your phone and hotwiring a sample cookie you still had in your pocket, it melts just enough to react with the carpet and break down the micro-molecular bonds holding the sample together. A quick splash of water and kaploosh! The contralions turn into finotinium and form a portal taking you back from back home. Despite the mess, you take this sacrifice as another step forward in your cookie baking journey, forever changed by the visit to a known world.</q>','Portal','mnt16');
        order=900;Game.TieredUpgrade('Time zones','<q>It turns out all this time, every other time has been using a slightly different time as than your time, causing shipments to crash into eachother, meetings with prehistoric and posthistoric business partners to be missed, and cookies to turn slightly soggy when time travelling. By standardizing time zones across all times, it\'s a simple look at a miles long spreadsheet to figure out what time it is at any other time!</q>','Time machine','mnt16');
        order=1000;Game.TieredUpgrade('Plum pudding model','<q>A once defunct model of the atom that fits very nicely into this new pastry-based universe you\'ve created.</q>','Antimatter condenser','mnt16');
        order=1100;Game.TieredUpgrade('Light headed','<q>If you stop thinking about cookies for too long, it starts to dawn on you just how far you\'ve gone and conquered in the name of making cookies of all things. Entire universes enslaved, planets merely picked up and dropped once their resources are plundered, billions praying to your product as a source of peace, an army of someone\'s grandmother stuck baking in factories that burn up more energy than a sun in it\'s entire lifetime per week, god what were you thinking? You feel like you\'re about to faint, the arms of your operation stretch too far and wide, there is more to life than cookies and deep down inside you know it, and now look at what you\'ve done! Thankfully this momentary lapse of unconsciousness can be avoided by grabbing the blueprints of your next domain expansion. But while you\'re having some sense of morality and awareness, why not use that feeling to create more cookies! Transform your light head into cookies by shoving it in a prism irregardless of your denotative confusion.</q>','Prism','mnt16');
        order=1200;Game.TieredUpgrade('Casino atmosphere','<q>What is it to gamble without the proper atmopshere? Enjoy the husky smell of cigarettes and drinks. Worn down waitresses serving the clientele after their failed attempt to make it big in the city. With the assortment of glum characters sending away their savings for another go for gold as an occupied pram sits behind them, gently rocked by an unwashed child desperately looking towards their hunched over care-taker. Gosh what an exhilerating experience it is.</q>','Chancemaker','mnt16');
        order=1300;Game.TieredUpgrade('Gabriel\'s mixer','<q>Gabriel from your fractal engine department brought this in with a mischevious grin on his face. It\'s a commoner\'s automated mixing machine, yet the bowl has an infinite surface area, but when you pour some flour in, it only takes in a bit more than 3 litres before getting full! The strange properties of it cause you to implement it in your cookie baking to further improve production.</q>','Fractal engine','mnt16');
        order=1400;Game.TieredUpgrade('Game.TieredUpgrade','<q>With order scoping issues, no camel case and ugly to read code, it\'s Game.TieredUpgrade!</q>','Javascript console','mnt16');
        order=1500;Game.TieredUpgrade('Do something else','<q>Big idle doesn\'t want you to know about this one, but thanks to this new invention, you can simply do something else while you wait! Then when you finish whatever you were doing, progress will be made on whatever you were waiting on!</q>','Idleverse','mnt16');
        order=1600;Game.TieredUpgrade('Smart nuerons','<q>The nuerons in your cortex bakers are now large enough that they can house their own smaller brain inside, allowing them to make smarter pathfinding decisions using the A* algorithm.</q>','Cortex baker','mnt16');
        order=1700;Game.TieredUpgrade('Personalized secretaries','<q>Tired of having to tell your many non-clone secretaries just how you like things, you fired them all and replaced them with clones of yourself. Now you get just what you want because you picked it out yourself!</q>','You','mnt16');

        order=200;Game.TieredUpgrade('Wheelchair pins','<q>For some of your grandmas, life has not been so kind them. They\'re stuck in wheelchairs, doomed to never be able to bake cookies for you. Fortunately, they can now be put to work using a new wheelchair which also serves as a rolling pin!</q>','Grandma','mnt17');
		order=300;Game.TieredUpgrade('Experimental off-shoots','<q>Maim mother nature\'s creations and force them to grow cookies. She left awhile back at the sheer disgust of what you were doing, so it\'s not like you\'ll get in trouble for doing so anyway.</q>','Farm','mnt17');
		order=400;Game.TieredUpgrade('Product recovery rags','<q>Spending 8 straight days down in a chocolate mine get\'s you quite covered in chocolate dust, not to mention the lung issues it causes. But thanks to these rags we can rub that chocolate off and squeeze it back into the delivery trucks, not letting any chocolate go to waste.</q>','Mine','mnt17');
		order=500;Game.TieredUpgrade('Gear dental plan','<q>All those teeth get worn down over time, this lets them get yearly checkups by a qualified odontologist. Human teeth and gear teeth are shockingly alike.</q>','Factory','mnt17');
		order=525;Game.TieredUpgrade('Money guns','<q>They\'re fun for about 5 seconds before they run out of money.</q>','Bank','mnt17');
		order=550;Game.TieredUpgrade('Giant cookie boulder','<q>A necessary item in every labrynthian temple. Explorers foolish enough to grab the doughy idol will be forced to run away from this through a carefull designed tunnel that never really puts them in any danger but does make them look very cool to anyone watching. It\'s overall a terrible security feature.</q>','Temple','mnt17');
		order=575;Game.TieredUpgrade('Magicians routine', '<q>Some of your wizards have entered the entertainment industry, and are now using their spells to cut a rabbit in half and pull endless amounts of ribbon out of it\'s bloody interior.</q>','Wizard tower','mnt17');
		order=600;Game.TieredUpgrade('Official flag','<q>Congratulations! Some vexillology nerds came along, and have designed your very own flag which you happily took without paying them. Now you can plant this far and wide where it will gradually lose colour due to the lack of atmosphere on most planets.</q>','Shipment','mnt17');
		order=700;Game.TieredUpgrade('99.1% purity','<q>Through rigourous testing, extensive laboratory cleaning, careful measuring, and shaving all your alchemists\' heads, you\'ve managed to make a cookie that is 99.1% pure! This does come at the cost of a slight blue tint but it\'s just as delicious as before.</q>','Alchemy lab','mnt17');
        order=800;Game.TieredUpgrade('Blood oath','<q>You may or may not be part of some underworld cult now but at least they give cookies as a member\'s benefit.</q>','Portal','mnt17');
        order=900;Game.TieredUpgrade('A little longer','<q>Sometimes you\'ll catch yourself in a moment of peace and content, be it remembering the fond days of your early baking empire, staring out the window during a beautiful sunset, or glancing upwards at the stars at night, sinking your feet into the cold, moist grass as the moon and stars softly illuminate the stratocumulus clouds above, the wind\'s chill embrace creating the soft sound of trees dancing in the breeze. You wish you could make these moments last, just a little bit longer, that\'s all you need.</q>','Time machine','mnt17');
        order=1000;Game.TieredUpgrade('Quantum relativity','<q>At long last, quantum mechanics and general relativity, united in one, ugly, convoluted, completely clumsy way. We were better off before this happened.</q>','Antimatter condenser','mnt17');
        order=1100;Game.TieredUpgrade('Glowing chips','<q>They glow so brightly that when you eat them, you can see them passing through your digestive tract! It\'s incredibly gross, but they are a rather nice minty variant of chocolate.</q>','Prism','mnt17');
        order=1200;Game.TieredUpgrade('Do it again','<q>Ever lost a game of random chance? Simply do it again!</q>','Chancemaker','mnt17');
        order=1300;Game.TieredUpgrade('Fractal engine fractal engine','<q>This fractal engine makes other fractal engines, which in turn make more fractal engines. You\'ve been assured that they start making cookies eventually but for the time being maybe put these in a closet somewhere and hope they don\'t multiply too fast.</q>','Fractal engine','mnt17');
        order=1400;Game.TieredUpgrade('Sprinttime','<q>Runtime is proving just too slow for your cookie needs, this will help speed up all the code you run. Just make sure your fans are bolted on before you do.</q>','Javascript console','mnt17');
        order=1500;Game.TieredUpgrade('Cookie clicker knock-offs','<q>Turns out there are some wannabe cookie clicker universes out there which are blatantly ripping off your style. Invading and taking them down is of top priority, besides, their cookies are close enough that it saves on converting time.</q>','Idleverse','mnt17');
        order=1600;Game.TieredUpgrade('Brain sweep','<q>Turns out cortex bakers think of things other than cookies; childhood memories, first kisses, weddings, birthdays, car crashes, cosmic seagulls pooping on their brain. We\'ve gone through and sweeped all those things out so there\'s more room for thinking about cookies.</q>','Cortex baker','mnt17');
        order=1700;Game.TieredUpgrade('A friend','<q>It can be quite lonely at the top, everyone looks up to you, but you have no one to look to yourself, you never had the time for socializing what with the constant cookie expansion. But now, you think you could use a friend, just someone to talk to. Unfortunately the only people who can work with your schedule is a clone of yourself, so now you\'re stuck talking to yourself again. But hey, it\'s something.</q>','You','mnt17');

        order=200;Game.TieredUpgrade('Faster aging','<q>Turns out you can make people age several years within a few hours if you remind about how old things are that they remember as recent, or by stretching how long they percieve time to be. For example, did you know that yesterday was only 86,400 seconds ago? Time is ticking!</q>','Grandma','mnt18');
		order=300;Game.TieredUpgrade('Crop cycles','<q>At the repeated behest of your enviromentalists, you\'ve begrudgingly given in to the idea that planets have seasons which greatly affect what kinds of plants can be planted and grown. The results do surprise you though, as your cookies from April to September finally lose that yeastiness they\'ve had for however long it\'s been now.</q>','Farm','mnt18');
		order=400;Game.TieredUpgrade('The full dig','<q>What is digging than just moving large chunks of earth from underground to overground? No more will you put up with this fanciful routine, from now on, when you dig, you\'ll do the FULL DIG. Leave nothing behind!</q>','Mine','mnt18');
		order=500;Game.TieredUpgrade('Changing gears','<q>The spice of life has seem to worn away now that everything is automated for you, no longer do you need to bake a single cookie yourself, every piece of office furnature and equipment is provided for you, every single diagram, idea, concept, blueprint, is already a hand gesture away to being at your desk. Perhaps what you need is a new way of approaching things, a new lifestyle, something to change up the monotonous and repetitive loop you\'ve found yourself in. It would certainly be a nice change of pace.</q>','Factory','mnt18');
		order=525;Game.TieredUpgrade('Extended money gun magazines','<q>Now THIS is awesome.</q>','Bank','mnt18');
		order=550;Game.TieredUpgrade('Burial methods','<q>Those who partake in the appraisal of the cookie gods believe that when they die, they will pass on to the next life, full of clouds which rain cookies and every one they\'ve ever loved eating cookies on cookie chairs and tables. To do this their burial must follow a strict procedure featuring two dalmations, a glass of milk, and the hair of their true love.</q>','Temple','mnt18');
		order=575;Game.TieredUpgrade('Enhanced uvulas','<q>Magic users now have their uvula magically enhanced by a professional wizard when they turn eleven and a half. Their new, magic uvula, allows them to pronounce letters that would cause a normal wizard to choke on their liver.</q>','Wizard tower','mnt18');
		order=600;Game.TieredUpgrade('Black mounds','<q>Your cosmic explorations have caused the discovery of this strange interstellar object. The inverse of a black hole - it is infinitely sparse, it\'s gravitational repulsion is so big, that not even light can bounce off it, causing it to be a painful blur within your eyes whenever you stare at it.</q>','Shipment','mnt18');
		order=700;Game.TieredUpgrade('Fizzy potions','<q>The bubbles make you burp.</q>','Alchemy lab','mnt18');
        order=800;Game.TieredUpgrade('3rd dimension','<q>Normal portals are two dimensional, but through the magic of keeping track and doing math with a third number, you can stretch them in an entirely new axis! Expanding the amount of cookie dough you can collect cubically.</q>','Portal','mnt18');
        order=900;Game.TieredUpgrade('Fall seconds','<q>The opposite of leap seconds, which are normally a necessity due to earth\'s rotation around the sun not being completely consistent. If you feel time has had a few too many extra seconds, just throw a couple of these in until the time is right.</q>','Time machine','mnt18');
        order=1000;Game.TieredUpgrade('Nuetron\'s cradle','<q>Nuetron\'s are proven to be 50% less explosive if you put them in a rocking cradle and sing them lullabies.</q>','Antimatter condenser','mnt18');
        order=1100;Game.TieredUpgrade('Light of your life','<q>There it is, that\'s all of it. Fits into a single shoebox. Perhaps you should just put it on your shelf and never look at it ever again.</q>','Prism','mnt18');
        order=1200;Game.TieredUpgrade('Horse modelling show','<q>Your horseshoe department has developed some particurly garish and flambouyant collections of horseshoes. Now those horseshoes can be worn by horses trotting up and down the horsewalk for a crowd of onlookers who will say things like "Doesn\'t that horse look like it\'s wearing decorated horseshoes" and "Where are we going to eat afterwards". This definitely increases your cookie production somehow.</q>','Chancemaker','mnt18');
        order=1300;Game.TieredUpgrade('An upgrade which makes more upgrades','<q>Your designers have grown so tired of coming up with quippy upgrade names and quotes and are desperate for a break. This upgrade allows you to fire all of their lazy brains and simply create an infinite series of upgrades, allowing you to purchase buildings forever and guarantee that there\'ll be an upgrade to compensate! Unfortunately, someone still needs to put those upgrades into the system, so you rehire one of your designers back just so they can get them all sorted, bottlenecking your number of upgrades once again.</q>','Fractal engine','mnt18');
        order=1400;Game.TieredUpgrade('Multi-armed switch board operator','<q>Whenever you need to run a function, the program calls that function, the person behind handling all those calls is some switchboard operator who has been stuck in a basement for 30 years. Good thing they\'ve got that practice, because you\'ve thrown them back into that basement with some extra sewn on appendages for them to handle even more calls at once despite their screams of mutilated agony.</q>','Javascript console','mnt18');
        order=1500;Game.TieredUpgrade('Topological trickery','<q>You encounter many strange geometrical spaces in other universes that are often difficult to navigate or comprehend. But, by some clever mathematics, you can simplify most of these spaces into simple shapes - doughnuts, planes, spheres, the lot - that greatly reduce the complexity of any maps required. By this same principle, many objects can mathematically be transformed into a cookie due to them being homeomorphic. This allows for more stingier universes to continue making whatever they were producing beforehand, as what they\'re making is basically a cookie if you squint your eyes a bit.</q>','Idleverse','mnt18');
        order=1600;Game.TieredUpgrade('Mental cleanse','<q>To help destress some of the more worrisome cortex bakers, they\'ll be taken to an off-grid resort full of tomes and poems to gorge their intellectual cravings. Although to pay for the resort and to retain their quota, they\'ll be forced to think up twice as many cookies for 3 months afterwards.</q>','Cortex baker','mnt18');
        order=1700;Game.TieredUpgrade('Full cell mitosis','<q>Usually whenever a cell divides, it only takes half of the DNA it had originally. This makes no sense and upon hearing this you ordered your horrified geneticists to keep the whole DNA sequence instead. In your mind, this should probably double your clone effectiveness.</q>','You','mnt18');

        order=200;Game.TieredUpgrade('Full body replacement','<q>A few of your grandmas have been getting so old that several organs have begin shutting down, damaging your cookie production. But a once-per-century full body replacement should get them feeling right as rain at 1,759 years old.</q>','Grandma','mnt19');
		order=300;Game.TieredUpgrade('Through the cookievine','<q>By putting your ear very closely to your cookies in a pod, you can hear that they whisper secrets of cookie farming that you hadn\'t known before.</q>','Farm','mnt19');
		order=400;Game.TieredUpgrade('Mine your business','<q>Tons of old office furnature, equipment, documents and trash bags get throw out weekly, might as well dig those up too and see what we can salvage!</q>','Mine','mnt19');
		order=500;Game.TieredUpgrade('Black and yellow safety lines','<q>These should keep the nitwits working your factories from diving head first into the <b>giant machine which turns you into a cookie</b>™ machine. Although it did lead to some interesting flavour discoveries, the employee turnover and subsequent lawsuits did hurt the bank a bit.</q>','Factory','mnt19');
		order=525;Game.TieredUpgrade('Polypoly','<q>While you\'re incredibly comfortable holding a monopoly over any cookie someone could ever fathom, you feel you need to diversify your market a little bit and gain control of even more of the world\'s wealth. Become the worlds first polypoly! A business which has absolute control of multiple goods at once!</q>','Bank','mnt19');
		order=550;Game.TieredUpgrade('Gummy snake pit','<q>These sweet little suckers provide a forboding obstacle while also being delicious even when baked into a cookie.</q>','Temple','mnt19');
		order=575;Game.TieredUpgrade('Mumblings o\' mouthfuls','<q>Wizards can now cast their verbal spells while halfway done shoving an entire cookie down their gullet. It\'s incredibly gross to watch and even more gross to listen to.</q>','Wizard tower','mnt19');
		order=600;Game.TieredUpgrade('True up','<q>You\'ve been delivering packages marked "this way up" for ages now, but in the cold expanse of space, up is entirely meaningless. Until now that is. True up has been discovered, and now your rocket ships can perfectly align themselves with it, ensuring the only damage parcels will take is the inertia of going through space at 20% the speed of light to a sudden stop when arriving at a depot.</q>','Shipment','mnt19');
		order=700;Game.TieredUpgrade('Change of heart','<q>You\'ve been reflecting on your growth throughout this journey, how much you\'ve changed, every philosophy you\'ve picked up and dropped, how naive you were when you first started. Could you still call yourself the same person who started this empire? Was it really you who did this all if you kept changing along the way? Right now, you seem so steadfast in your beliefs, that everything you reject deserved to be rejected, and that everything you accept is of the utmost good and excellence. But perhaps you can change again, perhaps something new will flip how you view everthing again. The new will be scary, but if you try hard enough, a year from now someone else will be running the show, and they\'ll be just as steadfast as you are now.</q>','Alchemy lab','mnt19');
        order=800;Game.TieredUpgrade('Middleworld','<q>Just above the underworld and right below the overworld. A rather bland place with no immediately indentifiable moral ground. Oh look! Some cookie dough! Well whatever this place\'s deal is there\'s cookies to be made, grab a shovel and start digging.</q>','Portal','mnt19');
        order=900;Game.TieredUpgrade('Very, very loud alarm clocks','<q>Now your workforce has no excuse for sleeping in! With this company gift given out to every single employee, they\'re sure to wake up calm and refreshed after a good night\'s sleep.</q>','Time machine','mnt19');
        order=1000;Game.TieredUpgrade('Anti-antimatter-matter-matter','<q>Normally whenever antimatter and matter collide, the result is a ginourmous explosion which sets your quarterly predictions back 3 months. Using this fuzzy material safetly encases this explosion to a small "kerpuff", and leaves behind a clear liquid which can be poured down the waste sink.</q>','Antimatter condenser','mnt19');
        order=1100;Game.TieredUpgrade('Bakery of mirrors','<q>Just be careful when using the oven, you don\'t want to spill the tray by walking into a mirror.</q>','Prism','mnt19');
        order=1200;Game.TieredUpgrade('Cookie counting','<q>Hiring a bookkeeper to keep extra track of your cookies made by chancemakers allows you to make more precise calculations about when to hedge your bets or extend your hand for a roll of the dice. Just make sure to avoid the chancemakers gaze when doing so or they\'ll throw you under a ladder for gaming their luck.</q>','Chancemaker','mnt19');
        order=1300;Game.TieredUpgrade('Settling in','<q>You\'ve purchased a manor with infinite floor space but a finite number of walls. You can walk from the portico to the back pool in 3 minutes, but can spend hours getting lost in the labryinthian set of hallways and rooms which lead to more rooms. Upon looking at what was assumingly a mouse hole, you realize that an entire smaller copy of the manor rests inside of it. This truly is the best place to live with your ever-expanding set of awards, keepsakes, souviners, crowns, cups and stuffed teddy-bears.</q>','Fractal engine','mnt19');
        order=1400;Game.TieredUpgrade('Dependable dependencies','<q>Dependencies for your programs are now always up to date and are hosted on reliable servers which never drop the connection.</q>','Javascript console','mnt19');
        order=1500;Game.TieredUpgrade('Taxxing the colonies','<q>Tax the colonies responsible for expanding your cookie empire to further increase your profits. It\'s not like they could start a revolution with your contently-paid cosmic army waiting in the sidelines.</q>','Idleverse','mnt19');
        order=1600;Game.TieredUpgrade('Gravitational mood slingshots ','<q>A moody cortex baker can stir up quite an atmospheric storm - surrounding space debris get caught it\'s in gravitational pull and get slingshot around until it finally calms down from it\'s cosmic tantrum.</q>','Cortex baker','mnt19');
        order=1700;Game.TieredUpgrade('Gene jeans','<q>Sewn on the molecular scale, put your own genes in a pair of flashy pants so they look extra cool when constructing the very flesh that makes up your clones. No one said growing naked copies of yourself in city sized facilities couldn\'t be stylish!</q>','You','mnt19');

        order=200;Game.TieredUpgrade('Ultra-small birthday candles','<q>Specially designed candles are required to place over 100 of them on a single chocolate cake. Their wicks have also been thinned out to facilitate the weaker lungs of some of your older residents too, although it does create a rather holey cake after the labourious effort of picking them all out again.</q>','Grandma','mnt20');
		order=300;Game.TieredUpgrade('Selective breeding','<q>By planting the biggest cookie plants next to eachother, you can grow even larger cookie plants. This process repeats until the cookie is so heavy, you need to install synthetic supports to prevent the cookie from snapping the plant in two.</q>','Farm','mnt20');
		order=400;Game.TieredUpgrade('Shake technique','<q>By boring a giant hole in the underside of planets and then gently shaking them, you\'re able to completely hollow it out with less than a 10th of the digging required! Do note the "gentle shaking" you employ may register as a level 11 earthquake to those inhabiting the planet, but given that their planet is about to shrivel up into a paper ball it\'s not like they\'ll live long enough to complain about it.</q>','Mine','mnt20');
		order=500;Game.TieredUpgrade('Kiln of creation','<q>The very fire which melts together the old and creates the entirely new ignites passion and creativity to those who see it. The flickering flames perform an exotic dance, and through it we harness the power of gods - the ability to melt and form what we have been given into something unseen, something unknown, something entirely brand new. Through this power does the meaning of our lives become clear - to make the new, to live like the gods, to push the frontier of what has and is forever forward into the void of nonexistance.<br>Pretty good for a pizza oven too.</q>','Factory','mnt20');
		order=525;Game.TieredUpgrade('Endless credit limit','<q>Sure! Take that annoying limit off your credit card. Buy everything you could ever ask for and deal with the crippling debt a month later from now! We won\'t regret it!</q>','Bank','mnt20');
		order=550;Game.TieredUpgrade('Hungry visions','<q>Some followers will abstain from their pledge of cookie worship after a crisis of faith, lure them back in with horrifying visions of cookie angels appearing in their bedroom and tempting them with the soft, chewy texture of a warm chocolate chip cookie.</q>','Temple','mnt20');
		order=575;Game.TieredUpgrade('The correct spellings','<q>In the dusty cabinets locked away under stairwells and hidden passages lie tomes written by wizards from over 1000 years ago. Language has evolved since then, and now their incantations and spellings seem almost foreign, centuries of misspellings, typos and dialectic shifts have caused these words to drift far away from their original form - and become much weaker as a result. Now these archaic truths have been uncovered, wizard everywhere can regress their way of speaking to the way of the old masters - and become even more intelligible when they\'re trying to buy shoes.</q>','Wizard tower','mnt20');
		order=600;Game.TieredUpgrade('Jet engines','<q>A sawed off jet plane engine is now attached to every single one of your rocket ships. They\'re loud as hell and have caused 9 of your crewmembers to go deaf but look cool enough for you to disregard these causalties as "Hiccoughs in the name of progress". Just ignore the fact that without air in space their propellers are entirely useless.</q>','Shipment','mnt20');
		order=700;Game.TieredUpgrade('Obtained unobtainium','<q>Nice work, you got it, now shove it in a cookie so we can all eat it.</q>','Alchemy lab','mnt20');
        order=800;Game.TieredUpgrade('Insane asylum','<q>Somewhere to throw all those chittering workers who have gone mad baking cookies. How could you go mad baking a cookie of all things? You really \'oughta be stupid to go mad baking a cookie, it\'s not like there\'s a cookie baron overseeing the invasions of entirely other dimensions just to bake more cookies. What kind of lunatic story is that?</q>','Portal','mnt20');
        order=900;Game.TieredUpgrade('Time off','<q>Turns out you can just turn time off, there\'s a little switch in the time machine labs that lets you do it. No keys, no preregistration, just one flick. Comes in handy when you\'re in need of a break but don\'t want to miss out on any cookies you would\'ve gained in that week.</q>','Time machine','mnt20');
        order=1000;Game.TieredUpgrade('Schroedinger\'s oven','<q>Is the cookie baked? Is it not baked? It\'s impossible to tell until you open the oven. Ignore the saliva-inducing waft of freshly baked cookies coming from the oven, that isn\'t part of the thought experiment damnit.</q>','Antimatter condenser','mnt20');
        order=1100;Game.TieredUpgrade('Aligned constellations','<q>Though the twinkling light of a star is small, aligning them up with a constellation magnifies their power greatly. Some rumour that the constellation up in the sky above you affects the kinds of cookies you bake. The knowledge of this celestial blessing is held by the most enlightened and lucky surveyors of the night sky - tabloid journalists.</q>','Prism','mnt20');
        order=1200;Game.TieredUpgrade('Bent bell curves','<q>Grab a hammer and smash those normal probabalistic results to create a bell curve that pushes your chances into the 95th percentile and beyond. That ringing you hear is the sound of winning.</q>','Chancemaker','mnt20');
        order=1300;Game.TieredUpgrade('Set on a plan','<q>The graph of possible choices you could make from this point forwards expands and extends infinitely in every concievable direction. Choosing to put hairless crumb cookies on the shelves has a further five entirely new possible choices after it, and each of those choices again have choices you could make after that. The many paths of life you could choose go far and wide; whereever you end up drastically swinging from one end to the other as you spend two seconds thinking about something and following through with it, or not following through with it as it\'s own choice! Tracing your path from here to the start you realize just how many crucial moments were made in snap decisions. This kind of volatility cannot continue, from now on, you are set on a plan and going through with it. Out of the infinite possible endings of your life, you know which one yours will be.</q>','Fractal engine','mnt20');
        order=1400;Game.TieredUpgrade('Webnovels', '<q>Allows you to store 100x more pages than a single webpage.</q>','Javascript console','mnt20');
        order=1500;Game.TieredUpgrade('Suppressing the colonies','<q>Okay turns out the colonies did get rather upset with the tax rates. Beat them with an excessive amount of cosmic force until they yield and continue infiltraiting whatever universe they\'re in.</q>','Idleverse','mnt20');
        order=1600;Game.TieredUpgrade('Origami folds','<q>Increases creativity of your cortex bakers by allowing them to fold their brains into cute little angular animals and vehicles.</q>','Cortex baker','mnt20');
        order=1700;Game.TieredUpgrade('It was inside of you all along','<q>Blood! Blood helps a lot when making a new human being, we should\'ve been using this the whole time. Why had no one thought of this before? No idea, but we\'re using it now! This is going to save on so many urns.</q>','You','mnt20');

        order=200;Game.TieredUpgrade('Wills','<q>Now your grandmas have personalized receipts about what happens to their belongings after their death. Much preferable over the family-sized fight pit you\'ve sponsered beforehand.</q>','Grandma','mnt21');
		order=300;Game.TieredUpgrade('Nuclearponics','<q>Grow your plants in carefully contained vats of radioactive waste. The nutrients it provides are surprisingly fruitful, and the more energetic pools have produced some entirely new species of plants never seen before! Eating them may knock your life expectancy in half but with the new flavours they create, you\'re sure your customers will find it worth it.</q>','Farm','mnt21');
		order=400;Game.TieredUpgrade('Roller-coaster rails','<q>Featuring a loop-de-loop, jump over a lava lake, and a final finish where you go perpindicular to the floor for 15 miles straight in a grand finale. This definitely makes you more cookies.</q>','Mine','mnt21');
		order=500;Game.TieredUpgrade('Golden tickets','<q>Ensure all your cookies are a risk of being a choking hazard by secretly inserting these shiny bars into random batches of cookies. If they manage to survive the rest of the pernicous baking and shipping process, those lucky enough to find one by accidentally biting into it and chipping a tooth, are granted a free visit to one your many factories! They\'re allowed to bring one extra family member for the visit and must sign a waver which they can\'t even read, but the hunt for these elusive items will cause the whole world to go mad purchasing your cookies!</q>','Factory','mnt21');
		order=525;Game.TieredUpgrade('Fiat money','<q>Now money has value because you say it has value! Want money to be worth more? Go for it! Want money to be worth less? It can be done! Your first action is to immediately make money worth an absolute ton to increase your assets. After about ten seconds of this being done, a flaming economist sprinted into your office pleading that you undo it before security escorted them off the premises for bring so rude in your grace.</q>','Bank','mnt21');
		order=550;Game.TieredUpgrade('Hymms','<q>A collection of songs for cookie congregations to sing in worship of your cookies.<br>They\'re actually quite pleasant to listen to.</q>','Temple','mnt21');
		order=575;Game.TieredUpgrade('Climbable beards','<q>Now to reach the top of a wizards tower, instead of climbing up a lengthy and ever-increasing spiral staircase, just holler out "Oh wizard, oh wizard! Let down your beard!" and an unhygenic wizard will let down a beard that extends all the way to the ground. Climbing up is unimagineably painful for the wizard, but they\'re on your payroll so they don\'t get to complain.</q>','Wizard tower','mnt21');
		order=600;Game.TieredUpgrade('Fuel deliveries','<q>Shave some of the weight off of your shipments by carrying less fuel and having the rest of it delivered throughout the journey. Now each of those deliveries will themselves need rocket fuel, which will also need to be delivered to those rockets, but since when has logistics ever stopped you?</q>','Shipment','mnt21');
		order=700;Game.TieredUpgrade('Philosopher\'s kidney stone','<q>Ewwwww. Maybe lay off putting salt in your cookies for awhile.</q>','Alchemy lab','mnt21');
        order=800;Game.TieredUpgrade('Fall into a trance','<q>You took a visit to your portal networking terminal and began to look a little bit too closely at the enticing swirls of your portals. Next thing you remember is waking up in a pile of cookies and your eyes being unusually dry.</q>','Portal','mnt21');
        order=900;Game.TieredUpgrade('Death clocks','<q>To help improve employee productivity, you\'ve handed out these to every single one of them. The display shows a countdown until their estimated death, encouraging them to make as many cookies as possible before the cookielessness of death swallows them whole. The average human only lives for 700,000 hours, so it all fits nicely on one 6 digit screen!</q>','Time machine','mnt21');
        order=1000;Game.TieredUpgrade('Certainty principle','<q>Those darn physicists were too damn scared about this one, they don\'t have the confidence to declare a particle a particles position and momentum. Science is about exact precise measurements, if those wimps are too cowardly to do it, then damnit do it yourself.</q>','Antimatter condenser','mnt21');
        order=1100;Game.TieredUpgrade('Lighthouses','<q>Convert entire domestic facilities into night-piercing light generators. Contrary to the name they\'re incredibly heavy, but the light they produce could guide a ship to the parking garage!</q>','Prism','mnt21');
        order=1200;Game.TieredUpgrade('Waking up the right side of the bed','<q>This will make all your days a good day from the very start! The right side does face towards a wall but it still feels better than the left side.</q>','Chancemaker','mnt21');
        order=1300;Game.TieredUpgrade('Everything makes everything','<q>The universe is a carefully designed system, if one thing goes out of balance, several other factors begin to bend out of shape and disaster strikes. In that way, every single thing in the universe; the dust in space, seemingly arbitrary mathematical constants, the exhale of a great redwood tree, the hair on the upper lip of a teenage girl - every single one is just as important to making the universe as it is as everything else is. In this sense, everything in the universe makes itself by mere fact of existance. What a beautiful cycle.</q>','Fractal engine','mnt21');
        order=1400;Game.TieredUpgrade('The webweaver','<q>A most endangered and elusive species of arachnid, this lone spider is responsible for all of the web\'s connections. The silk they secrete can send up to 10000 packages per millisecond, passing around every message, image, file, link, cat video and audio that is ever sent by anyone online. By using an internet to catch her, you can increase the power of your servers dramatically.</q>','Javascript console','mnt21');
        order=1500;Game.TieredUpgrade('Fine-tuned-universe','<q>The most perfect universe you have found so far, every single part of it is perfectly in sync and aligned with another, as to create the most eloquent and beautifully sustained order amongst every element. Now ransack it for all it\'s cookies and throw everything out of wack before ditching it again, the icing here is especially scrumptious.</q>','Idleverse','mnt21');
        order=1600;Game.TieredUpgrade('Food for thought','<q>A mixture of milk, space flour and gerdoublue cheese that you only need to think about to eat. Do not to think of eating it though, as it stimulates the brain so much that only gargantuan ones like your cortex bakers can handle the energetic load. To every other living organism, this might as well be considered an infohazard - shred any evidence of it existing and lobotomize the brain of anyone who goes near it so that they\'re incable of considering to eat it. For yourself - if the back of your brain starts feeling burnt, immediately slam your face into the nearest solid surface to go unconscious and wipe your memory of whatever you just were thinking about. Do. Not. Remember.</q>','Cortex baker','mnt21');
        order=1700;Game.TieredUpgrade('A museum of you','<q>The most well known and influential cookie tycoonist only deserves the most extensive museum about your life and predicted death! Featuring an exhibit where people get to painstakingly watch every second of your life through your eyes from childbirth to now, a library full of giant encyclopedias printed in 4pt gold ink dedicated to analyzing your business skills and cookie repitoire, a glass display of your skeleton, and a colloseum-sized food lounge, where every flavour you have ever developed is available for taste testing by customers who are obligated to sign a liability waver beforehand. All employees are of course, clones of yourself, so people can be even more terrified as 12 replicas of a demigodic figure they were just reading, calmly walks through the gallery in an egotistically enriching sight.</q>','You','mnt21');

        order=200;Game.TieredUpgrade('Necromancy','<q>You know what\'s really old? The dead! Desecrate their burial site, resurrect them, and put those suckers on the assembly line. Even death can\'t save you from suffering now!</q>','Grandma','mnt22');
		order=300;Game.TieredUpgrade('Milk rain','<q>Your farming efforts have quite the effect on the weather cycle, tornados have increased in temperature and coagulate whatever it collects, floods leave every surface oddly sticky and sweet, and now the rain pours down warm milk! The question of how a fluid normally created biologically through mammals has ended up in the sky isn\'t your main concern, instead, this can be used to further increase the productivity of your farms. What bakery product doesn\'t taste better with milk?</q>','Farm','mnt22');
		order=400;Game.TieredUpgrade('Marble statues','<q>What a better way to show off your elite status than intricately carved marble statues reusing the same rocks from your quarries. Every detail of your supreme body accurately recreated in stone down to the picometer. Although you did request that some of your less appealing features were... adjusted.</q>','Mine','mnt22');
		order=500;Game.TieredUpgrade('Guided tours', '<q>Come all from far and wide to visit the wonderous world of your cookie factories! Lick the wall which tastes like cookies, take a swim in the dough river, and gander at one of your many crimes against nature! Those who misbehave will get thrown into the machinery and violently, yet survivably, mutilated and stretched in a comical fashion to teach them a lesson.</q>','Factory','mnt22');
		order=525;Game.TieredUpgrade('Money trees','<q>Turns out it does grow on trees!</q>','Bank','mnt22');
		order=550;Game.TieredUpgrade('Excorcists','<q>There are people out there who still don\'t want your cookies! Clearly they must be witches possessed by demons. Get these folks out there and cure these tortured spirits from their pastryless misery with loud shouting, fanciful gesticulating, two warthogs and a bed of nails.</q>','Temple','mnt22');
		order=575;Game.TieredUpgrade('A young girl\'s heart','<q>An incredibly rich source of magic. Renewable too! Just the play some music, give it a squeeze, and the magic will come pouring out. Harvesting them is the hard part.</q>','Wizard tower','mnt22');
		order=600;Game.TieredUpgrade('Packaging peanuts','<q>Gives all your delivered pastries a slightly nutty taste and protects them from the nut allergenic space vikings who occasionally raid your ships.</q>','Shipment','mnt22');
		order=700;Game.TieredUpgrade('48 karat gold','<q>That\'s 100% more gold per gold, and double the amount of rabbits it can feed!</q>','Alchemy lab','mnt22');
        order=800;Game.TieredUpgrade('Backwards messages','<q>Certain ungodly creatures from heinous dimensions whisper backwards messages which secretly influence the behaviour of those who hear it. Grab a dozen of them and put them to work in your advertising department for even more effective persuasion.</q>','Portal','mnt22');
        order=900;Game.TieredUpgrade('Opposite day','<q>Finally you\'ve found this day! For ages now, your time machines have randomly been taking away cookies instead of making them, and you\'ve had no idea why. This was the culprit! Some time machine would go back or forwards in time to opposite day where everything was the opposite, including your cookies! Now you\'ve found it, you can quarantine and store it for some later theoretical cookie baking..</q>','Time machine','mnt22');
        order=1000;Game.TieredUpgrade('Predictable decay','<q>Again! Those timid physicists can\'t stand up for themselves and say "No! Particles undergo radioactive decay at exactly this point in time!". Instead of putting in some effort and finding out exactly when they decay, they gave up and just said it was "random". What nonsense! God doesn\'t play dice with the universe and neither do you.</q>','Antimatter condenser','mnt22');
        order=1100;Game.TieredUpgrade('Cookie scented candles','<q>Opening a store full of these won\'t actually increase your sales, instead, they\'ll massively increase your brand recognition as crowds pour in just to smell them, smile at the cashier, and leave.</q>','Prism','mnt22');
        order=1200;Game.TieredUpgrade('Snowball of success','<q>Those who win early in life tend to get more opportunities opened up to them earlier, thus letting them gain even more of an advantage and so on. By getting your foot in the door now, you could maximise your chances of success. So what are you waiting for? Go get \'em!</q>','Chancemaker','mnt22');
        order=1300;Game.TieredUpgrade('Shephard\'s tone','<q>The stern speech of a shephard has proven to be a very effective way of whipping your workforce into productivity. They\'re able to sound like they\'re constantly getting more and more angry yet ultimately get no quieter or louder.</q>','Fractal engine','mnt22');
        order=1400;Game.TieredUpgrade('Cool glitches','<q>Sometimes a mistake can create something cooler than if it had not existed, mesmirizing visuals created by reading garbage data with spritesheets, multithreading functions going out of sync, a new bug which entirely changes how a game is played for the better, or perhaps something which allows players to push the game to it\'s absolute limits. You\'ve decided to keep some of the more interesting bugs in your code, even if you do have an urge to fix them, sometimes life is better with the mistakes included.</q>','Javascript console','mnt22');
        order=1500;Game.TieredUpgrade('Reality liquidization','<q>Some universes are just not worth your time to take over, their production lines are still in infancy and at this point, just taking the entire place and liquidizing it into a nice, juicy flavour to shove into a cookie would be a better use of time. Just wear earmuffs when you do, the screams of civilians watching their entire existance get slowly transformed into chyme is not the most pleasant thing in the world.</q>','Idleverse','mnt22');
        order=1600;Game.TieredUpgrade('Gas giants','<q>That food which you should not think about eating has the unintended side effect of making your cortex bakers have an increase flatulence. The most major downside of it is the endless giggling you now have to deal with in the office from the myriad of fart jokes this can brew. As an upside, if the gas condenses into a planet, the resulting explosion creates a material which works as an incredibly effective fertilizer.</q>','Cortex baker','mnt22');
        order=1700;Game.TieredUpgrade('Cryopreservation','<q>You aren\'t getting any younger, and your DNA replication is showing it. Might as well freeze some of your younger clones to preserve your youthfulness incase it runs out.</q>','You','mnt22');
        
        order=200;Game.TieredUpgrade('Want to feel old?','<q>It\'s honestly a miracle your grandmas have lived as long as they have. Could you imagine the amount of things you would have done by the time you were over 100 years old? How many days and nights spent with loved ones and exploring the world. The pure joy of wading through the pain and change of life, and to come out the other side and be alive. That all the effort and persistence you put in has now paid off, and that you can reap the succulent fruits and pleasure which life can offer, that the reason to live exists for. And now during the autumnal years of your life, you are able to look back at it all, to flip through photo albums and old diaries and relish in the fact that you lived - that you had done it, that you had <b>made</b> it. No matter how difficult it was then to push through, you did, you faced through mere struggle of existance and can now join those who came before you in doing the only thing they could - live. Your body breaking down and your athleticness beginning to fade are physical representations of your accomplishments - not dying young and the years you had enjoyed because of it.<br>"Want to feel old?" "Yes.".</q>','Grandma','mnt23');
		order=300;Game.TieredUpgrade('Ecological succession','<q>Following the great and expansive empire of the worlds ecosystem, you have finally replaced it with your own, pastry-based ecosystem. The natural food chain has been replaced with the food pyramid, all of which is entirely filled out with cookies. The sea floor is made out of shortbread, mountains are now giant chocolate chips, the snow have been replaced by icing, the animals have all been replaced by a sweetened mirror variant, and crust of the earth has become a giant cookie crust keeping a warm, but chewy interior intact.</q>','Farm','mnt23');
		order=400;Game.TieredUpgrade('Split the atom','<q>Atoms are so selfish, you\'ve been harvesting the natural resources of plenty of planets, yet when you try to take away some of an atom, they throw a fit and cause an explosion which wipes out half the planet! On the upside, this saves you a lot of digging work, on the downside, you still can\'t mine those nuclear particles for yourself. For the time being, keep splitting atoms to speed up your digging process dramatically.</q>','Mine','mnt23');
		order=500;Game.TieredUpgrade('Work experience','<q>To take over the world you must take over the children. Get in there early by offering work experience at some of your factories! They may lose a limb or have half their face torn off or witness some of your more confidential baking tests but they\'ll do it for free just to bump up their resume!</q>','Factory','mnt23');
		order=525;Game.TieredUpgrade('Asset juicer','<q>Squeezes every last drop of money out of your liquidized assets. If you add some sugar, you get quite a herbal - yet tangy juice which you can probably shove into a cookie somewhere.</q>','Bank','mnt23');
		order=550;Game.TieredUpgrade('Sacrificial altar','<q>The cookies demand blood. Feed the blood for the cookies. Those who steal cookies from the cookie jar will be sacrificed for the almighty baker.</q>','Temple','mnt23');
		order=575;Game.TieredUpgrade('Tarot cards','<q>An occult deck of cards, pick one at random and according the position of the stars, which way water flows down the nearest river, and the microbiome of the gut of a blonde leprechaun, it can foretell your future!</q>','Wizard tower','mnt23');
		order=600;Game.TieredUpgrade('Stowaway evacuation procedures','<q>Catch those pesky aliens trying to hitch a ride on your shipments and launch them out of the airlock. This doesn\'t practically have any effect on your delivery margins but at least they won\'t be freezing to death inside your ships any more.</q>','Shipment','mnt23');
		order=700;Game.TieredUpgrade('Baking elixir','<q>A superior form of baking powder which also increases baking profeciency for 3 minutes when drunk. Add a dash of fluorescent gravel and it\'ll double the potency at half the duration. Better get brewing!</q>','Alchemy lab','mnt23');
        order=800;Game.TieredUpgrade('Faustian bargain','<q>You get to make more cookies at the simple sacrifice of giving up your soul on weekends for use by <b>them</b>.</q>','Portal','mnt23');
        order=900;Game.TieredUpgrade('Supertasks','<q>These tasks first appear to be just menial labour which never reaches an end point, involving tortoises, an ancient greek olympiad, cutting cakes in half and a bedside lamp. But with your time machines, you figure that you can simply just travel through time until the task is complete - letting an infinite amount of work be done in as little as two seconds!</q>','Time machine','mnt23');
        order=1000;Game.TieredUpgrade('Atomic grain flour','<q>Flour so fine that it\'s grains measure on the atomic scale. The cookies this bakes are as smooth as a satin pillow, and fall apart just by the prescense of the sea breeze.</q>','Antimatter condenser','mnt23');
        order=1100;Game.TieredUpgrade('Light of someone elses life','<q>When someone dies, the light usually fades from their eyes, that\'s precious light which is being wasted by someone else wasting away! Quickly get in there, pluck their eyes out, slice them coronally and harvest that light for your own cookie baking. The cookies this produces generally have a flavour not too disimillar to the life of the original person\'s. Firefighters produce a dark and smokey flavour, doctors make rather moist cookies, and the dauntless leave a flavour which is somewhere between a plum and fairy-floss.</q>','Prism','mnt23');
        order=1200;Game.TieredUpgrade('It either happens or it doesn\'t','<q>A very simple philosphy which greatly enhances the placebo that this risk will pay off.</q>','Chancemaker','mnt23');
        order=1300;Game.TieredUpgrade('Invisible habits','<q>There are things you repeatedly do which you aren\'t even aware of. Certain words, phrases and collocations you use over and over, writing tendencies such as upgrade quotes explaining a problem then introducing the upgrade as a solution to that problem, making building designs purposely drawn in a style that is untraditional for that type of object, or introducing earnest and stern concepts only to then follow them up with a silly quip to break the tension. This meta self-reflection makes you feel quite over-conscious, you feel that you need to change up your habits immediately and try something new. Alas, it\'s in vain, as everything that you immediately try is something you would\'ve tried beforehand - all that you know and remember is because they already match with your tastes. The world you look at is the world you see and you\'ve found yourself endlessly caught in this loop.<br>It\'s like you spent an afternoon reading TV Tropes again.</q>','Fractal engine','mnt23');
        order=1400;Game.TieredUpgrade('Compressed bites','<q>Uses an advanced compression algorithm to maximize the amount of bites a cookie can get before being fully eaten. This may lose a little bit of the flavour, but it shouldn\'t be too noticeable, cookies tend to lose flavour accuracy after a certain size anyway.</q>','Javascript console','mnt23');
        order=1500;Game.TieredUpgrade('Nobody expects the bakery inquisition!','<q>Random posses of men in red garbs will come down upon universes already under your control and comically interrorgate their inhabitants to ensure their faithfulness to your "bakery".<br>Their two weapons are fear and surprise... Fear, surprise and ruthlessness, THREE. Their three weapons are fear, surprise and ruthlessness, AND an almost fanatical devotion to your bakery- oh scuff it don\'t bother just bring out the dish rack.</q>','Idleverse','mnt23');
        order=1600;Game.TieredUpgrade('Arbitrary reasoning','<q>Making ideas which are perfectly sound and reasonable takes up too much time, sometimes you\'ve got to do something just for the sake of doing it to get anything done.</q>','Cortex baker','mnt23');
        order=1700;Game.TieredUpgrade('Double bristle ego brushes','<q>Doubles the effectiveness of stroking your ego - which mainly comes in the form of a clone brushing your back while saying how hard you are working and how excellent you are.</q>','You','mnt23');

        order=200;Game.TieredUpgrade('Fourth dimentian','<q>Forget things so well that it forms amyloidacts within your grey matter. Elders who suffer from this can typically be found with a grey cata along their lap.</q>','Grandma','mnt24');
		order=300;Game.TieredUpgrade('Cloud seeding','<q>Just plant these mystical seeds during the autumn, water them every day, talk to them a bit and hey presto! Torrential downpour to your hearts content!</q>','Farm','mnt24');
		order=400;Game.TieredUpgrade('Atom mining','<q>Finally! You\'ve been able to dig away the atom itself to harvest it\'s particles for more cookie production. The process is quite violent and honestly not even worth it compared to the resources you would collect by spending all that energy on a drill, but hey! Who knows what these funky particles can do to the taste of a cookie!</q>','Mine','mnt24');
		order=500;Game.TieredUpgrade('Planet-sized ovens','<q>It\'s no secret that your factories contribute to global warming, heck you\'ve already transformed some inhabitable planets into massive greenhouses, but that\'s not all you can do with this ecologically devestating phenomenon! Further saving on the need for fuel and fire, you can use the hottest planets which were once home to your factories as planet-sized baking ovens! The natural convection of the atomsphere and complete lack of water make it perfect for large-scale pastry baking. Just ensure all workers wear oven mits when touching the planet.</q>','Factory','mnt24');
		order=525;Game.TieredUpgrade('Money laundry','<q>Your lawyers told you that the taxman likes it when you wash your money. They seemed very concerned when you came back with a drenched bag of cash but the taxman did seem to like it more than your usual dismissal of the invoice!</q>','Bank','mnt24');
		order=550;Game.TieredUpgrade('Food for the gods','<q>Trick your faithful disciples into baking goods for the gods so to grant them good weather and harvests. Then take their mountain of food, hide it behind a curtain where the "gods partake of it", then fly away with their pile of pastries! If mesopotamia can do it then so can you!</q>','Temple','mnt24');
		order=575;Game.TieredUpgrade('The sorting hat','<q>In a recent expansion of your wizard towers, you bought an extensive once-wizarding school and this thingy came with it. Placing it on top of your cookies, you find out that it can sort cookies without even having to taste them! This lets you fire all those old sorting workers you had and save on the turnover when they bite into your more... volatile cookie flavours.</q>','Wizard tower','mnt24');
		order=600;Game.TieredUpgrade('T-positive','<q>How dreadfully silly of those rocket scientists to count using negative numbers! Your rockets aren\'t negative! Make them count positive numbers, you command them to do so!</q>','Shipment','mnt24');
		order=700;Game.TieredUpgrade('Elemental hopping','<q>You can transmute gold into cookies, but there are some other elements which you can\'t get quite right as a cookie. Binital cookies are always too lumpy, radiron cookies are completely hollow, and erkansatium cookies cause your mouth to bleed whenever you bite into them. By transforming those elements into gold, and transforming the elements which can\'t be turned into gold into ones that can, you\'re able to bring the whole periodic table into your cookie making process.</q>','Alchemy lab','mnt24');
        order=800;Game.TieredUpgrade('Human mimics','<q>Some of the more... flambouyantly, monstrous beings from your portals have a bit of a hard time fitting in with your human-based workforce. By teaching them to mimic, they\'ll be able to seamlessly walk alongside other humans, and those humans never need to feel the blood drain from their brain as they gaze upon a scalophanuklor from the bilezzack dimension- thereby cursing their entire bloodline from this point forward.<br>Note: Don\'t make any mimicking monsters laugh, as they will fall out of the mimic and traumatize anyone in sight.</q>','Portal','mnt24');
        order=900;Game.TieredUpgrade('Skipping to the ending','<q>Let\'s see how this how cookie baking journey ends shall we?<br>Oh. Oh... let\'s forget we ever saw that...</q>','Time machine','mnt24');
        order=1000;Game.TieredUpgrade('Left, right, forwards and backwards spin quarks','<q>Only makes sense if there\'s already up and down spin quarks. Get those quarky things moving around.</q>','Antimatter condenser','mnt24');
        order=1100;Game.TieredUpgrade('Polylabra candlelabra','<q>More arms for more candles for greater risk of fire! Either way you\'re making light of the situation.</q>','Prism','mnt24');
        order=1200;Game.TieredUpgrade('Equal likelihood','<q>If you think about it carefully enough, every single outcome of anything random has the exact same chance of happening. Pick a random number between 1 and 1 million, each number has the exact same chance of being picked. Flip a coin 1000 times, each set of outcomes has the exact same chance of happening as any other. With this newfound knowledge, rarity and frequency entropically fade out of existence. Every fail has the exact same chance as a success, this next one could be the one.</q>','Chancemaker','mnt24');
        order=1300;Game.TieredUpgrade('Self-aware awareness','','Fractal engine','mnt24');
        if (EN)
		{
			Game.last.descFunc=function(){
				var str = 'being aware of being aware of being aware of being aware of ';
                var n=30;
				var i=Math.floor(Game.realT*0.1);
				return this.desc+'<q>How much more meta can you get than being aware that you\'re being meta? Well of course you can become aware of being aware of being aware, and even on top of that there\'s being aware of being aware of being aware of being aware...<br><span style="font-family:Courier;">'+(str.substring(i%str.length,i%str.length+n)+(i%str.length>(str.length-n)?str.substring(0,i%str.length-(str.length-n)):''))+'</span></q>';
			};
		}
		else Game.last.desc='<q>-</q>';
        order=1400;Game.TieredUpgrade('Cosmic ray bit flipping','<q>With the power of the cosmic ocean at your finger tips, you figure you could just send a few carefully aimed cosmic rays towards your computers whenever it\'s so helpful. Currently though, your departments have found the main use to be pressing keys that they can\'t press due to a broken keycap.</q>','Javascript console','mnt24');
        order=1500;Game.TieredUpgrade('Cookie conquistadors','<q>Same as the current people you have leading the infiltration of other universes except with fancy dress on. The inhabitants may not understand it but you have a soft spot for it.</q>','Idleverse','mnt24');
        order=1600;Game.TieredUpgrade('Relative morals','<q>Your consciousness occasionally gets the better of you and asks "Should I really be doing this? It seems unethical". Shun those thoughts away with the power of relativistic morals! You may be doing something bad, but that other guy is doing something way worse! And y\'know what you\'re doing isn\'t that bad to begin with! You need to expand your cookie empire so your profit margins can ever increase, and besides, if you didn\'t someone else worse than you might! And hey, last week you didn\'t eat the last cookie in the company fridge so someone else could have it, that\'s a nice thing right? So go on, tear down that lush, alien jungle and build a new factory, you\'ve earned it.</q>','Cortex baker','mnt24');
        order=1700;Game.TieredUpgrade('Selective gene crossing','<q>Only cross the genes into Punnet Square when the traffic lights indicate to do so. Just be careful of any stray ethanol molucules.</q>','You','mnt24');

        order=200;Game.TieredUpgrade('Photo albums','<q>Pained, nostalgic, eidetic memory.</q>','Grandma','mnt25');
		order=300;Game.TieredUpgrade('The grim reaper','<q>Occasionally, be it through drought, pests, or just poor maintenence, your crops will die out and you\'ll lose 0.2% of your predicted yearly profits. In order to alleviate this, you struck a deal with death themselves, and now when your crops die and death comes to collect them, death will instead use that fancy scythe of theirs to harvest your crops for you in exchange for a deathtime supply of cookies. Don\'t ask how the math works out, deathtime works differently to lifetime.</q>','Farm','mnt25');
		order=400;Game.TieredUpgrade('Tungsten carbide drills','<q>It\'s something they use in cookie mining father.</q>','Mine','mnt25');
		order=500;Game.TieredUpgrade('Print your name on a cookie','<q>A small little machine in your lobbies which let\'s people make cookies where their own named baked into it.<br>It\'s the little things that improve company image.</q>','Factory','mnt25');
		order=525;Game.TieredUpgrade('Monocles and moustaches','<q>Because you dress to impress and reflect my dear.</q>','Bank','mnt25');
		order=550;Game.TieredUpgrade('Divine right of bakers','<q>Yes! You were chosen by the cookie god himself to lead this baking-well at this point you could call it this-monarchy, and are the legimate owner of the doughy throne. Anyone foolish enough to question your legitimacy can be cast down, and thrown into the trap-filled torment of your temples.<br>This still doesn\'t solve any inheritance issues, but at least for now you can stop any clones trying to usurp your position.</q>','Temple','mnt25');
		order=575;Game.TieredUpgrade('Cast iron','<q>Enhance your fantastical, whimsical, nebulous list of spells with the hard forged power of a steel wand. Just because we use magic doesn\'t mean we can\'t rely on good old-fashioned practical methods!</q>','Wizard tower','mnt25');
		order=600;Game.TieredUpgrade('Celestial castaway','<q>A meteor struck one of your shipments and left one of the employees stranded on a remote planet, they found several packages among the wreckage - a pair of mountain boots, some rope, a portaloo, and a bowling pin they lovingly named "Brunswick". They managed to survive on that planet for over 1500 days, until the materials required to make a rocket ship of their own miraculously drifted onto the asteroid! After another 12 months building the rocket ship, they set the ignition to go and lit the thrusters. After about 12 seconds a wire shortcircuited and the whole thing exploded, killing them but leaving their bowling pin companion adrift in space to carry on their legacy.<br>Hey in the movie you made they survive! You wouldn\'t have made all that money in the box office if you didn\'t change the ending.</q>','Shipment','mnt25');
		order=700;Game.TieredUpgrade('Classical periodic table','<q>Having 118 different elements is far too many, and it overcomplicates the ancient alchemical process far too much! By instead going back to a traditional set of elements - water, fire, earth and air, we can cut a lot of nonsense out of the whole equation.</q>','Alchemy lab','mnt25');
        order=800;Game.TieredUpgrade('Liquid portals','<q>Just be careful not to spill any on the carpet, they\'re a pain to clean out and leave a pale mark even when you do get it out.</q>','Portal','mnt25');
        order=900;Game.TieredUpgrade('Precookie','<q>Sickening as it may be to think of, there was a time before cookies. Perhaps we can introduce these savages to the way of a cookie-based life, and hopefully speed up the baking process a few millenia.</q>','Time machine','mnt25');
        order=1000;Game.TieredUpgrade('Ana and kata spin quarks','<q>Where are these ones even going?</q>','Antimatter condenser','mnt25');
        order=1100;Game.TieredUpgrade('Guiding beacons','<q>Show the way through the darkest nights, beaming a pillar of light into the sky, setting fire to everything within a 10 mile radius.</q>','Prism','mnt25');
        order=1200;Game.TieredUpgrade('Atomic alignment','<q>Woops, your atoms aligned perfectly with the chair you were sitting on and you managed to fall through it. What are the chances of that? Not low enough! Try doing it again and make more cookies using it.</q>','Chancemaker','mnt25');
        order=1300;Game.TieredUpgrade('The normal layer','<q>In every fractal there\'s a layer where you enter from and then start delving infinitely downwards or ascending infinitely upwards. Turns out our universe was about 17,206 layers below the normal layer of the infinitely many nested universes. How about we shuffle this entire operation up to that layer to assert dominance over all other other layers?</q>','Fractal engine','mnt25');
        order=1400;Game.TieredUpgrade('Game.Earn()','<q>Supposedly this is what your javascript consoles have been using to make cookies this entire time? You have it now, which is neat, maybe you\'ll use it as a paperweight.</q>','Javascript console','mnt25');
        order=1500;Game.TieredUpgrade('Indirect takeover','<q>Remember the part of needing to take over universes lest they get the same idea and take over yours? Well it turns out some of them had already begun taking over other universes to increase their production - thankfully never coming across your own universe. But thanks to them, after your own invasion is completed you now have their hundreds of universes free for the taking without any of the effort you would\'ve needed.</q>','Idleverse','mnt25');
        order=1600;Game.TieredUpgrade('Lightbulbs that go ding','<q>An imperative part of every good idea.</q>','Cortex baker','mnt25');
        order=1700;Game.TieredUpgrade('Parent of all','<q>Just think of how many lives you\'ve touched by a simple goal of baking cookies. People getting together to share some of your cookies, two people going on a date to bake one of your recipes, or just someone eating your cookies when they\'re in a slump to help them feel better. Your influence extends to billions of people you will never even meet. There are people alive today who exist because your cookies either brought their parents together, or kept their head above water. In this way, you are responsible for the lives of so many people beyond yourself and your clones.<br>It\'s a touching thought, and more importantly it\'s fertile ground for more advertising slogans.</q>','You','mnt25');

        order=200;Game.TieredUpgrade('Aching backs','<q>The hallmark of getting old. No matter what you do it always seems to persist; an endless thorn in your a-bit-to-the-left-of-side.</q>','Grandma','mnt26');
		order=300;Game.TieredUpgrade('Microbiome gardens','<q>Your body is a wonderful thing! Inside it are pockets of microorganisms which sustain their entire life cycle off your guts! Using a similar principle, it\'s possible to grow a garden inside someone too! The water and nutrients are already things people consume, and if they could honestly stop being so selfish and share some of those vital nutrients, then a garden can flourish inside themselves! Some may call it parasitism, but you prefer calling it "heavily favoured on one side mutualism", the extra words make it sound cool.</q>','Farm','mnt26');
		order=400;Game.TieredUpgrade('Toothpicks','<q>Good for getting those last few cookies crumbs out of your teeth and into your stomach.</q>','Mine','mnt26');
		order=500;Game.TieredUpgrade('Sentient robots','<q>I\'ve never read any novel where this was a mistake!</q>','Factory','mnt26');
		order=525;Game.TieredUpgrade('ATM machines','<q>Now your automatic teller machines have machines to operate for them! Linguists everywhere confused!</q>','Bank','mnt26');
		order=550;Game.TieredUpgrade('Smarter pressure plates','<q>No more can your temple treasure security measures be fooled by quickly swapping out an idol with a bag of sand. These electronic pressure plates will notice the err of weightlessness and activate all nearby traps instantaneously!. Is it out of spirit for a plundering adventurer? Maybe, but you\'ve got investors to please!</q>','Temple','mnt26');
		order=575;Game.TieredUpgrade('Advanced domestic convenience items','<q>They work like magic, with magic!</q>','Wizard tower','mnt26');
		order=600;Game.TieredUpgrade('Shooting stars','<q>Blast those things out of your flight path! You have right of way and the shipment is already running 2 minutes late.</q>','Shipment','mnt26');
		order=700;Game.TieredUpgrade('Mercury swimming pools','<q>Your alchemists have grown so tired of the constantly changing psuedo-scientific landscape and requested for a few days off. They want to reduce your profit margins by resting? Fine! Give them this lovingly created pool where they get to relax, bathe in the sun, and dip in the highly toxic, metallic liquid.</q>','Alchemy lab','mnt26');
        order=800;Game.TieredUpgrade('I\'m everywhere!','<q>What idiot spilt a liquid portal while someone was inside it! Now their being is everywhere! Ugh! Someone grab a mop and hopefully we can put them back together again.</q>','Portal','mnt26');
        order=900;Game.TieredUpgrade('Local time manipulation','<q>The amount of focus you\'re giving something tends to influence how long it feels like it\'s taking. Abusing this fact results in you having the ability to shift and warp time whenever you feel like it! Stuck in a boring business meeting? Engage critically and it\'ll be done lickity split! Having a grand time hearing crowds of people chant your name? Become as bored as possible and it\'ll seem to last forever. This is quite adverse to what you would usually want to be doing in these situations but hey, it\'s your time, spend it how you wish.</q>','Time machine','mnt26');
        order=1000;Game.TieredUpgrade('Baryon asymmetry explanation','<q>Just because.</q>','Antimatter condenser','mnt26');
        order=1100;Game.TieredUpgrade('Darkening flashlights','<q>Our eyes do this funny thing where if something is extremely bright, everything around it goes dark. These flashlights are so powerful, that turning one on turns off the light everywhere else in the universe. The screaming can be heard no matter where you are but at least it makes you the coolest one at the campsite.</q>','Prism','mnt26');
        order=1200;Game.TieredUpgrade('Bribing fate','<q>A little under the counter passing of dough only ever weighed the odds dramatically in your favour.</q>','Chancemaker','mnt26');
        order=1300;Game.TieredUpgrade('Words in words','<q>Mathematicians hate him! Create infinite recursion with this one simple trick! Simply take your word, and have that word inside of it!<br>Endless fractal engine synergy upgrades await!</q>','Fractal engine','mnt26');
        order=1400;Game.TieredUpgrade('Standardized coding','<q>All function names must be camelCased, don\'t put any non-essential functions in the global namespace, put spaces before and after equal signs, and don\'t run code by the pool lest you want to fall in.</q>','Javascript console','mnt26');
        order=1500;Game.TieredUpgrade('Beta universes','<q>Inside each universe, may exist a so-called "beta" universe, where more recent advancements in production may be found. Normally those items would be trapped inside the beta, but with some careful drilling and a spoonful of sugar, you can push all those items into the main universe branch, nearly doubling the amount of items you can convert into cookies!</q>','Idleverse','mnt26');
        order=1600;Game.TieredUpgrade('Brain washing','<q>Got to keep those pink cushions clean with all that space debris floating about. Just make sure to vacuum inbetween the folds as well... hey would you look at that! A nickel, nice!</q>','Cortex baker','mnt26');
        order=1700;Game.TieredUpgrade('The real you','<q>Having an army of clones walking around means some people have confused them for yourself! I mean they are yourself, but I\'m talking about <b>you</b> yourself, like who you\'ve been this entire time. Ack! Do you see the issue? People can\'t tell which one is the real you, and which one is a clone, so we\'re stamping on a small checkmark with a branding iron just above your hip which verifies that you are the real you. Could a clone theoretically grab a similar branding iron and do the same? Maybe, but thanks to the tracking chips installed in all of them you can spot this happening and punish them appropiately.</q>','You','mnt26');

        order=200;Game.TieredUpgrade('New fangled technology avoidance schemes','<q>All this new fancy tech you\'ve been installing around your cookie production chains have been rather confusing and stressful for your grandmas to keep up with. This new scheme allows your grandmas to still spend the last years of their life baking delicious cookies for <b>you</b>, while avoiding anything they hadn\'t interacted with before the age of 39.</q>','Grandma','mnt27');
		order=300;Game.TieredUpgrade('Organ crop harvesting','<q>Remember the microbiome gardens from the last upgrade? Well you forgot one part of it - actually harvesting the crops grown inside someone. No worries! You\'ll just need to pay for some anaesthesia and a few doctors, or at the very minimum tell them you\'re going to do that before kidnapping them in the dead of night and doing it yourself. The latter does save quite a bit of money!</q>','Farm','mnt27');
		order=400;Game.TieredUpgrade('An eggplant','<q>One of your miners threw this at you for some reason, you managed to catch it instead but something about it seems incredibly magical. Regardless of that, you reckon it would taste delicious when baked into a cookie.</q>','Mine','mnt27');
		order=500;Game.TieredUpgrade('Work from home','<q>Have some of your workers take some of the factory home with them, now they can never escape! Even the walls of their own home isn\'t enough to protect them from the grinding, menial, depressing sludge that is working in your factories.</q>','Factory','mnt27');
		order=525;Game.TieredUpgrade('Chocolate cheques','<q>Immediately null and void upon any bite being taken out of them. Hope you don\'t miss that extra $10 million!</q>','Bank','mnt27');
		order=550;Game.TieredUpgrade('Minotart','<q>A most horrible beast filled with the most dastardly fillings, covered in a crisp and golden pastry layer, it roams your labyrinthian temples in search for any fool who dare invade. Let\'s just hope the noble citizens you cast into those temples as sacrifice don\'t immediately swarm and eat it.</q>','Temple','mnt27');
		order=575;Game.TieredUpgrade('Fanciful entrances','<q>Makes all your business meeting entrances that much more exciting. Poof! First you\'re not there, then a cloud of cough-inducing smoke appears, and then you\'re there!</q>','Wizard tower','mnt27');
		order=600;Game.TieredUpgrade('Timey wimey shenanigans','<q>As you approach the speed of light, you percieve time much slower than it actually passes. Get your rockets as close to that speed as you legally can and it\'ll seem like your packages deliver instantaneously!<br>...At the cost of your crew missing their children growing up and learning to live without their parents, but you are consumer first after all!.</q>','Shipment','mnt27');
		order=700;Game.TieredUpgrade('Leaded petrol','<q>Why was this ever phased out? Using it makes all your engines run squeaky clean and barely use any fuel! Honestly what the people who came before you were thinking, hah! What idiots.</q>','Alchemy lab','mnt27');
        order=800;Game.TieredUpgrade('Unspeakable acts','<q>Never mention these again.<br>Not that you could, since they use sounds that would make your tongue bleed if you tried saying them.</q>','Portal','mnt27');
        order=900;Game.TieredUpgrade('The future is now','<q>Steal scientific developements from your future self and bring them back to the present!<br>Does it count as theft if it violates every law of causality?</q>','Time machine','mnt27');
        order=1000;Game.TieredUpgrade('Entropy mixing','<q>If ever your universe seems to be gaining entropy, go to the center of it and give it a good stir with a giant wooden spoon. That should get the particles rearing and racing again, and you\'ll delay the heat death of the universe by a few millenia.</q>','Antimatter condenser','mnt27');
        order=1100;Game.TieredUpgrade('Disco floorboard','','Prism','mnt27');
        if (EN)
		{
			Game.last.descFunc=function(){
                Math.seedrandom(Game.seed+'-'+Math.floor(Game.realT*0.05));
				var str = '';
                var width = 30;
                var height = 5;
                for (var y = 0; y<=height; y++) {
				    for (var x = 0; x<=width; x++) {
                        var isLit = Math.random()<0.5
                        str += (isLit?'<b>':'') + '0' + (isLit?'</b>':'');
                    };
                    str+='<br>';
                };
                Math.seedrandom();
                return this.desc+'<q style="font-family:Courier;">'+str+'</q>';
			};
		}
        order=1200;Game.TieredUpgrade('Cross your self','<q>Cross as many parts of your body for extra luck - fingers, toes, feet, eyelids, ears, heart, nose, arm, kidney, intestines, ossicles, stomach hair, lips, torso, thigh, muscles, nipples, lungs - you name it, cross it.</q>','Chancemaker','mnt27');
        order=1300;Game.TieredUpgrade('Fractal department walls','<q>In an attempt of self-serving satisfaction, your fractal department designed their building such that they have a finite floor plan, but an infinite perimeter. So far they\'ve been working without any walls - just a floor and ceiling, as the cost to build an infinite amount of drywall was far too expensive at the time. Purchasing this upgrade should just about cover the cost of it though, and you can finally rid those endlessly unfolding angry letters your fractal scientists keep sending your way.</q>','Fractal engine','mnt27');
        order=1400;Game.TieredUpgrade('Untangleable cords','<q>At long last, your wiring nightmare is over! The wireberg in your server room had gotten so large that the wires in the centre had overheated and fused into one another. You could of course, just go wireless, but that takes the last bit of blue collar fun out of programming doesn\'t it?</q>','Javascript console','mnt27');
        order=1500;Game.TieredUpgrade('Things are subject to change','<q>Some of the beta universes contain ridiculously overpowered and broken ways of producing an item, and with your universal converters, this just means more cookie production! No wonder these things stayed in beta!<br>Just pray the one in charge of updating the beta doesn\'t come back from their holiday...</q>','Idleverse','mnt27');
        order=1600;Game.TieredUpgrade('Writing down good ideas','<q>Who knows how many brilliant ideas you or your cortex bakers have had in the past which are now permanently lost due to being forgotten. The mark of stone from a pencil dragged across paper is a lot harder to forget than some airy electrons bouncing back and forth a flesh calculator.</q>','Cortex baker','mnt27');
        order=1700;Game.TieredUpgrade('The genuine you','<q>The last upgrade verified that you are the real you compared to all your clones. But who <b>is</b> you? Your sense of self and granduer extends throughout many solid assets throughout your business, you need countless secretaries and applications in order to keep memory for you, you even have a scribe who writes your words for you. So who are you? Where do you begin and something else start? Is your stapler part of you? You like it quite a lot and you would be sad if someone replaced it, so is it part of you? What about your clothes? You didn\'t design them; they\'re someone elses success, can you really call them yourself? Could you hide behind their success as a representation for yourself? The way you act when talking to publicists and during interviews - is that the real you talking? The genuine you? When was the last time your genuine self said anything? Are they still there?<br>These questions are quite a lot, maybe if you self isolate for a while you\'ll find your genuine self again - take a break from all this cookie stuff and go and find them, talk to them, see how they\'re holding up. They\'ll thank you later.</q>','You','mnt27');

        order=200;Game.TieredUpgrade('Cooking with your grandma','<q>It\'s really nice honestly! You should try it, good quality time spent together that at least you\'ll remember.</q>','Grandma','mnt28');
		order=300;Game.TieredUpgrade('Necrosol','<q>Isn\'t it so selfish that some people think they get to take up precious real estate being buried in the ground? That\'s potential room for your acres of farming they\'re taking up! Though the soil may be slightly toxic, the natural compost a decomposing body provides more than makes up for it. And if the dead ever come back to life against your wishes, then supposedly an armadda of plants is well suited to deal with such an event*.<br>*Provided the dead walk conveniently slowly enough that hurling peas at them is enough to break apart their flesh and bone.</q>','Farm','mnt28');
		order=400;Game.TieredUpgrade('Fool\'s gold rush','<q>Dissapointed with the enthusiasm your miners have for being sent miles under a planet\'s crust to dig in dimly lit caves for hours on end, you decide to sneakly hide about $2000 dollars worth of gold in nearby caves. Then, you put up an announcement that gold has been found in your mines. One thing leads to another and boom! Millions of fools eagerly increase the efficiency of your mining operation just to get their hands on some gold! Just make sure not to tell them that gold is only really worth transmuting into a cookie, and that you\'ll make 300,000 times the profit of the gold just by their mining efforts alone.</q>','Mine','mnt28');
		order=500;Game.TieredUpgrade('Pastrypunk','<q>A new hip and trendy form of historical fantasy where the world is powered by pastries. Little do they know the world has been powered by pastries for a long time, but let\'s let them have their blind fun - it\'ll further distract them from yourself and everything you\'ve done.</q>','Factory','mnt28');
		order=525;Game.TieredUpgrade('Free market','<q>You\'re telling me this entire time the market was free? Sure! Let\'s buy it! That\'s sure to give us some more power of the economy.</q>','Bank','mnt28');
        order=550;Game.TieredUpgrade('Ark of the ovenant','<q>A sacred and immensely sought-after oven which legends tell of having the power to roll out mountains of dough and lay waste to any that oppose it. Just opening the door is enough to melt the flesh of anyone nearby, and someone trying to touch it without oven mits causes them to transform into a pile of flour. It is not of this earth, but the cookies you could bake with it makes all the risks worth it in your mind.</q>','Temple','mnt28');
		order=575;Game.TieredUpgrade('Holograms','<q>For all future announcements regarding your bakery, project yourself high and mighty! Bare your proud visage across every bit of land that knows of your cookies, and loudly orate every single one of them as if they were your subjects! May they see your face and cower from the wealth and power you hold. Be an imposing figure who can shift the tidal forces of the universes just to bake more cookies. They will hear your voice and weep!</q>','Wizard tower','mnt28');
		order=600;Game.TieredUpgrade('Space debris shell','<q>Okay so, so far whenever your spacecraft has gone kaput, you\'ve just left it there to float in orbit indefinitely. Problem is, the atmosphere is now so full of space debris that it\'s formed a complete shell around the earth. This has grounded all your shipments and the lack of natural light is harming your farm and prism cookie production. But don\'t panic! By kamikazing a few rockets, we can blast holes in the shell that\'ll allow traffic to flow through again. Does this create more debris which will need to be blasted away again? Yes but that\'s a future you problem, there\'s nothing more permanent than a temporary solution of course!</q>','Shipment','mnt28');
		order=700;Game.TieredUpgrade('Periodic tablecloth and legs','<q>What kind of table doesn\'t have legs and a nicely sewn tablecloth strewn over it?</q>','Alchemy lab','mnt28');
        order=800;Game.TieredUpgrade('Moving portals','<q>Scientifically violating and theoretically confounding. Now you can find out what REALLY happens if you throw one on top of a cube.</q>','Portal','mnt28');
        order=900;Game.TieredUpgrade('The time of your life', '<q>You\'ve had it, you\'ve earned it, all in the name of baking cookies of all things.<br>What a strange use of time.</q>','Time machine','mnt28');
        order=1000;Game.TieredUpgrade('Cookie mutations','<q>Some of the cookies exposed to your antimatter condensers have been infected with the everflowing radiation coming out of them and begun to mutate. While most people would consider this a health hazard and prompty recall all cookies produced by antimatter condensers, you\'re an oppurtunistic go-getter who would rather call it "surprise flavourings". A few extra choc-chips, a smaller cookie growing out as a tumor, some of the cookie being transformed into living, moving flesh - all exciting new surprises your customers can find when they open a blind box containing your new "mutant cookie" line of cookies. Any secondary radioactive poisoning or mutiliation by the hands of a rabid cookie can be safely brushed under the rug with the fine print on the back of every box voiding your responsibilities. Hey they\'re "surprise" cookies! Even we aren\'t sure what they\'re capable of!</q>','Antimatter condenser','mnt28');
        order=1100;Game.TieredUpgrade('Future light','<q>Travel into the furthest reaches of space and you\'ll be catching light that was emitted from the very conception of the universe, go the other way and you can catch light that hasn\'t even begun to form! What you have here is physical divination, grab a crystal ball and set up your own fortune caravan!<br>Really this should\'ve been a synergy upgrade but pah, it\'s more fun to dress up like a fortune teller and gaze through crystal balls.</q>','Prism','mnt28');
        order=1200;Game.TieredUpgrade('Stay up all night','<q>To get lucky of course, why else would you do so?</q>','Chancemaker','mnt28');
        order=1300;Game.TieredUpgrade('The weight of a cookie','<q>There are many ways to bake a cookie: a little bit more sugar here, waiting a bit longer before putting in the butter in there, a few more minutes in the microwave, etc, etc. The many different methods to bake a cookie stretches on infinitely, so many tiny decisions which greatly affect the final product, allowing you to make adjustments upon adjustments upon adjustments until you bake a cookie that is perfectly suited for your tastes. Like life itself, the graph of all possible choices in the baking process extends and multiplies far beyond what you can even begin to fathom, like an endlessly extending tree with forever duplicating branches. Every different baking recipe is a single path from trunk to leaf on that tree, how many of those recipes do you think you\'ve baked so far? Every new ingredient you collect further extends the possibilities exponentially with every other method and ingredient you could possibly incorporate - that is even if you finish baking! Continually adding ingredients and combining different methods further extends the branch of the tree you\'re exploring forever and then some! The mere act of baking a cookie is planting a seed with a set of outcomes greater than anything the universe could manage before it.<br>And you thought your life was complex!</q>','Fractal engine','mnt28');
        order=1400;Game.TieredUpgrade('Library of babel', '','Javascript console','mnt28');
        if (EN)
		{
			Game.last.descFunc=function(){
                Math.seedrandom(Game.seed+'-'+Math.floor(Game.realT*0.01));
				var str = '';
                var characters = [' ', ',', '.', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
				for (var i = 0; i<=40; i++) str+=characters[Math.floor(Math.random()*29)];
                Math.seedrandom();
                return this.desc+'<q style="font-family:Courier;">'+str+'</q>';
			};
		}
		else Game.last.desc='<q>-</q>';
        order=1500;Game.TieredUpgrade('Productive procastination','<q>The people who come to an idleverse seem to be the type putting off another activity, the way of idling is attractive for them - you do nothing and make progress towards some arbitrary goal. Despite the ultimate goal of every idleverse being to make a single number go up, and this number having 0 benefit to their other responsibilities and desires, they will idle for hours on end to see that number get as big as possible.<br>It may sound depressing, but the joy of life is in the struggle is it not?</q>','Idleverse','mnt28');
        order=1600;Game.TieredUpgrade('Medulla nebulas','<q>The cosmic dust which is the very essence of brain. Over thousands of years it condenses into a sentient cortex baker, but that\'s far too slow for your pastry operation! Grab some of it and pump out those cortex bakers like there\'s no tomorrow!</q>','Cortex baker','mnt28');
        order=1700;Game.TieredUpgrade('YOUrion constellation','<q>Some rogue clone has gone and stuffed themselves in a printer to make paper clones of themselves. While it\'s a cool science fiction plot, the paper clones actually look rather realistic, and now they\'re out causing mischief. To stop this, you\'ve installed these on every clone - small, almost invisible, yellow dots in the style of the orion constellation that appear on the skin of a clone. Any printer will be able to see these dots and will now refuse to copy that clone, additionally saving a fortune on printer ink.</q>','You','mnt28');

        order=200;Game.TieredUpgrade('Rose-tinted glasses','<q>The past ain\'t what it used to be.</q>','Grandma','mnt29');
		order=300;Game.TieredUpgrade('Freaks of nature','<q>Is what you\'re doing still farming? After countless genetic modifications and crimes against the natural order, could you still call what you\'re doing natural? Or has it crossed that boundary and entered the realm of frankenstinian monsters; tortured living beings that you grossly misshapen and deform to maximise harvests. We\'re asking because we need to know what to declare it as in the audit report, the morals of what you\'re doing don\'t phase you at all at this point.</q>','Farm','mnt29');
		order=400;Game.TieredUpgrade('Rock bottom','<q>In any other business, this would be a horrible thing, but we\'ve already defied several logical conclusions at this point, what\'s to one more? Because you are currently at rock bottom, it means everything from here is on the up and up! No matter how hard you try or what you do, things will never get worse than they are now - and things right now are incredible! So take this with pride, knowing that no matter what you do, today is the worst day of your life.</q>','Mine','mnt29');
		order=500;Game.TieredUpgrade('Never-sounding whistles','<q>You\'ve installed these whistles as a part of a little con on your workforce - usually a whistle sounds the end of every work shift, and workers are not permitted to leave their workstations until that whistle is sounded. So why not keep those suckers at it and just never sound the whistle? Not only does it keep production up, but they\'ll never be allowed to leave to complain about it either!<br>That is, unless they like the sound of being fired <small>(in a kiln)</small>.</q>','Factory','mnt29');
        order=525;Game.TieredUpgrade('The ungrateful public','<q>Some of those ignorant twits think they know more than you do and are calling for a reduction of your wealth and power. Do they not know what you provide for them? You\'ve provided millions, nay- BILLIONS of jobs and have been the driving force behind thousands of scientific advancements - the first contact and civilization of aliens was done by your will! You\'ve constructed entire megacities of infastructure and leisure spaces, all of the most awe-inspiring and beautiful buildings were made in your honour. Heck! Just the impact you\'ve had on the economy and the tide of change you\'ve had on human history, you\'re something to marvel at! An entrepreneur of entrepreneur. Yet they winge and complain and dare BITE the hand which feeds them... honestly it\'s a dissapointment that these are the people which salviate upon your product.<br>And yet, despite their anger, they\'ll still buy it anyway.</q>','Bank','mnt29');		
		order=550;Game.TieredUpgrade('Crusades','<q>For all the followers of the religion created by your cookie temples, the devotion and reverence towards your cookies is a cornerstone of their entire life. We can abuse this! Call a competing business a threat to their god and have them tear it to shreds! Or better yet - have them invade non-cookie based regions to spread the good cookie, destroying anyone who tries to oppose.<br>Who cares if this is a monstrous abuse of trust and against every principle of the faith? You need to get those profits up!</q>','Temple','mnt29');
		order=575;Game.TieredUpgrade('Too much of a good thing','<q>The over abundance of magic in the world has caused it to lose quite a lot of the, for the lack of a better term, "magic", it used to have. Don\'t you think? We need to return magic back to being arcane and illusive, a dark secret only known by elderly folks weighed down by lengthy beards and flowing robes, not given out to children under the age of 12! Slap an age-requirement on all future witches and mages then tell tales of the grand power magic can give to all the children across the world. That ought to increase the prominence of tasseomancy quite a bit.</q>','Wizard tower','mnt29');
		order=600;Game.TieredUpgrade('Independent inventions','<q>Even in your vast, technologically-advanced, cookie-based society, traffic still poses an issue, and opening 18 more lanes did not help. The mile long stretches of flying cars are slowing down your deliveries drastically! How about we do away with the whole thing entirely? Have all transport - for person or object - be done by your fleet of shipments. No need for gridlocks when everyone is on the same rocket! And maybe we can even have double-decker shipments- busses. We\'ve reinvented busses. Busses that can fly. Oh wait that\'s just called an aeroplane. So we\'ve reinvented the aeroplane.<br>Oh well! At least they have piles of cookies that can be served to guests which are sure to get a few more customers on board.</q>','Shipment','mnt29');
		order=700;Game.TieredUpgrade('After dark lockdowns','<q>Some scum rebel alchemists have been sneaking back into the alchemy labs late at night and transmuting to gold into- gasp! Food other than a cookie! This vile betrayal from the old masters cannot continue - and cannot go unpunished! We\'re sure you\'ve got plenty of fun ideas on how to teach those no-good-doers a lesson or two, so how about we take care of the after dark break ins? From now on, all alchemy lab entrances lock after working hours, and must require a tongue scan for two reasons: 1. To verify the identity of, and ensure that the person scanned works in that alchemy lab. And 2. To detect any traces of non-cookie substances on their taste buds. Any who are found guilty of the latter are fortunately in a rather vulnerable position - having their tongue inside a scanner and all - so punishment is very easy to dish out.<br>The effects of these changes were very succesfull, and you managed to crack down on an entire operation of non-cookie based product pirates! Every single member of the operation has now been made an example of to ensure that anyone who thinks about betraying your operation, know the consequences of doing so.</q>','Alchemy lab','mnt29');
        order=800;Game.TieredUpgrade('Madder than mad','<q>Your portals contain sights, sounds and experiences which cause a regular human being to go utterly insane; screaming on about screenbats and churn flecks and mysterious old women trying to guide them through fog only to fall into punji sticks instead. With every passing day, your portal networking terminal seems grow more and more delusional, and you think it\'s surpassed what the other side of a portal does to someone, and begun to affect you. Just the other day, someone from your antimatter condenser laboratories started exhibiting similar catatonic symptoms, and last month, a whole crowd of people who had just tried your cookies were endlessly dancing for weeks in a sudden bout of mass hysteria. More permanent cracks in your brain are beginning to form, hallucinations of mice stealing your cookies permeate the corner of your eye. You\'ll go on mad tyrades at anyone who enters your office. And the paintings decorating your home have begun to take on a more ghastly and demented appearance. Perhaps this is it, perhaps you\'ve finally gone madder than madness incarnate. When you visit your portals now, perhaps they\'ll start bowing down to you.<br>Long live the mad king who rules with an oven mit.</q>','Portal','mnt29');
        order=900;Game.TieredUpgrade('Do it all again', '<q>What\'s stopping you from beginning all over again? I\'m not talking about any ascending or rebirth silliness, no I mean seriously starting all over, from 0 - your first sheet of cookies getting thrown in the garbage. Imagine being able to retrace every step and action you ever took, and do it for the second time. Or would you do it the same way at all? What if instead of grandmas you chose chefs instead? What if instead of cosmic expansion you went more psychological? Heck - what if you baked muffins instead of cookies? Okay maybe not that last one, but it\'s an interesting thought. Point is: You could do this whole thing over and over through the power of your time machines, play an infinite game for an infinite amount of lifetimes. You would never have to confront your own mortality, or the fact that making new expansions to cookie clicker takes time, and will one day end... Would you do it all again? Something tells me you wouldn\'t, getting here was exhausting as is. But maybe... just maybe... it\'ll be fun to feel the pace of progress again.<br>Come on, what\'s one more lifetime of cookies?</q>','Time machine','mnt29');
        order=1000;Game.TieredUpgrade('Lawyer of thermodynamics','<q>Congratulations! You get to make decisions on what new laws of thermodynamics get passed, and make changes to the existing laws! How you managed this isn\'t entirely clear - some ultrabeings from the creation of the universe had to use their connections to get your approved - but you did it!</q>','Antimatter condenser','mnt29');
        order=1100;Game.TieredUpgrade('Baking trays with lasers','<q>Not for any laser-based thermometer readings, but purely because lasers make everything 100x more awesome than before.</q>','Prism','mnt29');
        order=1200;Game.TieredUpgrade('Positivity bias','<q>Was it just me, or did you scratching your left temple after eating a clam cookie just make more cookies randomly appear? The realm of unknowingly lucky patterns is a strange and claustraphobic one, but play into your superstitions! Do as many inane acts as possible which increase the power of luck on your consciousness! Walk around a table leg and blow saw dust into the eyes of a saintly trilobite! Feed your sulphuric roosters shredded grass! Upon the dawn of the first star in the sky, quitely recite the entirety of an ancient poem while standing on one hand! If your luck doesn\'t seem to increase, try doing them again! Through the power of positivity, anything can make you more lucky!</q>','Chancemaker','mnt29');
        order=1300;Game.TieredUpgrade('A game of cookie clicker','','Fractal engine','mnt29');
        if (EN)
		{
			Game.last.descFunc=function(){
				var n=35;
                var i=Math.floor(Game.realT*0.1);
				var str = ' in cookie clicker in cookie clicker in cookie clicker';
				return this.desc+'<q>Would you look at that, there\'s the entirety of cookie clicker located inside this upgrade! And hey! This upgrade is inside of it too! Meaning you\'re able to play cookie clicker in cookie clicker in cookie clicker! And hey! This upgrade is inside of that one too! Meaning you\'re able to play cookie clicker in cookie clicker in cookie clicker in cookie clicker! And hey! This upgrade is inside of that one too! Meaning you\'re able to play<br><span style="font-family:Courier;">'+(str.substring(i%str.length,i%str.length+n)+(i%str.length>(str.length-n)?str.substring(0,i%str.length-(str.length-n)):''))+'</span>!</q>';
			};
		}
		else Game.last.desc='<q>-</q>';
        order=1400;Game.TieredUpgrade('Turing complete','<q>Congratulations! Your cookies are turing complete. Any system you can dream of your cookies can perform, this leads to a wide array of vulnerabilities which you\'ll now need to patch out of every further batch you make. But on the plus side, they can run DOOM!</q>','Javascript console','mnt29');
        order=1500;Game.TieredUpgrade('Cross-compatable play','<q>With new advancements in networking, completely unrelated idleverses are now able to share upgrades and buildings across the metacosmic border, dramatically increasing the amount of items they can produce. Just mix-n-match which upgrades you feel work best with each idleverse and it\'ll all work out in the end. Want the slimy mouse simulator "Fluerescent goo" upgrade to work with the upside-down bovine clicker\'s boomerang smiths? Can do! Want the space shuttle experience "Enhanced quantum asteroid mining synergy" upgrade in pixie dream land idle? Go right ahead!<br>Obviously we\'d never share any upgrades into our universe though, that would be far too savage.</q>','Idleverse','mnt29');
        order=1600;Game.TieredUpgrade('It\'s all in your head','<q>Oh wow! Would you look at that, all your problems disappear when you put it like that.<br>Actually on second thought that makes it dramatically worse, as your brain is literally who you are.</q>','Cortex baker','mnt29');
        order=1700;Game.TieredUpgrade('Family photo','<q>D\'awwww, isn\'t you and your legion of clones so sweet when they\'re all bunched up on the one couch. You even managed to squeeze your actual family from way back at the beginning of this whole thing on there too! Sigh... how far you\'ve come.<br>We\'re all so proud of You.</q>','You','mnt29');

        var upgradeWordCount = 0;
        var upgradeLongestCount = 0;
        var upgradeLongest = 0;

        var countWords = function(str) {
            return str.split(' ').length;
        };

        for (var i = startOfModNum; Game.UpgradesById[i] != undefined; i++) {
            var upgrade = Game.UpgradesById[i]
            mod.modUpgradeList.push(upgrade.name);
            upgradeWordCount += countWords(upgrade.name);
            var quote = upgrade.baseDesc.match(/<q>(.*?)<\/q>/i); //get quote section
		    if (quote) {if (countWords(quote[0]) > upgradeLongestCount) {upgradeLongest = upgrade.name; upgradeLongestCount = countWords(quote[0]);} upgradeWordCount += countWords(quote[0])};
        };

        /*console.log('Upgrade total: '+ mod.modUpgradeList.length);
        console.log('Total upgrade word count: ' + upgradeWordCount);
        console.log('Average upgrade word count: ' + (upgradeWordCount/mod.modUpgradeList.length));
        console.log('Longest upgrade description word count: ' + upgradeLongestCount);
        console.log(upgradeLongest);*/

        // New milk
        mod.addMilk('Almond milk',25);
        mod.addMilk('Olive milk',26);
        mod.addMilk('Sultana milk',27);
        mod.addMilk('Kiwi milk',28);
        mod.addMilk('Rambutan milk',29);
        mod.addMilk('Apple milk',30);
        mod.addMilk('Carrot milk',31);
        mod.addMilk('Papaya milk',32);
        mod.addMilk('Chilli milk',33);
        mod.addMilk('Cantelope milk',34);
        mod.addMilk('Tomato milk',35);
        mod.addMilk('Avacado milk',36);
        mod.addMilk('Ginger milk',37);
        mod.addMilk('Potato milk',38);
        mod.addMilk('Juniper milk',39);
        mod.addMilk('Egg milk',40);
        mod.addMilk('Apricot milk',41);
        mod.addMilk('Plum milk',42);
        mod.addMilk('Garlic milk',43);
        mod.addMilk('Grape milk',44);
        mod.addMilk('Sap milk',45);
        mod.addMilk('Aloe milk',46);
        mod.addMilk('Pea milk',47);
        mod.addMilk('Pear milk',48);
        mod.addMilk('Pumpkin milk',49);
        mod.addMilk('Eggplant milk',50);

        // New achievements
        var startOfModNum = Game.AchievementsN;

		mod.bankAchievement('Choc-a-block');
		mod.bankAchievement('Tray to the cause');
        mod.bankAchievement('All pile on!');
        mod.bankAchievement('How hungry were you before this?');
        mod.bankAchievement('Mega maw');
        mod.bankAchievement('Air in the stomach could be a cookie');
        mod.bankAchievement('There are more of your cookies than there are atoms in the universe', 'Although your cookies account for the vast, vast majority of those atoms.');
        mod.bankAchievement('Just a few more and you\'re done');
        mod.bankAchievement('You\'re not done');
        mod.bankAchievement('Smaug\'s hoard');
        mod.bankAchievement('Hunger is cookies leaving the body');
        mod.bankAchievement('The dams are about to break');
        mod.bankAchievement('The dams broke!');
        mod.bankAchievement('Endless supply and demand');
        mod.bankAchievement('Densely packed');
        mod.bankAchievement('There are cookies in our bloodstream');
        mod.bankAchievement('More than 2');
        mod.bankAchievement('Eat \'em up, eat \'em up');
        mod.bankAchievement('Hunger? What\'s that?');
        mod.bankAchievement('Recipe serves 1 to 1 Tretrigintillion people');
        mod.bankAchievement('Our giants are made of dough and choc-chip');
        mod.bankAchievement('Neverending feast');
        mod.bankAchievement('The hand that feeds everything');
        mod.bankAchievement('Cookiecopia');
        mod.bankAchievement('Cookies as far as the eye can see');
        mod.bankAchievement('Enough caloric energy to imitate the big bang');
        mod.bankAchievement('Only as a treat');
        mod.bankAchievement('Om nom nom');
        mod.bankAchievement('You stop making cookies and half of the galaxy\'s life dies');
        mod.bankAchievement('Still have room for dessert?');
        mod.bankAchievement('This is getting a bit silly');
        mod.bankAchievement('Who keeps track of all these cookies?');
        mod.bankAchievement('Cookies will live on after we\'re gone');
        mod.bankAchievement('Heat death is just a big baking oven');
        mod.bankAchievement('Why did we start this thing again?');
        mod.bankAchievement('All we\'ve ever known is cookies');
        
        mod.cpsAchievement('Faster than a speeding bullet');
		mod.cpsAchievement('Tidal wave');
        mod.cpsAchievement('Assuming each cookie has 200 calories in it, each cookie produced gives 836.8 joules of energy. Baking 1 novemdecillion cookies per second results in the creation of over 836.8 nonillion quettajoules of energy every second. For reference, the sun, in it\'s entire life span, will only ever create 120 trillion quettajoules of energy.', 'By your bakery alone, the power of the sun is a mere grain of sand compared to your desire to make cookies');
        mod.cpsAchievement('1000-carriage gravy train');
        mod.cpsAchievement('Highway to your mouth');
        mod.cpsAchievement('Coming out of the walls');
        mod.cpsAchievement('Pouring out of your ears');
        mod.cpsAchievement('Say when');
        mod.cpsAchievement('I need it now!');
        mod.cpsAchievement('Open your jaw and let the cookies pour in');
        mod.cpsAchievement('More than we can manage');
        mod.cpsAchievement('On your marks, set, go!');
        mod.cpsAchievement('Faster than people can eat them');
        mod.cpsAchievement('Supply and endless demand');
        mod.cpsAchievement('Got some crumbs in the carpet');
        mod.cpsAchievement('You can never have too many cookies');
        mod.cpsAchievement('Okay maybe you can');
        mod.cpsAchievement('You can\'t!');
        mod.cpsAchievement('Every river, waterfall and stream flows of cookies');
        mod.cpsAchievement('Ludicrous metabolism');
        mod.cpsAchievement('Faster than the universe expands');
        mod.cpsAchievement('Can\'t take a moment to digest');
        mod.cpsAchievement('Heavy speed');
        mod.cpsAchievement('Still not sick of it?');
        mod.cpsAchievement('Velomegacity');
        mod.cpsAchievement('Make haste');
        mod.cpsAchievement('Prestissimo');
        mod.cpsAchievement('I ordered a cookie 2 quectosecond ago, where is it?');
        mod.cpsAchievement('Running off inertia');
        mod.cpsAchievement('Just take the roses with you');
        mod.cpsAchievement('Really gets your heart racing');
        mod.cpsAchievement('Eat them in your sleep');
        mod.cpsAchievement('Feeling tired? Eat a cookie');
        mod.cpsAchievement('Pedal to the metal tray');
        mod.cpsAchievement('What else are we meant to do with our lives?');
        mod.cpsAchievement('Wouldn\'t it be fun to get into baking?', 'Yeah, imagine if you could make a living off of it');
        
        order=1000;
        mod.clickAchievement('We just click','mnt16');
        mod.clickAchievement('Click the bucket','mnt17');
        mod.clickAchievement('Click around','mnt18');
        mod.clickAchievement('Chat click that','mnt19');
        mod.clickAchievement('Click a cookie when it\'s down','mnt20');
        mod.clickAchievement('The clicker','mnt21', '<q>Behind every click.</q>');
        mod.clickAchievement('It\'s all beginning to click','mnt22');
        mod.clickAchievement('Check out that hot click','mnt23');
        mod.clickAchievement('At the click of a finger','mnt24');
        mod.clickAchievement('How does clicking a cookie even make another one?','mnt25');
        mod.clickAchievement('Just another click in the wall','mnt26');
        mod.clickAchievement('Look at all those clickens','mnt27');
        mod.clickAchievement('With a click click there','mnt28');
        mod.clickAchievement('Clickaesque','mnt29');

        order=1050;
        mod.cursorAchievement('Handy man','',12);
        mod.cursorAchievement('Enough palms to read a novel','',13);
        mod.cursorAchievement('Pointing fingers','',14);
        mod.cursorAchievement('Knuckling down','',15);

        order=1050;mod.cursorAchievement('Arm army','','mnt16');
        order=1100;Game.TieredAchievement('The days have worn away','','Grandma','mnt16');
		order=1200;Game.TieredAchievement('Let it grow','','Farm','mnt16');
		order=1300;Game.TieredAchievement('Hole to the other side of the planet','','Mine','mnt16');
		order=1400;Game.TieredAchievement('Belt it out','','Factory','mnt16');
		order=1425;Game.TieredAchievement('Here comes the money','','Bank','mnt16');
		order=1450;Game.TieredAchievement('Nightly prayers','','Temple','mnt16');
		order=1475;Game.TieredAchievement('How enchanting','','Wizard tower','mnt16');
		order=1500;Game.TieredAchievement('This ship has launched','','Shipment','mnt16');
		order=1600;Game.TieredAchievement('Them changes','','Alchemy lab','mnt16');
		order=1700;Game.TieredAchievement('Hypnotizing','','Portal','mnt16');
		order=1800;Game.TieredAchievement('Right on time','','Time machine','mnt16');
		order=1900;Game.TieredAchievement('Particulate particles','','Antimatter condenser','mnt16');
		order=2000;Game.TieredAchievement('Flash of inspiration','','Prism','mnt16');
		order=2100;Game.TieredAchievement('Blind luck','','Chancemaker','mnt16');
		order=2200;Game.TieredAchievement('Setting it up','','Fractal engine','mnt16');
		order=2300;Game.TieredAchievement('Game.TieredAchievement','<q>Still has order scope issues but honestly both this and Game.TieredUpgrade are rather nice to implement compared to Game.NewUpgrade and Game.NewAchievement, eugh.</q>','Javascript console','mnt16');
		order=2400;Game.TieredAchievement('Imperial impulses','','Idleverse','mnt16');
		order=2500;Game.TieredAchievement('Stuck in my head','','Cortex baker','mnt16');
		order=2600;Game.TieredAchievement('Nepotism','','You','mnt16');

        order=1050;mod.cursorAchievement('Thumb war','<q>One, two, three, four, I declare a thumb war!<br>Five, six, seven, eight, I play my hand, your digits shake!<br>Nine, ten, eleven, twelve, finger guns obliterate!<br>Thirteen, fourteen, fifteen, sixteen, your pointers are fading quickly!<br>Seventeen, eighteen, nineteen, twenty, you\'re left defeated and your palms are sweaty!</q>','mnt17');
        order=1100;Game.TieredAchievement('Wrinkle, wrinkle, little grandmother','','Grandma','mnt17');
		order=1200;Game.TieredAchievement('Did you soil yourself','','Farm','mnt17');
		order=1300;Game.TieredAchievement('Cookie-dûm','<q>The dwarves delved too greedily and too deep. You know what they awoke in the darkness.</q>','Mine','mnt17');
		order=1400;Game.TieredAchievement('I like to make it, make it','','Factory','mnt17');
		order=1425;Game.TieredAchievement('Rolling in dough','','Bank','mnt17');
		order=1450;Game.TieredAchievement('I bought a whip','<q>Want to be part of a psyche experiment?</q>','Temple','mnt17');
		order=1475;Game.TieredAchievement('Hat trick','','Wizard tower','mnt17');
		order=1500;Game.TieredAchievement('It is rocket science','','Shipment','mnt17');
		order=1600;Game.TieredAchievement('Goldilocks','','Alchemy lab','mnt17');
		order=1700;Game.TieredAchievement('Servant of someone probably','','Portal','mnt17');
		order=1800;Game.TieredAchievement('Time is cookies, I don\'t have enough time','','Time machine','mnt17');
		order=1900;Game.TieredAchievement('What did matter do wrong to have groups of antimatter?','','Antimatter condenser','mnt17');
		order=2000;Game.TieredAchievement('Lighten up','','Prism','mnt17');
		order=2100;Game.TieredAchievement('Sound the bell curves','','Chancemaker','mnt17');
		order=2200;Game.TieredAchievement('Semantic satiation','<q>Cookie cookie cookie cookie cookie cookie cookie cookie cookie cookie cookie cookie cookie cookie cookie cookie cookie cookie cookie cookie cookie cookie cookie.</q>','Fractal engine','mnt17');
		order=2300;Game.TieredAchievement('Inside the scope','','Javascript console','mnt17');
		order=2400;Game.TieredAchievement('Across the universe','','Idleverse','mnt17');
		order=2500;Game.TieredAchievement('A person who thinks all the time','','Cortex baker','mnt17');
		order=2600;Game.TieredAchievement('Yougenics','<q>Take a clone, rub it on a vat, then a clone comes out of the cap.<br>Not too sure what\'s up with that.</q>','You','mnt17');

        order=1050;mod.cursorAchievement('Face palm','','mnt18');
        order=1100;Game.TieredAchievement('Respect your elders','','Grandma','mnt18');
		order=1200;Game.TieredAchievement('Green arm of the crop','','Farm','mnt18');
		order=1300;Game.TieredAchievement('Diggy, diggy hole','','Mine','mnt18');
		order=1400;Game.TieredAchievement('Power surge','','Factory','mnt18');
		order=1425;Game.TieredAchievement('Cookiewinner','','Bank','mnt18');
		order=1450;Game.TieredAchievement('Paradise lost','','Temple','mnt18');
		order=1475;Game.TieredAchievement('The wonderful wizard','','Wizard tower','mnt18');
		order=1500;Game.TieredAchievement('Up, up and away','','Shipment','mnt18');
		order=1600;Game.TieredAchievement('Spoonful of sugar','','Alchemy lab','mnt18');
		order=1700;Game.TieredAchievement('Blood stained contracts','','Portal','mnt18');
		order=1800;Game.TieredAchievement('I was there when it was written','','Time machine','mnt18');
		order=1900;Game.TieredAchievement('If it quarks like a duck','','Antimatter condenser','mnt18');
		order=2000;Game.TieredAchievement('Picture perfect','','Prism','mnt18');
		order=2100;Game.TieredAchievement('Keep it simple stupid','','Chancemaker','mnt18');
		order=2200;Game.TieredAchievement('Metametabolism','','Fractal engine','mnt18');
		order=2300;Game.TieredAchievement('RAMifications','','Javascript console','mnt18');
		order=2400;Game.TieredAchievement('For cookie and corporate','','Idleverse','mnt18');
		order=2500;Game.TieredAchievement('Wrestling with the idea','','Cortex baker','mnt18');
		order=2600;Game.TieredAchievement('Carbon copy','','You','mnt18');

        order=1050;mod.cursorAchievement('You\'ve had the same hands your entire life','','mnt19');
        order=1100;Game.TieredAchievement('You\'ll be like them one day','<q>Consuming entire galaxies through a tentacled, wrinkly monster.</q>','Grandma','mnt19');
		order=1200;Game.TieredAchievement('Sow much gardening','','Farm','mnt19');
		order=1300;Game.TieredAchievement('Rock collection','<q>Jesus christ Marie they\'re minerals!</q>','Mine','mnt19');
		order=1400;Game.TieredAchievement('Do electric cookies dream of cookie sheep?','','Factory','mnt19');
		order=1425;Game.TieredAchievement('Bring home the bacon','','Bank','mnt19');
		order=1450;Game.TieredAchievement('Do the limbo','','Temple','mnt19');
		order=1475;Game.TieredAchievement('Chin wagger','','Wizard tower','mnt19');
		order=1500;Game.TieredAchievement('SPAAAAAACCEEE','<q>Wanna go to space. Space.</q>','Shipment','mnt19');
		order=1600;Game.TieredAchievement('Gold and tonic','','Alchemy lab','mnt19');
		order=1700;Game.TieredAchievement('Tunneler','','Portal','mnt19');
		order=1800;Game.TieredAchievement('Cookies are the one I want to go through time with','','Time machine','mnt19');
		order=1900;Game.TieredAchievement('You spin me right round baby right round','<q>Like a collider baby, right round, round, round.</q>','Antimatter condenser','mnt19');
		order=2000;Game.TieredAchievement('Are you filming this?','','Prism','mnt19');
		order=2100;Game.TieredAchievement('Seeded run','','Chancemaker','mnt19');
		order=2200;Game.TieredAchievement('Ultraset','','Fractal engine','mnt19');
		order=2300;Game.TieredAchievement('Debug spray','','Javascript console','mnt19');
		order=2400;Game.TieredAchievement('Somethings different','','Idleverse','mnt19');
		order=2500;Game.TieredAchievement('Did it ever occur to you','','Cortex baker','mnt19');
		order=2600;Game.TieredAchievement('Face of a generation','','You','mnt19');

        order=1050;mod.cursorAchievement('The world in your palms','','mnt20');
        order=1100;Game.TieredAchievement('Someone\'s mother','','Grandma','mnt20');
		order=1200;Game.TieredAchievement('It\'s growing on you','','Farm','mnt20');
		order=1300;Game.TieredAchievement('Cut off the earth crust','','Mine','mnt20');
		order=1400;Game.TieredAchievement('Remember to brush your gear teeth','','Factory','mnt20');
		order=1425;Game.TieredAchievement('Cheque this out','','Bank','mnt20');
		order=1450;Game.TieredAchievement('Salvating salvation','','Temple','mnt20');
		order=1475;Game.TieredAchievement('Hubbub hullabaloo','','Wizard tower','mnt20');
		order=1500;Game.TieredAchievement('The universes\' largest vacuum bag','','Shipment','mnt20');
		order=1600;Game.TieredAchievement('How noble of you','','Alchemy lab','mnt20');
		order=1700;Game.TieredAchievement('Satanic panic','','Portal','mnt20');
		order=1800;Game.TieredAchievement('A flat circle','','Time machine','mnt20');
		order=1900;Game.TieredAchievement('Teensy weensy','','Antimatter condenser','mnt20');
		order=2000;Game.TieredAchievement('Shine on you crazy diamond','','Prism','mnt20');
		order=2100;Game.TieredAchievement('Unpredictable','','Chancemaker','mnt20');
		order=2200;Game.TieredAchievement('Möbius baking sheet','','Fractal engine','mnt20');
		order=2300;Game.TieredAchievement('It can run DOOM','','Javascript console','mnt20');
		order=2400;Game.TieredAchievement('Here there and everywhere','','Idleverse','mnt20');
		order=2500;Game.TieredAchievement('Already thought about it','','Cortex baker','mnt20');
		order=2600;Game.TieredAchievement('Clone, I am your father','<q>Noooooooooooo!</q>','You','mnt20');

        order=1050;mod.cursorAchievement('The pointer','<q>Behind the great hand.</q>','mnt21');
        order=1100;Game.TieredAchievement('The fossil','<q>Behind our wisdom.</q>','Grandma','mnt21');
		order=1200;Game.TieredAchievement('The botanist','<q>Behind all still life.</q>','Farm','mnt21');
		order=1300;Game.TieredAchievement('The excavator','<q>Behind the emptiness.</q>','Mine','mnt21');
		order=1400;Game.TieredAchievement('The inventor','<q>Behind the metal giants.</q>','Factory','mnt21');
		order=1425;Game.TieredAchievement('The miser','<q>Behind every dollar and penny.</q>','Bank','mnt21');
		order=1450;Game.TieredAchievement('The evangelist','<q>Behind death.</q>','Temple','mnt21');
		order=1475;Game.TieredAchievement('The mage','<q>Behind the curtain.</q>','Wizard tower','mnt21');
		order=1500;Game.TieredAchievement('The navigator','<q>Behind our journey.</q>','Shipment','mnt21');
		order=1600;Game.TieredAchievement('The philosopher','<q>Behind the purification.</q>','Alchemy lab','mnt21');
		order=1700;Game.TieredAchievement('The lamb','<q>Behind the temptations.</q>','Portal','mnt21');
		order=1800;Game.TieredAchievement('The timekeeper','<q>Behind the times.</q>','Time machine','mnt21');
		order=1900;Game.TieredAchievement('The constant','<q>Behind the absolutes.</q>','Antimatter condenser','mnt21');
		order=2000;Game.TieredAchievement('The torchbearer','<q>Behind the light.</q>','Prism','mnt21');
		order=2100;Game.TieredAchievement('The goat','<q>Behind door number 3.</q>','Chancemaker','mnt21');
		order=2200;Game.TieredAchievement('The container','<q>Behind the walls.</q>','Fractal engine','mnt21');
		order=2300;Game.TieredAchievement('The programmer','<q>Behind the scenes.</q>','Javascript console','mnt21');
		order=2400;Game.TieredAchievement('The conquerer','<q>Behind the new world.</q>','Idleverse','mnt21');
		order=2500;Game.TieredAchievement('The thinker','<q>Behind every good idea.</q>','Cortex baker','mnt21');
		order=2600;Game.TieredAchievement('The creator','<q>Behind it all.</q>','You','mnt21');

        order=1050;mod.cursorAchievement('Digits in the 5 digit range','','mnt22');
        order=1100;Game.TieredAchievement('Hipsters','<q>It\'s because they\'ve all got hip replacements.</q>','Grandma','mnt22');
		order=1200;Game.TieredAchievement('It ain\'t much, but it\'s honest work','','Farm','mnt22');
		order=1300;Game.TieredAchievement('Bigger and boulder','','Mine','mnt22');
		order=1400;Game.TieredAchievement('Come together','','Factory','mnt22');
		order=1425;Game.TieredAchievement('In a rich man\'s world','','Bank','mnt22');
		order=1450;Game.TieredAchievement('Raiders of the refridgerator','','Temple','mnt22');
		order=1475;Game.TieredAchievement('Unlimited power!','','Wizard tower','mnt22');
		order=1500;Game.TieredAchievement('My planet needs me','','Shipment','mnt22');
		order=1600;Game.TieredAchievement('There\'s nothing but chemistry here','<q>What about the soul?</q>','Alchemy lab','mnt22');
		order=1700;Game.TieredAchievement('Souled off','','Portal','mnt22');
		order=1800;Game.TieredAchievement('History buff','<q>+10% antiquity damage.</q>','Time machine','mnt22');
		order=1900;Game.TieredAchievement('Chaos theory','','Antimatter condenser','mnt22');
		order=2000;Game.TieredAchievement('The rainbow connection','','Prism','mnt22');
		order=2100;Game.TieredAchievement('Bau down','','Chancemaker','mnt22');
		order=2200;Game.TieredAchievement('Infinite set of choices','','Fractal engine','mnt22');
        if (EN)
		{
			Game.last.descFunc=function(){
				var n=35;
                var i=Math.floor(Game.realT*0.1);
				var str = ' the end is never the end is never the end is never';
				return this.desc+'<q style="font-family:Courier;">'+(str.substring(i%str.length,i%str.length+n)+(i%str.length>(str.length-n)?str.substring(0,i%str.length-(str.length-n)):''))+'</q>';
			};
		}
		else Game.last.desc='<q>-</q>';
		order=2300;Game.TieredAchievement('Game.Win()','','Javascript console','mnt22');
		order=2400;Game.TieredAchievement('A cookie a day keeps reality away','','Idleverse','mnt22');
		order=2500;Game.TieredAchievement('Greater understanding','','Cortex baker','mnt22');
		order=2600;Game.TieredAchievement('Me again!','','You','mnt22');

        order=1050;mod.cursorAchievement('Point to the stars','','mnt23');
        order=1100;Game.TieredAchievement('What big teeth you have grandma!','','Grandma','mnt23');
		order=1200;Game.TieredAchievement('Who\'s a jammy farmer?','<q>Look at all this milk! I\'m gonna make a fortune!</q>','Farm','mnt23');
		order=1300;Game.TieredAchievement('Watch for rolling rocks','<q>An A press is an A press, you can\'t say it\'s only half.</q>','Mine','mnt23');
		order=1400;Game.TieredAchievement('Smokestack overflow','','Factory','mnt23');
		order=1425;Game.TieredAchievement('Cha-ching!','','Bank','mnt23');
		order=1450;Game.TieredAchievement('Curse of King Tart','','Temple','mnt23');
		order=1475;Game.TieredAchievement('Pixie perfect','','Wizard tower','mnt23');
		order=1500;Game.TieredAchievement('The doughy planet','','Shipment','mnt23');
		order=1600;Game.TieredAchievement('Gold-plated','','Alchemy lab','mnt23');
		order=1700;Game.TieredAchievement('I was in another world','','Portal','mnt23');
		order=1800;Game.TieredAchievement('Clocking in','','Time machine','mnt23');
		order=1900;Game.TieredAchievement('Atom and Eve','','Antimatter condenser','mnt23');
		order=2000;Game.TieredAchievement('Photongenic','','Prism','mnt23');
		order=2100;Game.TieredAchievement('Blum Blum Shub','<q>Bonus points for being the most fun psuedo-random algorithm name to say.</q>','Chancemaker','mnt23');
		order=2200;Game.TieredAchievement('Aleph null','','Fractal engine','mnt23');
		order=2300;Game.TieredAchievement('It\'s not a race condition','','Javascript console','mnt23');
		order=2400;Game.TieredAchievement('Plane old pillaging','','Idleverse','mnt23');
		order=2500;Game.TieredAchievement('Brain teaser','','Cortex baker','mnt23');
		order=2600;Game.TieredAchievement('My codonlences','','You','mnt23');

        order=1050;mod.cursorAchievement('Phalanging about','','mnt24');
        order=1100;Game.TieredAchievement('So moist!','','Grandma','mnt24');
		order=1200;Game.TieredAchievement('They just keep cropping up','','Farm','mnt24');
		order=1300;Game.TieredAchievement('Get to the bottom of all this','','Mine','mnt24');
		order=1400;Game.TieredAchievement('Tin man','','Factory','mnt24');
		order=1425;Game.TieredAchievement('Dollar dollar bills','','Bank','mnt24');
		order=1450;Game.TieredAchievement('Eclairic','','Temple','mnt24');
		order=1475;Game.TieredAchievement('Doublespeak','','Wizard tower','mnt24');
		order=1500;Game.TieredAchievement('Order up!','','Shipment','mnt24');
		order=1600;Game.TieredAchievement('Brew it together','','Alchemy lab','mnt24');
		order=1700;Game.TieredAchievement('YROO XRKSVI GIRZMTOV','','Portal','mnt24');
		order=1800;Game.TieredAchievement('Playing cookie clicker 9 to 5','','Time machine','mnt24');
		order=1900;Game.TieredAchievement('Corpuscle pudding','','Antimatter condenser','mnt24');
		order=2000;Game.TieredAchievement('Auto-chromatic','','Prism','mnt24');
		order=2100;Game.TieredAchievement('Ante up','','Chancemaker','mnt24');
		order=2200;Game.TieredAchievement('Cantor\'s paradise','','Fractal engine','mnt24');
		order=2300;Game.TieredAchievement('Multithreaded','','Javascript console','mnt24');
		order=2400;Game.TieredAchievement('More like, under new management','','Idleverse','mnt24');
		order=2500;Game.TieredAchievement('Mind the synaptic gap','','Cortex baker','mnt24');
		order=2600;Game.TieredAchievement('Self-interest','','You','mnt24');

        order=1050;mod.cursorAchievement('Where do these hands even come from?','','mnt25');
        order=1100;Game.TieredAchievement('How are you so old yet still bake cookies?','','Grandma','mnt25');
		order=1200;Game.TieredAchievement('How do you even grow a cookie?','','Farm','mnt25');
		order=1300;Game.TieredAchievement('Do you even have earth left to mine?','','Mine','mnt25');
		order=1400;Game.TieredAchievement('Where does all this energy come from?','','Factory','mnt25');
		order=1425;Game.TieredAchievement('How do you buy cookies with cookies? ','','Bank','mnt25');
		order=1450;Game.TieredAchievement('Is god even there?','','Temple','mnt25');
		order=1475;Game.TieredAchievement('Do you still have the magic?','','Wizard tower','mnt25');
		order=1500;Game.TieredAchievement('Do people still go outside?','','Shipment','mnt25');
		order=1600;Game.TieredAchievement('Is anything organic?','','Alchemy lab','mnt25');
		order=1700;Game.TieredAchievement('Is anyone out there?','','Portal','mnt25');
		order=1800;Game.TieredAchievement('Do we still have time left?','','Time machine','mnt25');
		order=1900;Game.TieredAchievement('Does anything even matter?','','Antimatter condenser','mnt25');
		order=2000;Game.TieredAchievement('Is there a light at the end of the tunnel?','','Prism','mnt25');
		order=2100;Game.TieredAchievement('Was this all luck?','','Chancemaker','mnt25');
		order=2200;Game.TieredAchievement('What\'s in all this?','','Fractal engine','mnt25');
		order=2300;Game.TieredAchievement('Are we in command?','','Javascript console','mnt25');
		order=2400;Game.TieredAchievement('What do other people do with their time?','','Idleverse','mnt25');
		order=2500;Game.TieredAchievement('Do you think of anything other than cookies?','','Cortex baker','mnt25');
		order=2600;Game.TieredAchievement('Who are you anymore?','','You','mnt25');

        order=1050;mod.cursorAchievement('Finger extended family','','mnt26');
        order=1100;Game.TieredAchievement('When I was your age','','Grandma','mnt26');
		order=1200;Game.TieredAchievement('Uprooted','','Farm','mnt26');
		order=1300;Game.TieredAchievement('Too deep to quit','','Mine','mnt26');
		order=1400;Game.TieredAchievement('Diesel devil','','Factory','mnt26');
		order=1425;Game.TieredAchievement('Ever in shambles','','Bank','mnt26');
		order=1450;Game.TieredAchievement('Confection your sins','','Temple','mnt26');
		order=1475;Game.TieredAchievement('In a puff pastry of smoke','','Wizard tower','mnt26');
		order=1500;Game.TieredAchievement('Floating in an tin pan','','Shipment','mnt26');
		order=1600;Game.TieredAchievement('Bake in an athanor for half an hour','','Alchemy lab','mnt26');
		order=1700;Game.TieredAchievement('Trespassing','','Portal','mnt26');
		order=1800;Game.TieredAchievement('You are the future','','Time machine','mnt26');
		order=1900;Game.TieredAchievement('A voice for radiation','','Antimatter condenser','mnt26');
		order=2000;Game.TieredAchievement('Glowing review','','Prism','mnt26');
		order=2100;Game.TieredAchievement('All the chips','','Chancemaker','mnt26');
		order=2200;Game.TieredAchievement('Syrupiński triangle','','Fractal engine','mnt26');
		order=2300;Game.TieredAchievement('Code of conduct','','Javascript console','mnt26');
		order=2400;Game.TieredAchievement('This is mine now','','Idleverse','mnt26');
		order=2500;Game.TieredAchievement('Truly puzzling','','Cortex baker','mnt26');
		order=2600;Game.TieredAchievement('Lift yourself up','','You','mnt26');

        order=1050;mod.cursorAchievement('Carpal tunnel vision','','mnt27');
        order=1100;Game.TieredAchievement('Retire just to bake cookies','','Grandma','mnt27');
		order=1200;Game.TieredAchievement('Talk to your plants every day','','Farm','mnt27');
		order=1300;Game.TieredAchievement('I really dig your style','','Mine','mnt27');
		order=1400;Game.TieredAchievement('Full of energy','','Factory','mnt27');
		order=1425;Game.TieredAchievement('In the car with honey','<q>Cash money!</q>','Bank','mnt27');
		order=1450;Game.TieredAchievement('As the prophecy foretold','','Temple','mnt27');
		order=1475;Game.TieredAchievement('Salagadoola menchicka boola','','Wizard tower','mnt27');
		order=1500;Game.TieredAchievement('We buy everything online now','','Shipment','mnt27');
		order=1600;Game.TieredAchievement('It may be a cookie but it\'s every bit as pure','<q>Tight, tight, tight!</q>','Alchemy lab','mnt27');
		order=1700;Game.TieredAchievement('Crazy town','','Portal','mnt27');
		order=1800;Game.TieredAchievement('It\'s running out','','Time machine','mnt27');
		order=1900;Game.TieredAchievement('Don\'t be so negative','','Antimatter condenser','mnt27');
		order=2000;Game.TieredAchievement('Smile and light wave boys','','Prism','mnt27');
		order=2100;Game.TieredAchievement('Guess what?','<q>No seriously, guess.</q>','Chancemaker','mnt27');
		order=2200;Game.TieredAchievement('Loop de loop','','Fractal engine','mnt27');
		order=2300;Game.TieredAchievement('Turn it off and on again','','Javascript console','mnt27');
		order=2400;Game.TieredAchievement('Domain expansion','','Idleverse','mnt27');
		order=2500;Game.TieredAchievement('Think mark think','','Cortex baker','mnt27');
		order=2600;Game.TieredAchievement('Identical N-lets','','You','mnt27');

        order=1050;mod.cursorAchievement('Half of this book is just the index','','mnt28');
        order=1100;Game.TieredAchievement('Do you feel old yet?','','Grandma','mnt28');
		order=1200;Game.TieredAchievement('Floral arrangement','','Farm','mnt28');
		order=1300;Game.TieredAchievement('Don\'t mine at night','','Mine','mnt28');
		order=1400;Game.TieredAchievement('Full steam ahead','','Factory','mnt28');
		order=1425;Game.TieredAchievement('Rich get richer','','Bank','mnt28');
		order=1450;Game.TieredAchievement('Life of grain','<q>I am not the messiah!</q>','Temple','mnt28');
		order=1475;Game.TieredAchievement('Tongue twister','','Wizard tower','mnt28');
		order=1500;Game.TieredAchievement('The moon moon?','<q>I get to be like Neil Armstrong and those other guys no one knows!</q>','Shipment','mnt28');
		order=1600;Game.TieredAchievement('Chocolate coating helps it go down easy','','Alchemy lab','mnt28');
		order=1700;Game.TieredAchievement('Certificate of insanity','<q>There\'s a truck waiting for you outside, take care.</q>','Portal','mnt28');
		order=1800;Game.TieredAchievement('Grains in an hourglass','','Time machine','mnt28');
		order=1900;Game.TieredAchievement('Anti-everything','','Antimatter condenser','mnt28');
		order=2000;Game.TieredAchievement('Staring into the sun','<q>What a mistake!</q>','Prism','mnt28');
		order=2100;Game.TieredAchievement('Heavily skewed','','Chancemaker','mnt28');
		order=2200;Game.TieredAchievement('Endlessly falling down','','Fractal engine','mnt28');
		order=2300;Game.TieredAchievement('You can do stuff like that online now','','Javascript console','mnt28');
		order=2400;Game.TieredAchievement('Hijack rabbit','','Idleverse','mnt28');
		order=2500;Game.TieredAchievement('Think of something funny here','','Cortex baker','mnt28');
		order=2600;Game.TieredAchievement('The bakery bunch','<q>Here\'s a story of a lovely baker who was baking cookies.</q>','You','mnt28');

        order=1050;mod.cursorAchievement('I think you\'ve hand enough','','mnt29');
        order=1100;Game.TieredAchievement('Autumnal years','','Grandma','mnt29');
		order=1200;Game.TieredAchievement('Green man group','','Farm','mnt29');
		order=1300;Game.TieredAchievement('Dug, dug, goose','','Mine','mnt29');
		order=1400;Game.TieredAchievement('Man vs. machine','<q>The machines win.</q>','Factory','mnt29');
		order=1425;Game.TieredAchievement('You fall and the nasdaq goes belly up','','Bank','mnt29');
		order=1450;Game.TieredAchievement('Dogma','','Temple','mnt29');
		order=1475;Game.TieredAchievement('That magic touch','','Wizard tower','mnt29');
		order=1500;Game.TieredAchievement('Cargo fast','<q>Zoooom!</q>','Shipment','mnt29');
		order=1600;Game.TieredAchievement('Be destill my beating heart','','Alchemy lab','mnt29');
		order=1700;Game.TieredAchievement('Crossover event','<q>Featuring Neverending Legacy!</q>','Portal','mnt29');
		order=1800;Game.TieredAchievement('All the time in the world','','Time machine','mnt29');
		order=1900;Game.TieredAchievement('Condensed milk','','Antimatter condenser','mnt29');
		order=2000;Game.TieredAchievement('Take a picture, it lasts longer','','Prism','mnt29');
		order=2100;Game.TieredAchievement('Post hoc ergo propter hoc','','Chancemaker','mnt29');
		order=2200;Game.TieredAchievement('The strange attractor','','Fractal engine','mnt29');
		order=2300;Game.TieredAchievement('Throw it on the compile','','Javascript console','mnt29');
		order=2400;Game.TieredAchievement('Atlas','','Idleverse','mnt29');
		order=2500;Game.TieredAchievement('Eureka','','Cortex baker','mnt29');
		order=2600;Game.TieredAchievement('Everyone is someone\'s child','<q>Do your clones feel special too?</q>','You','mnt29');

        order=1070;
		mod.productionAchievement('Crazy about clicking','Cursor',4,0,7);
		mod.productionAchievement('Click auteur','Cursor',5,0,7);
		mod.productionAchievement('Wake up click sleep repeat','Cursor',6,0,7);
        mod.productionAchievement('Putting the click in clicker','Cursor',7,0,7);
        mod.productionAchievement('You should click this achievement','Cursor',8,'That tickles!',7);
        Game.last.clickFunction = function() {
            Game.Popup(choose(['Hehe!', 'Haha!', 'Squeee!', 'That tickles!', 'Gawwww!', 'Hoo!', 'Hehehahaha!']),Game.mouseX,Game.mouseY);
            PlaySound('snd/squeak'+Math.ceil(Math.random()*4)+'.mp3');
        };
        mod.productionAchievement('Tick tock it\'s click o\' clock','Cursor',9,0,7);
        mod.productionAchievement('Don\'t you think it\'s a little inconsistent that the cursor production achievements all have \'click\' in them when that was the cookies baked from clicking achievements\' whole schtick?','Cursor',10,0,7);
        mod.productionAchievement('Click around click around','Cursor',11,'I gotta find a new place where the clicks are hip.',7);
        order+=3;
        mod.levelAchievement('Kid named finger','Cursor',2);
        // I have limits
        /*mod.levelAchievement('Cursorlvl30','Cursor',3);
        mod.levelAchievement('Cursorlvl40','Cursor',4);
        mod.levelAchievement('Cursorlvl50','Cursor',5);
        mod.levelAchievement('Cursorlvl60','Cursor',6);
        mod.levelAchievement('Cursorlvl70','Cursor',7);
        mod.levelAchievement('Cursorlvl80','Cursor',8);
        mod.levelAchievement('Cursorlvl90','Cursor',9);
        mod.levelAchievement('Cursorlvl100','Cursor',10);*/
		order=1120;
		mod.productionAchievement('Oldie but a goodie','Grandma',4,0,6);
		mod.productionAchievement('Living relic','Grandma',5,0,6);
		mod.productionAchievement('Passed wind this morning','Grandma',6,0,6);
        mod.productionAchievement('Ever wiser','Grandma',7,0,6);
        mod.productionAchievement('Life extension','Grandma',8,0,6);
        mod.productionAchievement('Older than the trees','Grandma',9,0,6);
        mod.productionAchievement('Darn kids!','Grandma',10,0,6);
        mod.productionAchievement('The youth have it easy','Grandma',11,0,6);
        order+=3;
        mod.levelAchievement('Telometre','Grandma',2);
        /*mod.levelAchievement('Grandmalvl30','Grandma',3);
        mod.levelAchievement('Grandmalvl40','Grandma',4);
        mod.levelAchievement('Grandmalvl50','Grandma',5);
        mod.levelAchievement('Grandmalvl60','Grandma',6);
        mod.levelAchievement('Grandmalvl70','Grandma',7);
        mod.levelAchievement('Grandmalvl80','Grandma',8);
        mod.levelAchievement('Grandmalvl90','Grandma',9);
        mod.levelAchievement('Grandmalvl100','Grandma',10);*/
		order=1220;
		mod.productionAchievement('What\'s that pumpkin?','Farm',4);
		mod.productionAchievement('Creeping vines','Farm',5);
		mod.productionAchievement('Comes out the ground','Farm',6,'I couldn\'t believe it!');
        mod.productionAchievement('E-I-E-I-O','Farm',7);
        mod.productionAchievement('I never thought a marrow could grow as big as that','Farm',8);
        mod.productionAchievement('Tractor beans','Farm',9);
        mod.productionAchievement('Reap it out','Farm',10);
        mod.productionAchievement('Sod off','Farm',11);
        order+=3;
        mod.levelAchievement('Heck ton of hectares','Farm',2);
        /*mod.levelAchievement('Farmlvl30','Farm',3);
        mod.levelAchievement('Farmlvl40','Farm',4);
        mod.levelAchievement('Farmlvl50','Farm',5);
        mod.levelAchievement('Farmlvl60','Farm',6);
        mod.levelAchievement('Farmlvl70','Farm',7);
        mod.levelAchievement('Farmlvl80','Farm',8);
        mod.levelAchievement('Farmlvl90','Farm',9);
        mod.levelAchievement('Farmlvl100','Farm',10);*/
		order=1320;
		mod.productionAchievement('Prospering prospectors','Mine',4);
		mod.productionAchievement('Spelunked','Mine',5);
		mod.productionAchievement('Delve in','Mine',6);
        mod.productionAchievement('Pebbles in your shoes','Mine',7);
        mod.productionAchievement('Dig down ore else','Mine',8);
        mod.productionAchievement('Geode to joy','Mine',9);
        mod.productionAchievement('This earth is mine','Mine',10);
        mod.productionAchievement('The rock I listen to is super underground, you wouldn\'t know it','Mine',11);
        order+=3;
        mod.levelAchievement('Break the bedrock','Mine',2);
        /*mod.levelAchievement('Minelvl30','Mine',3);
        mod.levelAchievement('Minelvl40','Mine',4);
        mod.levelAchievement('Minelvl50','Mine',5);
        mod.levelAchievement('Minelvl60','Mine',6);
        mod.levelAchievement('Minelvl70','Mine',7);
        mod.levelAchievement('Minelvl80','Mine',8);
        mod.levelAchievement('Minelvl90','Mine',9);
        mod.levelAchievement('Minelvl100','Mine',10);*/
		order=1420;
		mod.productionAchievement('Ton of automatons','Factory',4);
		mod.productionAchievement('Machinarium','Factory',5);
		mod.productionAchievement('Just tinker with it a bit','Factory',6);
        mod.productionAchievement('All utilities owned','Factory',7);
        mod.productionAchievement('Production conduction','Factory',8);
        mod.productionAchievement('Charged batteries','Factory',9);
        mod.productionAchievement('Engine hum','Factory',10);
        mod.productionAchievement('Chugging along','Factory',11);
        order+=3;
        mod.levelAchievement('Inventive step tracker','Factory',2);
        /*mod.levelAchievement('Factorylvl30','Factory',3);
        mod.levelAchievement('Factorylvl40','Factory',4);
        mod.levelAchievement('Factorylvl50','Factory',5);
        mod.levelAchievement('Factorylvl60','Factory',6);
        mod.levelAchievement('Factorylvl70','Factory',7);
        mod.levelAchievement('Factorylvl80','Factory',8);
        mod.levelAchievement('Factorylvl90','Factory',9);
        mod.levelAchievement('Factorylvl100','Factory',10);*/
		order=1445;
		mod.productionAchievement('Every dime, nickel and cent','Bank',4);
		mod.productionAchievement('You\'re working for no one, but me','Bank',5);
		mod.productionAchievement('Get a loan of this guy','Bank',6);
        mod.productionAchievement('Quite interested','Bank',7);
        mod.productionAchievement('Wall to wall street','Bank',8);
        mod.productionAchievement('Too big to fail','Bank',9);
        mod.productionAchievement('Fork it over','Bank',10);
        mod.productionAchievement('Pay day','Bank',11);
        order+=3;
        mod.levelAchievement('I\'m the taxman','Bank',2);
        /*mod.levelAchievement('Banklvl30','Bank',3);
        mod.levelAchievement('Banklvl40','Bank',4);
        mod.levelAchievement('Banklvl50','Bank',5);
        mod.levelAchievement('Banklvl60','Bank',6);
        mod.levelAchievement('Banklvl70','Bank',7);
        mod.levelAchievement('Banklvl80','Bank',8);
        mod.levelAchievement('Banklvl90','Bank',9);
        mod.levelAchievement('Banklvl100','Bank',10);*/
		order=1470;
		mod.productionAchievement('The good bake','Temple',4);
		mod.productionAchievement('Judas pastry!','Temple',5);
		mod.productionAchievement('Cookies glorious cookies','Temple',6,'Hot biscuits and crumpets.');
        mod.productionAchievement('Snakes. Why\'d it have to be snakes?','Temple',7);
        mod.productionAchievement('Whip cream','Temple',8);
        mod.productionAchievement('Rib-made cookies','Temple',9);
        mod.productionAchievement('Bishop to cookie4','Temple',10);
        mod.productionAchievement('Self-praising flour','Temple',11);
        order+=3;
        mod.levelAchievement('As a matter of artifact','Temple',2);
        /*mod.levelAchievement('Templelvl30','Temple',3);
        mod.levelAchievement('Templelvl40','Temple',4);
        mod.levelAchievement('Templelvl50','Temple',5);
        mod.levelAchievement('Templelvl60','Temple',6);
        mod.levelAchievement('Templelvl70','Temple',7);
        mod.levelAchievement('Templelvl80','Temple',8);
        mod.levelAchievement('Templelvl90','Temple',9);
        mod.levelAchievement('Templelvl100','Temple',10);*/
		order=1495;
		mod.productionAchievement('French drop','Wizard tower',4);
		mod.productionAchievement('Illusory walls','Wizard tower',5);
		mod.productionAchievement('Glorpy will pick up the cookie','Wizard tower',6);
        mod.productionAchievement('Hypernatural','Wizard tower',7);
        mod.productionAchievement('Lexicography','Wizard tower',8);
        mod.productionAchievement('Starch and soda','Wizard tower',9);
        mod.productionAchievement('Cardistry','Wizard tower',10);
        mod.productionAchievement('Magician\'s secret ingredients','Wizard tower',11);
        order+=3;
        mod.levelAchievement('Shibboleth','Wizard tower',2);
        /*mod.levelAchievement('Wizard towerlvl30','Wizard tower',3);
        mod.levelAchievement('Wizard towerlvl40','Wizard tower',4);
        mod.levelAchievement('Wizard towerlvl50','Wizard tower',5);
        mod.levelAchievement('Wizard towerlvl60','Wizard tower',6);
        mod.levelAchievement('Wizard towerlvl70','Wizard tower',7);
        mod.levelAchievement('Wizard towerlvl80','Wizard tower',8);
        mod.levelAchievement('Wizard towerlvl90','Wizard tower',9);
        mod.levelAchievement('Wizard towerlvl100','Wizard tower',10);*/
		order=1520;
		mod.productionAchievement('In our favourite rocket ship','Shipment',4);
		mod.productionAchievement('Scared by cosmic dogs','Shipment',5);
		mod.productionAchievement('Raise the mailbox flag','Shipment',6);
        mod.productionAchievement('The deepest of the deep space','Shipment',7);
        mod.productionAchievement('Write another Safire memo','Shipment',8);
        mod.productionAchievement('Golden angel wings','Shipment',9,'What\'s in the box?<br>Oh y\'know, a satellite phone, GPS locator, fishing rod, water purifier, and some seeds.');
        mod.productionAchievement('In a galaxy','Shipment',10);
        mod.productionAchievement('Pillars of delivery','Shipment',11);
        order+=3;
        mod.levelAchievement('Hot and cold tourist destinations','Shipment',2);
        /*mod.levelAchievement('Shipmentlvl30','Shipment',3);
        mod.levelAchievement('Shipmentlvl40','Shipment',4);
        mod.levelAchievement('Shipmentlvl50','Shipment',5);
        mod.levelAchievement('Shipmentlvl60','Shipment',6);
        mod.levelAchievement('Shipmentlvl70','Shipment',7);
        mod.levelAchievement('Shipmentlvl80','Shipment',8);
        mod.levelAchievement('Shipmentlvl90','Shipment',9);
        mod.levelAchievement('Shipmentlvl100','Shipment',10);*/
		order=1620;
		mod.productionAchievement('Socratic method','Alchemy lab',4);
		mod.productionAchievement('Element of the week','Alchemy lab',5);
		mod.productionAchievement('Quick change','Alchemy lab',6);
        mod.productionAchievement('Bubbling up','Alchemy lab',7);
        mod.productionAchievement('Convoluted concoctions','Alchemy lab',8);
        mod.productionAchievement('Lead the way','Alchemy lab',9);
        mod.productionAchievement('Chemistry but cooler and more mystical','Alchemy lab',10);
        mod.productionAchievement('Gold star','Alchemy lab',11);
        order+=3;
        mod.levelAchievement('Metalhead','Alchemy lab',2);
        /*mod.levelAchievement('Alchemy lablvl30','Alchemy lab',3);
        mod.levelAchievement('Alchemy lablvl40','Alchemy lab',4);
        mod.levelAchievement('Alchemy lablvl50','Alchemy lab',5);
        mod.levelAchievement('Alchemy lablvl60','Alchemy lab',6);
        mod.levelAchievement('Alchemy lablvl70','Alchemy lab',7);
        mod.levelAchievement('Alchemy lablvl80','Alchemy lab',8);
        mod.levelAchievement('Alchemy lablvl90','Alchemy lab',9);
        mod.levelAchievement('Alchemy lablvl100','Alchemy lab',10);*/
		order=1720;
		mod.productionAchievement('Ceci n\'est pas une achievement','Portal',4);
		mod.productionAchievement('The baker arrives on a tide of blood!','Portal',5, 'Oh hello grandma.');
		mod.productionAchievement('Koo koo','Portal',6);
        mod.productionAchievement('Rabid noises','Portal',7);
        mod.productionAchievement('I am beyond strength, child','Portal',8);
        mod.productionAchievement('Wall of cookies','Portal',9,'Has been awoken!');
        mod.productionAchievement('Not what he seems','Portal',10);
        mod.productionAchievement('Monstrosity','Portal',11);
        order+=3;
        mod.levelAchievement('And before there was nothing, there were monsters','Portal',2,'<q>Here\'s your gold star!</q>');
        /*mod.levelAchievement('Portallvl30','Portal',3);
        mod.levelAchievement('Portallvl40','Portal',4);
        mod.levelAchievement('Portallvl50','Portal',5);
        mod.levelAchievement('Portallvl60','Portal',6);
        mod.levelAchievement('Portallvl70','Portal',7);
        mod.levelAchievement('Portallvl80','Portal',8);
        mod.levelAchievement('Portallvl90','Portal',9);
        mod.levelAchievement('Portallvl100','Portal',10);*/
		order=1820;
		mod.productionAchievement('One more trip around the sun','Time machine',4);
		mod.productionAchievement('Dog days are over','Time machine',5);
		mod.productionAchievement('Set back the clocks','Time machine',6);
        mod.productionAchievement('Spring forward a few millenia','Time machine',7);
        mod.productionAchievement('Every time all the time','Time machine',8);
        mod.productionAchievement('Autumn back','Time machine',9);
        mod.productionAchievement('Tick tock tick tock','Time machine',10);
        mod.productionAchievement('Time for a break','Time machine',11,'Time for a cookie');
        order+=3;
        mod.levelAchievement('Time loop','Time machine',2);
        /*mod.levelAchievement('Time machinelvl30','Time machine',3);
        mod.levelAchievement('Time machinelvl40','Time machine',4);
        mod.levelAchievement('Time machinelvl50','Time machine',5);
        mod.levelAchievement('Time machinelvl60','Time machine',6);
        mod.levelAchievement('Time machinelvl70','Time machine',7);
        mod.levelAchievement('Time machinelvl80','Time machine',8);
        mod.levelAchievement('Time machinelvl90','Time machine',9);
        mod.levelAchievement('Time machinelvl100','Time machine',10);*/
		order=1920;
		mod.productionAchievement('Denser and denser','Antimatter condenser',4);
		mod.productionAchievement('Micro-orbit','Antimatter condenser',5);
		mod.productionAchievement('Fundamental force','Antimatter condenser',6);
        mod.productionAchievement('Radiohyperactive','Antimatter condenser',7);
        mod.productionAchievement('Spheres and waves','Antimatter condenser',8);
        mod.productionAchievement('Coming closer together','Antimatter condenser',9);
        mod.productionAchievement('Quarter life','Antimatter condenser',10);
        mod.productionAchievement('It only saw radiowave play','Antimatter condenser',11);
        order+=3;
        mod.levelAchievement('Spinning out of control','Antimatter condenser',2);
        /*mod.levelAchievement('Antimatter condenserlvl30','Antimatter condenser',3);
        mod.levelAchievement('Antimatter condenserlvl40','Antimatter condenser',4);
        mod.levelAchievement('Antimatter condenserlvl50','Antimatter condenser',5);
        mod.levelAchievement('Antimatter condenserlvl60','Antimatter condenser',6);
        mod.levelAchievement('Antimatter condenserlvl70','Antimatter condenser',7);
        mod.levelAchievement('Antimatter condenserlvl80','Antimatter condenser',8);
        mod.levelAchievement('Antimatter condenserlvl90','Antimatter condenser',9);
        mod.levelAchievement('Antimatter condenserlvl100','Antimatter condenser',10);*/
		order=2020;
		mod.productionAchievement('The lime light','Prism',4);
		mod.productionAchievement('Break into the spotlight','Prism',5);
		mod.productionAchievement('Highly photon receptive','Prism',6);
        mod.productionAchievement('Snap a picture','Prism',7);
        mod.productionAchievement('Rendering','Prism',8);
        mod.productionAchievement('Shadowless','Prism',9);
        mod.productionAchievement('You\'re quite bright','Prism',10);
        mod.productionAchievement('Say cookie!','Prism',11,'Cookie!');
        order+=3;
        mod.levelAchievement('Triple rainbow','Prism',2, '<q>Woahhhhhh.</q>');
        /*mod.levelAchievement('Prismlvl30','Prism',3);
        mod.levelAchievement('Prismlvl40','Prism',4);
        mod.levelAchievement('Prismlvl50','Prism',5);
        mod.levelAchievement('Prismlvl60','Prism',6);
        mod.levelAchievement('Prismlvl70','Prism',7);
        mod.levelAchievement('Prismlvl80','Prism',8);
        mod.levelAchievement('Prismlvl90','Prism',9);
        mod.levelAchievement('Prismlvl100','Prism',10);*/
        order=2120;
		mod.productionAchievement('Wishful thinking','Chancemaker',4);
		mod.productionAchievement('Tyche blessing','Chancemaker',5);
		mod.productionAchievement('Place it all on placebo','Chancemaker',6);
        mod.productionAchievement('Likely outcome','Chancemaker',7);
        mod.productionAchievement('So you\'re telling me there\'s a chance','Chancemaker',8);
        mod.productionAchievement('One more roll of the die','Chancemaker',9);
        mod.productionAchievement('Roulette it spin','Chancemaker',10);
        mod.productionAchievement('I hope so','Chancemaker',11);
        order+=3;
        mod.levelAchievement('We\'ve been clover this','Chancemaker',2);
        /*mod.levelAchievement('Chancemakerlvl30','Chancemaker',3);
        mod.levelAchievement('Chancemakerlvl40','Chancemaker',4);
        mod.levelAchievement('Chancemakerlvl50','Chancemaker',5);
        mod.levelAchievement('Chancemakerlvl60','Chancemaker',6);
        mod.levelAchievement('Chancemakerlvl70','Chancemaker',7);
        mod.levelAchievement('Chancemakerlvl80','Chancemaker',8);
        mod.levelAchievement('Chancemakerlvl90','Chancemaker',9);
        mod.levelAchievement('Chancemakerlvl100','Chancemaker',10);*/
        order=2220;
		mod.productionAchievement('Minkowski sausage','Fractal engine',4);
		mod.productionAchievement('Mega zoom','Fractal engine',5);
		mod.productionAchievement('Many infinities','Fractal engine',6);
        mod.productionAchievement('Again and again','Fractal engine',7);
        mod.productionAchievement('That\'s not fractall','Fractal engine',8);
        mod.productionAchievement('Literate iterate','Fractal engine',9);
        mod.productionAchievement('Penrosing flour','Fractal engine',10);
        mod.productionAchievement('Uncountable','Fractal engine',11);
        order+=3;
        mod.levelAchievement('Iterate upon it','Fractal engine',2);
        /*mod.levelAchievement('Fractal enginelvl30','Fractal engine',3);
        mod.levelAchievement('Fractal enginelvl40','Fractal engine',4);
        mod.levelAchievement('Fractal enginelvl50','Fractal engine',5);
        mod.levelAchievement('Fractal enginelvl60','Fractal engine',6);
        mod.levelAchievement('Fractal enginelvl70','Fractal engine',7);
        mod.levelAchievement('Fractal enginelvl80','Fractal engine',8);
        mod.levelAchievement('Fractal enginelvl90','Fractal engine',9);
        mod.levelAchievement('Fractal enginelvl100','Fractal engine',10);*/
        order=2320;
		mod.productionAchievement('Pointer it out','Javascript console',4);
		mod.productionAchievement('I\'ll call you later','Javascript console',5);
		mod.productionAchievement('Stinky code','Javascript console',6);
        mod.productionAchievement('Object oriented baking','Javascript console',7);
        mod.productionAchievement('Computerworm','Javascript console',8,'Always got your head in a well-written program.');
        mod.productionAchievement('If else bake cookies','Javascript console',9);
        mod.productionAchievement('Cascading baking sheets','Javascript console',10);
        mod.productionAchievement('In case of emergency use a paradox','Javascript console',11,'This statement is false.');
        order+=3;
        mod.levelAchievement('Be quiet in the codebase','Javascript console',2);
        /*mod.levelAchievement('Javascript consolelvl30','Javascript console',3);
        mod.levelAchievement('Javascript consolelvl40','Javascript console',4);
        mod.levelAchievement('Javascript consolelvl50','Javascript console',5);
        mod.levelAchievement('Javascript consolelvl60','Javascript console',6);
        mod.levelAchievement('Javascript consolelvl70','Javascript console',7);
        mod.levelAchievement('Javascript consolelvl80','Javascript console',8);
        mod.levelAchievement('Javascript consolelvl90','Javascript console',9);
        mod.levelAchievement('Javascript consolelvl100','Javascript console',10);*/
        order=2420;
		mod.productionAchievement('Universe reshuffling','Idleverse',4);
		mod.productionAchievement('A game about doing nothing','Idleverse',5,'A strange game, the only winning move is not to play.');
		mod.productionAchievement('Wait a few more minutes','Idleverse',6);
        mod.productionAchievement('Get in the cookie bubble','Idleverse',7);
        mod.productionAchievement('Tesseract now','Idleverse',8);
        mod.productionAchievement('A different way of life','Idleverse',9);
        mod.productionAchievement('Daily login','Idleverse',10);
        mod.productionAchievement('The waiting game','Idleverse',11);
        order+=3;
        mod.levelAchievement('You\'ve got to be euclidding me','Idleverse',2);
        /*mod.levelAchievement('Idleverselvl30','Idleverse',3);
        mod.levelAchievement('Idleverselvl40','Idleverse',4);
        mod.levelAchievement('Idleverselvl50','Idleverse',5);
        mod.levelAchievement('Idleverselvl60','Idleverse',6);
        mod.levelAchievement('Idleverselvl70','Idleverse',7);
        mod.levelAchievement('Idleverselvl80','Idleverse',8);
        mod.levelAchievement('Idleverselvl90','Idleverse',9);
        mod.levelAchievement('Idleverselvl100','Idleverse',10);*/
        order=2520;
		mod.productionAchievement('Action potential','Cortex baker',4);
		mod.productionAchievement('Now that I think about it','Cortex baker',5);
		mod.productionAchievement('Brainiac','Cortex baker',6);
        mod.productionAchievement('Crease and fold','Cortex baker',7);
        mod.productionAchievement('Train of thought','Cortex baker',8);
        mod.productionAchievement('Intelligence product','Cortex baker',9);
        mod.productionAchievement('Knowing verses proving','Cortex baker',10);
        mod.productionAchievement('My head hurts','Cortex baker',11);
        order+=3;
        mod.levelAchievement('Intellectual','Cortex baker',2);
        /*mod.levelAchievement('Nerding out','Cortex baker',3);
        mod.levelAchievement('Know-it-all','Cortex baker',4);
        mod.levelAchievement('Mensa','Cortex baker',5);
        mod.levelAchievement('Cortex bakerlvl60','Cortex baker',6);
        mod.levelAchievement('Cortex bakerlvl70','Cortex baker',7);
        mod.levelAchievement('Cortex bakerlvl80','Cortex baker',8);
        mod.levelAchievement('Cortex bakerlvl90','Cortex baker',9);
        mod.levelAchievement('Cortex bakerlvl100','Cortex baker',10);*/
        order=2620;
		mod.productionAchievement('Me, myself and I','You',4);
		mod.productionAchievement('You did it','You',5);
		mod.productionAchievement('You are who you are','You',6);
        mod.productionAchievement('All you ever were','You',7);
        mod.productionAchievement('You want this','You',8);
        mod.productionAchievement('Now lie in it','You',9);
        mod.productionAchievement('Duplicate success','You',10);
        mod.productionAchievement('I did it for me','You',11);
        order+=3;
        mod.levelAchievement('Healthy body','You',2);
        /*mod.levelAchievement('Maturation','You',3);
        mod.levelAchievement('Superior genes','You',4);
        mod.levelAchievement('Darwinianly advanced','You',5);
        mod.levelAchievement('Youlvl60','You',6);
        mod.levelAchievement('Youlvl70','You',7);
        mod.levelAchievement('Youlvl80','You',8);
        mod.levelAchievement('Youlvl90','You',9);
        mod.levelAchievement('Youlvl100','You',10);*/

        order = 5000;
        mod.totalBuildingsAchievement('The wall must hold', '<q>Yes, I\'m an engineer, I think I put this thing right here.</q>', 8);
        mod.totalBuildingsAchievement('If you build it, they will come', '<q>That has to be a lot of concrete.</q>', 9);
        mod.totalBuildingsAchievement('Zone doze', '<q>The number of building permits this must\'ve required probably takes up the size of a building at this point.</q>', 10);
        mod.totalBuildingsAchievement('True estate', '<q>Realer than real.</q>', 11);
        mod.totalBuildingsAchievement('Concrete jungle', '<q>How do some of your cookie producers even qualify as buildings? Like what even is a chancemaker?</q>', 12);
        mod.totalBuildingsAchievement('Production agglomeration', '<q>There are more of your buildings than there are domestic houses.</q>', 13);
        mod.totalBuildingsAchievement('Working in the motherhive', '<q>Arrebar!</q>', 14);
        mod.totalBuildingsAchievement('Architectual feat', '<q>Take a hammer and nail.</q>', 15);
        mod.totalBuildingsAchievement('Kowloon', '<q>I think you took "constructive criticism" of your cookies too literally.</q>', 16);
        mod.totalBuildingsAchievement('Claustraphobia', '<q>Can\'t... breathe... *gasp*.</q>', 17);
        mod.totalBuildingsAchievement('Subsidaries subsidaries', '<q>All businesses lead to yours.</q>', 18);
        mod.totalBuildingsAchievement('Just knock down a few more trees over here', '<q>Break down branches to build your own.</q>', 19);
        mod.totalBuildingsAchievement('How bad can I possibly be?', '<q>A company is an animal trying to survive.</q>', 20);
        mod.totalBuildingsAchievement('Structured', '<q>We\'ve got to have some sense of order around here.</q>', 21);
        mod.totalBuildingsAchievement('Edge-of-the-universe-scrapers', '<q>At what point does it stop being a tower and start being a galactic hallway.</q>', 22);
        mod.totalBuildingsAchievement('Pillars of creation', '<q>Lift up the world.</q>', 23);
        mod.totalBuildingsAchievement('Size of a galaxy', '<q>Try getting from one end to the other in a timely manner.</q>', 24);
        mod.totalBuildingsAchievement('Hercules-Corona Borealis Great Office Complex', '<q>This is not simple whatsoever.</q>', 25);
        mod.totalBuildingsAchievement('Quantity over quality', '<q>Number go up!</q>', 26);
        mod.totalBuildingsAchievement('Haplometrosis', '<q>They serve you.</q>', 27);

        order = 6000;
        mod.totalUpgradesAchievement('Infinite grant money', '<q>The only thing stopping the forwarding of humanity\'s scientific ascent is trying to convince some rich folk that we just need one more collider, come on this is the one, we\'ll solve science this time, just one more bigger collider we swear.</q>', 10);
        mod.totalUpgradesAchievement('Improve, augment, overcome', '<q>It\'s just accelerating the natural order!</q>', 11);
        mod.totalUpgradesAchievement('Never stopped to ask if we should', '<q>Because obviously we should!</q>', 12);
        mod.totalUpgradesAchievement('Y\'know I\'m something of a scientist myself', '<q>Your actual scientists feel incredibly disgusted.</q>', 13);
        mod.totalUpgradesAchievement('Progress towards', '<q>Towards what?</q>', 14);
        mod.totalUpgradesAchievement('Macgyver', '<q>What an elaborate way to not get a phone charger.</q>', 15);
        mod.totalUpgradesAchievement('Bogde it together', '<q>If it works, it works!</q>', 16);
        mod.totalUpgradesAchievement('Research institute', '<q>Figure it out as we go.</q>', 17);
        mod.totalUpgradesAchievement('Nobel', '<q>A baker is ahead of every scientist ever to exist.</q>', 18);
        mod.totalUpgradesAchievement('Theory of everything', '<q>But that\'s just a theory!</q>', 19);
        mod.totalUpgradesAchievement('Q.E.D.', '<q>But we can show more.</q>', 20);
        mod.totalUpgradesAchievement('Furthered developement', '<q>Just a bit more research would do it.</q>', 21);
        mod.totalUpgradesAchievement('Omnology', '<q>Okay four-eyes.</q>', 22);
        mod.totalUpgradesAchievement('Better, faster, stronger', '<q>Our work is never over.</q>', 23);
        mod.totalUpgradesAchievement('Work it', '<q>Put some elbow juice in.</q>', 24);
        mod.totalUpgradesAchievement('Just do it!', '<q>Yesterday you said tomorrow!</q>', 25);
        mod.totalUpgradesAchievement('Oh you did it', '<q>Oh, nice.</q>', 26);
        mod.totalUpgradesAchievement('Power up', '<q>+1000 points.</q>', 27);

        order = 6001;
        mod.totalHeavenlyUpgradesAchievement('Above us all','',2)
        mod.totalHeavenlyUpgradesAchievement('Celestial constellations','',3)
        mod.totalHeavenlyUpgradesAchievement('Empyrean cluster','',4)
        mod.totalHeavenlyUpgradesAchievement('Super star','',5)

        order = 7002;
        mod.eachBuildingsAchievement('Septcentennial and a half', '<q>Do you feel accomplished yet?</q>', 14);
        mod.eachBuildingsAchievement('Octocentennial', '<q>Y\'know most people just play this game when they\'re bored in school.</q>', 15);
        mod.eachBuildingsAchievement('Octocentennial and a half', '<q>Absolutely insane.</q>', 16);
        mod.eachBuildingsAchievement('Nonacentennial', '<q>Have the voices stopped or are they only getting louder?</q>', 17);
        mod.eachBuildingsAchievement('Nonacentennial and a half', '<q>You could honestly just call these achievements a second set of "You" building amount achievements.</q>', 18);
        mod.eachBuildingsAchievement('Decentennial', '<q>A millenial? Sorry we only have confusing numbering schemes here dear, not a generation of people at the turning point between young and old.</q>', 19);
        mod.eachBuildingsAchievement('Decentennial and a half', '<q>So when\'s your jubilee?</q>', 20);
        mod.eachBuildingsAchievement('Undecentennial', '<q>If anyone questions your authority, quietly brush them away... never to be seen again.</q>', 21);
        mod.eachBuildingsAchievement('Undecentennial and a half', '<q>This gravy train is never stopping!</q>', 22);
        mod.eachBuildingsAchievement('Duodecentennial', '<q>Do you have any other hobbies?</q>', 23);
        mod.eachBuildingsAchievement('Duodecentennial and a half', '<q>Oh wow! Another trophy!</q>', 24);
        mod.eachBuildingsAchievement('Trecentennial', '<q>How grand!</q>', 25);
        mod.eachBuildingsAchievement('Trecentennial and a half', '<q>Just a few more minutes before bed.</q>', 26);
        mod.eachBuildingsAchievement('Quattuorcentennial', '<q>I\'m so tired just writing all this text, I can only imagine how you feel.</q>', 27);

        order = 30050;
        mod.ascendedCookiesAchievement('Time to do it all again', '<q>Let\'s do the time warp again!</q>', 19);
        mod.ascendedCookiesAchievement('From rags to riches to rags to riches', '<q>Your favourite story.</q>', 20);
        mod.ascendedCookiesAchievement('Eternity in nothing', '<q>Got any board games?</q>', 21);
        mod.ascendedCookiesAchievement('Giving it all up', '<q>How humble of you!</q>', 22);
        mod.ascendedCookiesAchievement('Throw it all away', '<q>At the drop of a hat.</q>', 23);
        mod.ascendedCookiesAchievement('To be seen again', '<q>Don\'t miss us if you\'re going to be right back.</q>', 24);
        mod.ascendedCookiesAchievement('Regular customer of hell', '<q>And would you like the screams of the damned with that sir?.</q>', 25);
        mod.ascendedCookiesAchievement('Burn, burn, burn', '<q>Everything will burn, baby burn.</q>', 26);
        mod.ascendedCookiesAchievement('A phoenix which rises from the ashes', '<q>If we burn, you burn with us!</q>', 27);
        mod.ascendedCookiesAchievement('Viator', '<q>From this life to the next.</q>', 28);
        mod.ascendedCookiesAchievement('Destruction of everything', '<q>Oh hey you\'re ba- oop, there everything goes again.</q>', 29);
        mod.ascendedCookiesAchievement('What\'s left?', '<q>Who\'s right?</q>', 30);
        mod.ascendedCookiesAchievement('Not even nothing', '<q>Nothing is better than a meaningful life. Making more cookies? Eh, it\'s better than nothing. Therefore, making more cookies is better than a meaningful life. But you already knew that didn\'t you?</q>', 31);
        mod.ascendedCookiesAchievement('Ankh', '<q>Eternal life?</q>', 32);
        mod.ascendedCookiesAchievement('Curiosity killed the world', '<q>I think you\'ve used a bit more than 9 lives at this point.</q>', 33);
        mod.ascendedCookiesAchievement('10th circle of hell', '<q>But you\'re not going down that easily are you?</q>', 34);
        mod.ascendedCookiesAchievement('The universes\' last breath', '<q>Yes, they\'ve had lungs this entire time.</q>', 35);
        mod.ascendedCookiesAchievement('A final cry of existance', '<q>Remember me!</q>', 36);
        mod.ascendedCookiesAchievement('How many cookies must be destroyed?', '<q>How many must be eaten and gnawed?</q>', 37);
        mod.ascendedCookiesAchievement('Reset the clocks', '', 38);
        if (EN)
		{
			Game.last.descFunc=function(){
				var date=new Date();
                date.setTime(Date.now()-Game.startDate);
                var timeInDays = Math.floor((date.getTime()/1000)/(60*60*24));
				return this.desc+'<q>Days since the pastry baker came back from the dead: '+timeInDays+'.</q>';
			};
		}
		else Game.last.desc='<q>-</q>';
        mod.ascendedCookiesAchievement('I want to get off Mr. Orteil\'s wild ride!', '<q>And it shows no sign of slowing!<br>Although hey, where has that guy been?</q>', 39);

        var achievWordCount = 0;
        var achievLongest = 0;
        var achievLongestCount = 0;

        for (var i = startOfModNum; Game.AchievementsById[i] != undefined; i++) {
            var achiev = Game.AchievementsById[i];
            mod.modAchievementList.push(achiev.name);
            achievWordCount += countWords(achiev.name);
            var quote = achiev.baseDesc.match(/<q>(.*?)<\/q>/i); //get quote section
		    if (quote) {if (countWords(quote[0]) > achievLongestCount) {achievLongest = achiev.name; achievLongestCount = countWords(quote[0]);} achievWordCount += countWords(quote[0])};
        };

        /*console.log('Achievement total: '+ mod.modAchievementList.length);
        console.log('Total achievement word count: ' + achievWordCount);
        console.log('Average achievement word count: ' + (achievWordCount/mod.modAchievementList.length));
        console.log('Longest achievement description word count: ' + achievLongestCount);
        console.log(achievLongest);*/

        var wordCount = achievWordCount + upgradeWordCount;

        //console.log('Total word count: ' + wordCount);
        //console.log('Total new achievements and upgrades: ' + (mod.modUpgradeList.length + mod.modAchievementList.length));

        // Move all lvl 10 achievs + 3 order
        for (var i in Game.Objects) {
            if (Game.Objects[i].levelAchiev10) Game.Objects[i].levelAchiev10.order += 3;
        };

        LocalizeUpgradesAndAchievs();

        mod.updateAchievShadow();

        setTimeout(function(){
            Game.upgradesToRebuild=1;
            Game.recalculateGains=1;

            Game.Notify('Loaded Moonwork\'s New Tiers!', "Thanks for checking it out! Please contact me if you have any issues, questions, confusions or suggestions.<br>Version: "+mod.version, [10, 13, mod.imagePrefix + '/icons.png']);
        }, 1600);
    },
    save:function(){
        var mod = this;
        //note: we use stringified JSON for ease and clarity but you could store any type of string
        var toSave = {};
        toSave.version = mod.version;
        toSave.achievements = {};
        for (var i in mod.modAchievementList) {
            var me=Game.Achievements[mod.modAchievementList[i]];
            if (me) {
                toSave.achievements[mod.modAchievementList[i]] = {won: Math.min(me.won)};
            };
        };
        toSave.upgrades = {};
        for (var i in mod.modUpgradeList) {
            var me=Game.Upgrades[mod.modUpgradeList[i]];
            if (me) {
                toSave.upgrades[mod.modUpgradeList[i]] = {
                    unlocked: Math.min(me.unlocked),
                    bought: Math.min(me.bought)
                };
            };
        };

        return JSON.stringify(toSave);
    },
    load:function(str){
        var mod = this;
        var data = JSON.parse(str);
        console.log(data);

        // Pray to heaven upon high that this works

        setTimeout(function() {
            var savedVersion = data.version;
            var savedAchievements = data.achievements;
            for (var i in mod.modAchievementList)
            {
                var name = mod.modAchievementList[i];
                var me=Game.Achievements[name];
                if (me) {
                    if (savedAchievements[name])
                    {
                        me.won=savedAchievements[name].won||0;
                    }
                    else
                    {
                        me.won=0;
                    };
                    if (me.won && Game.CountsAsAchievementOwned(me.pool)) Game.AchievementsOwned++;
                };
            };
            var savedUpgrades = data.upgrades;
            for (var i in mod.modUpgradeList)
            {
                var name = mod.modUpgradeList[i];
                var me=Game.Upgrades[name];
                if (me) {
                    if (savedUpgrades[name])
                    {  
                        me.unlocked=savedUpgrades[name].unlocked||0;
                        me.bought=savedUpgrades[name].bought||0;
                        if (me.bought && Game.CountsAsUpgradeOwned(me.pool)) Game.UpgradesOwned++;
                    }
                    else
                    {
                        me.unlocked=0;me.bought=0;
                    };
                };
            };

            Game.upgradesToRebuild=1;
        }, 1500); // Have to do this stupidness because for some reason the minigame isn't loaded when .load is called.
    },
}

Game.registerMod('MoonworksNewTiers',mod);
var mod = 0;