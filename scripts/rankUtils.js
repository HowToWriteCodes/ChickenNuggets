/*Receives MMR values from Marvel Rivals API
and returns the corresponding rank*/

export function getRank(points) {
  
  if (typeof points !== "number" || points < 3000) return "Error Occurred";

  if (points > 5000) return "Eternity";

  const ranks = [
    [5000, "Celestial I"],
    [4900, "Celestial II"],
    [4800, "Celestial III"],
    [4700, "Grandmaster I"],
    [4600, "Grandmaster II"],
    [4500, "Grandmaster III"],
    [4400, "Diamond I"],
    [4300, "Diamond II"],
    [4200, "Diamond III"],
    [4100, "Platinum I"],
    [4000, "Platinum II"],
    [3900, "Platinum III"],
    [3800, "Gold I"],
    [3700, "Gold II"],
    [3600, "Gold III"],
    [3500, "Silver I"],
    [3400, "Silver II"],
    [3300, "Silver III"],
    [3200, "Bronze I"],
    [3100, "Bronze II"],
    [3000, "Bronze III"],
  ];

  return ranks.find(([threshold]) => points >= threshold)?.[0];
}
