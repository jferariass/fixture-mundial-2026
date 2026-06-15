async function test() {
    const data = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/athletes/45843').then(r => r.json());
    console.log(Object.keys(data));
    console.log(data.headshot);
    console.log(data.headshots);
    console.log(data.images);
    if(data.links) console.log(data.links);
}
test();
