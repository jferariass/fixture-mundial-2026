async function test() {
    const data = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams/481/roster').then(r => r.json());
    console.log(JSON.stringify(data.athletes[0], null, 2));
}
test();
