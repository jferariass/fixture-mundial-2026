async function test() {
    const data = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=150').then(r => r.json());
    
    let incidencias = [];
    data.events.forEach(ev => {
        const comp = ev.competitions[0];
        if (comp.details && comp.details.length > 0) {
            comp.details.forEach(d => {
                let player = "";
                if (d.athletesInvolved && d.athletesInvolved.length > 0) {
                    player = d.athletesInvolved[0].shortName || d.athletesInvolved[0].displayName;
                }
                incidencias.push({
                    type: d.type ? d.type.text : "Unknown",
                    player: player
                });
            });
        }
    });
    console.log(incidencias.slice(0, 10));
}
test();
