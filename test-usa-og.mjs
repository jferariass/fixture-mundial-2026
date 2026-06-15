async function test() {
    const data = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=150').then(r => r.json());
    
    data.events.forEach(ev => {
        const comp = ev.competitions[0];
        const home = comp.competitors.find(c => c.homeAway === 'home');
        const away = comp.competitors.find(c => c.homeAway === 'away');
        if (home.team.abbreviation === 'USA' || away.team.abbreviation === 'USA') {
            if (comp.details && comp.details.length > 0) {
                comp.details.forEach(d => {
                    if (d.type.text === 'Own Goal') {
                        console.log('Own Goal details:', JSON.stringify(d, null, 2));
                    }
                });
            }
        }
    });
}
test();
