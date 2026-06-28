import urllib.request
import json
from datetime import datetime

url = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=150"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())

print(f"Total events: {len(data.get('events', []))}")
playoff_events = []

for ev in data.get("events", []):
    comp = ev["competitions"][0]
    competitors = comp["competitors"]
    if len(competitors) < 2: continue
    
    t1 = competitors[0]["team"].get("abbreviation", "")
    t2 = competitors[1]["team"].get("abbreviation", "")
    
    dt = ev["date"]
    
    # Simple check if it's past group stage (June 28 or later)
    # Group stage ended June 27 local / June 28 UTC 02:00
    if dt >= "2026-06-28T12:00Z":
        playoff_events.append({
            "id": ev["id"],
            "date": dt,
            "t1": t1,
            "t2": t2,
            "name": ev["name"],
            "shortName": ev["shortName"]
        })

playoff_events.sort(key=lambda x: x["date"])
for p in playoff_events:
    print(f"{p['date']} - {p['name']} ({p['t1']} vs {p['t2']})")
