async function test() {
    const data = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams/481/roster').then(r => r.json());
    console.log(Object.keys(data.athletes[0]));
}
test();
