async function test() {
    const r = await fetch('https://a.espncdn.com/i/headshots/soccer/players/full/45843.png');
    console.log('Status for 45843:', r.status);
    
    // Check Damián Bobadilla (from previous test, ID 301516)
    const r2 = await fetch('https://a.espncdn.com/i/headshots/soccer/players/full/301516.png');
    console.log('Status for 301516:', r2.status);
}
test();
