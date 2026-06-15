async function test() {
    const data = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=150').then(r => r.json());
    
    data.events.forEach(ev => {
        const comp = ev.competitions[0];
        const home = comp.competitors.find(c => c.homeAway === 'home');
        const away = comp.competitors.find(c => c.homeAway === 'away');
        if (home.team.abbreviation === 'GER' && away.team.abbreviation === 'CUW') {
            console.log('Match found!');
            comp.details.forEach(d => {
                if(d.scoreValue === 1) {
                    console.log('GOAL type:', d.type.text, 'team:', d.team.id, 'ownGoal:', d.ownGoal);
                }
            });
        }
    });
}
test();
