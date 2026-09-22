# Moonwork's New Tiers

*Current version: 1*    

This is a mod for [Cookie Clicker](https://orteil.dashnet.org/cookieclicker/) which adds a bunch of new upgrade and achievement tiers to a frankly ridiculous extent.

Intended to be either loaded standalone or used for any content mods someone may make.

### Disclaimers:
While the new tiers do have new recoloured sprites, anything that requires an entirely new sprite just uses a template one as I only have so much time and little pixel art ability.

While some thought was put into whether or not achievements / upgrades were obtainable, do not expect to be able to 100% CC if you load this mod as it literally just adds new tiers and I'm not sure if the upgrades + milk from that is enough for all of them to be obtained in a reasonable manner. You have been warned!

This mod also does make one change to existing Cookie Clicker, that being that many cursor upgrades are nerfed to make up for the new upgrades / milk gain and to prevent cursors making up 100% of your CpS during midgame. (There comes a point where they just become x20 cursor Cps, which is absurd).

Due to the massive number of new upgrades / achievements, your save file size may also explode. Sorry!

Bugs may exist, make a backup of your save before loading.

## How to add to your own content mods

MNT is intended to act as a free-to-use mod that can be coupled with anyone's own content mod so they don't have to spend time making a bunch of new tiers themselves. All that I ask is credit somewhere visible!

Put this block of code after your mod has loaded all the new achievements and upgrades it adds. MNT will automatically calculate which total upgrades / total heavenly upgrades achievements are impossible to obtain and make them shadow if they aren't.

> // Load Moonwork's New Tiers      
> if (!Game.mods['MoonworksNewTiers']) {    
>   Game.LoadMod('https://moonworks64.github.io/MoonworksNewTiers/MoonworksNewTiers.js');   
> } else Game.mods['MoonworksNewTiers'].updateAchievShadow();   

MNT also does all the saving / loading of its upgrades / achievements itself, so no need to worry about that.

By default, MNT caps the number of cursors achievements to 1500, and the total buildings achievements to 25,000. Anything beyond these requirements are shadows. If you want to extend these achievement lineages, you can do so with the updateAchievShadow() function.

Example:
> Game.mods['MoonworksNewTiers'].updateAchievShadow({maxCursorAchiev: 2800, maxTotalBuildingsAchiev: 60000});   

This will make all of the number of cursors achievements with a requirement of up to and including 2,800 cursors non-shadow, and make all total buildings achievements with a requirement of up to and including 60,000 total buildings non-shadow.

## How to load standalone

Go to Cookie Clicker and load the mod by putting:   

> Game.LoadMod('https://moonworks64.github.io/MoonworksNewTiers/MoonworksNewTiers.js');   

into the console, which can be accessed by right-clicking -> inspect -> console.    

Alternatively, use a bookmarklet with the javascript code:  

> javascript:Game.LoadMod('https://moonworks64.github.io/MoonworksNewTiers/MoonworksNewTiers.js'); 

To make a bookmarklet: Go to your bookmarks, right click -> new page, then set the url to the above javascript code and give it a good name like "Load Moonwork's New Tiers Mod". Save that bookmark and whenever you click on it, it'll run the javascript code above and load the mod in a single click! Make sure you're on your Cookie Clicker tab when you do this though.   

The mod will need to be loaded every time you open up Cookie Clicker unless you use something like [CCMM](https://github.com/klattmose/CookieClickerModManager).    

No Steam version yet! I don't have Cookie Clicker on steam, sorry!  

Bugs may be present! Create a backup of your save data before loading!

## Content

Currently it adds:
- **14 new tiers**
    - All have a matching new unshackled heavenly upgrade alongside it.
    - All have new building upgrades / achievements.
        - Total cursors achievement is capped to 1,500 by default, although the rest up to 2,800 are shadow achievements.
        - Cursors have also been given 4 extra achievements to match up with the vanilla tiers.
- **8 new production achievements for all buildings**
- **1 new level achievement for all buildings**
- **36 new bank and Cps achievements**
    - Some may be impossible or ludicrous to obtain. Sorry!
    - They also all use template icons.
- **26 new milks**
    - All use the default milk assets as I do not have the time or pixel art skill to create unique assets for all of them. I apologize for this and recommend you use the milk selector to pick out you favourite vanilla CC milk if this is a concern.
- **20 new total buildings achievements**
    - By default, achievements past 25,000 total buildings are shadow achievements.
- **18 new total upgrades achievements**
    - Any that aren't obtainable will be made into shadow achievements on mod load.
- **4 new total heavenly upgrades achievements**
    - Any that aren't obtainable will be made into shadow achievements on mod load.
- **14 new number of everything achievements**
- **14 new builder biscuits**
    - All use template icons.
- **21 new ascended with cookies baked achievements**
    - Some may be impossible or ludicrous to obtain. Sorry!
    - They also all use template icons.

There's 336 new upgrades (normal and heavenly), with a total word count of 17625!
There's 627 new achievements (normal and shadow), with a total word count of 672!
Yes they were all hand-written, it was very tiring. But fun!

Hope you enjoy :D

## Limitations

MNT may break with certain other mods active. Particularly with ones that use function wrapping, although any that inject code using some cursor upgrade lines may also break as MNT rewrites those lines to nerf the cursor upgrades.

The game can have lag spikes when looking in the stats menu as the number of upgrades / achievements takes a while to re-render.

I like writing and many upgrades have paragraphs of text within them. I do not apologize.
I like writing but I may not be good at it either, expect some typos, improper grammar, run-on sentences, and confusing concepts to understand. I do apologize for this.

Any sprite that required a completely new sprite just uses a template as I don't have the time nor pixel art skill to make them in a reasonable manner.
Milk icons / textures all use the plain icon assets for the same reason.

If you have any issues, concerns or questions, please do ask me! I'm in the Cookie Clicker discord server which can be found in the Cookie Clicker top ribbon.