async function test() {
    const data = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/athletes/298349').then(r => r.json());
    console.log(JSON.stringify(data.headshot, null, 2));
    
    // Also try another known player
    const data2 = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/athletes/45843').then(r => r.json()); // Lionel Messi is 45843 in ESPN soccer
    console.log(JSON.stringify(data2.headshot, null, 2));
}
test();
