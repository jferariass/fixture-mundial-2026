async function test() {
    const data = await fetch('https://sports.core.api.espn.com/v2/sports/soccer/leagues/fifa.world/athletes/45843').then(r => r.json());
    console.log(Object.keys(data));
    console.log(JSON.stringify(data.headshot, null, 2));
}
test();
