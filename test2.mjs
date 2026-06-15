async function test() {
    const data = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=150').then(r => r.json());
    
    let g1 = null;
    let g2 = null;
    let isStarted = false;
    
    data.events.forEach(ev => {
        const comp = ev.competitions[0];
        const statusId = comp.status ? comp.status.type.id : '1';
        
        if (statusId !== '1') {
            const home = comp.competitors.find(c => c.homeAway === 'home');
            const away = comp.competitors.find(c => c.homeAway === 'away');
            
            if (home.team.abbreviation === 'GER' && away.team.abbreviation === 'CUW') {
                console.log('Match GER vs CUW found!');
                console.log('Home Score:', home.score);
                console.log('Away Score:', away.score);
            }
        }
    });
}
test();
