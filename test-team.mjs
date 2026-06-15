async function test() {
    const data = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams/481').then(r => r.json());
    console.log(Object.keys(data.team));
    console.log(data.team.record ? data.team.record.items[0] : 'no record');
    console.log(data.team.nextEvent ? 'Has next event' : 'No next event');
    console.log(data.team.franchise ? 'Has franchise info' : 'No franchise');
    if (data.team.standingSummary) console.log('Standing summary:', data.team.standingSummary);
}
test();
