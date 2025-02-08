/*Receives rankValue from Marvel Rivals API
and returns the corresponding rank along with base MMR*/

export function getRank(rankValue) {
  
  if (typeof rankValue !== "number" || points < 3000) return "Rank not found";

 const rankFilter =  {
    '1': [3000, 'Bronze III'],
    '2': [3100, 'Bronze II'],
    '3': [3200, 'Bronze I'],
    '4': [3300, 'Silver III'],
    '5': [3400, 'Silver II'],
    '6': [3500, 'Silver I'],
    '7': [3600, 'Gold III'],
    '8': [3700, 'Gold II'],
    '9': [3800, 'Gold I'],
    '10': [3900, 'Platinum III'],
    '11': [4000, 'Platinum II'],
    '12': [4100, 'Platinum I'],
    '13': [4200, 'Diamond III'],
    '14': [4300, 'Diamond II'],
    '15': [4400, 'Diamond I'],
    '16': [4500, 'Grandmaster III'],
    '17': [4600, 'Grandmaster II'],
    '18': [4700, 'Grandmaster I'],
    '19': [4800, 'Celestial III'],
    '20': [4900, 'Celestial II'],
    '21': [5000, 'Celestial I'],
    '22': [5100, 'Eternity'],
    '23': [5100, 'One Above All']
  }
  
  
  return (rankValue) => rankFilter[rankValue] || rankFilter['1'];
}
