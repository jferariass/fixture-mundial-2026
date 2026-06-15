async function test() {
    const data = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams/481/roster').then(r => r.json());
    
    let hasHeadshot = 0;
    data.athletes.forEach(a => {
        if (a.headshot && a.headshot.href) {
            hasHeadshot++;
            if (hasHeadshot === 1) {
                console.log('Sample Headshot:', a.headshot.href);
            }
        }
    });
    console.log('Total players:', data.athletes.length);
    console.log('Players with headshot:', hasHeadshot);
}
test();
