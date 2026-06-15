async function test() {
    const data = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=150').then(r => r.json());
    
    let uniqueTypes = new Set();
    data.events.forEach(ev => {
        const comp = ev.competitions[0];
        if (comp.details && comp.details.length > 0) {
            comp.details.forEach(d => {
                if (d.type && d.type.text) {
                    uniqueTypes.add(d.type.text);
                }
            });
        }
    });
    console.log(Array.from(uniqueTypes));
}
test();
