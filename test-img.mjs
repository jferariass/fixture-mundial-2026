async function test() {
    const r = await fetch('https://a.espncdn.com/i/headshots/soccer/players/full/298349.png');
    console.log(r.status);
    
    const r2 = await fetch('https://a.espncdn.com/i/headshots/soccer/players/full/2258.png'); // Messi or similar known ID
    console.log(r2.status);
}
test();
