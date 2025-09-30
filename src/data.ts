import type { TripData } from './types'

export const tripData: TripData = {
  startISO: '2025-10-10',
  endISO: '2025-10-20',
  days: [
    { dayNumber: 1, dateISO: '2025-10-10', cityArea: 'Rome', summary: 'Historic center walk. Dinner in Trastevere or Monti.', sleepSuggestion: 'Stay in Monti/Trastevere', stops: [
      { id: 'd1-1', type: 'sight', title: 'Pantheon → Trevi Fountain → Spanish Steps' },
      { id: 'd1-2', type: 'food', title: 'Dinner in Trastevere' },
    ] },
    { dayNumber: 2, dateISO: '2025-10-11', cityArea: 'Rome', summary: 'Vatican early morning (prebook), Colosseum & Forum afternoon.', sleepSuggestion: 'Rome center', stops: [
      { id: 'd2-1', type: 'sight', title: 'Vatican Museums + St. Peter\'s (early)' },
      { id: 'd2-2', type: 'sight', title: 'Colosseum + Roman Forum' },
    ] },
    { dayNumber: 3, dateISO: '2025-10-12', cityArea: 'Rome', summary: 'Final Rome highlights, Monti evening.', sleepSuggestion: 'Rome center', stops: [
      { id: 'd3-1', type: 'sight', title: 'Piazza Navona & Campo de\' Fiori' },
      { id: 'd3-2', type: 'food', title: 'Monti district evening' },
    ] },
    { dayNumber: 4, dateISO: '2025-10-13', cityArea: 'Rome → Val d\'Orcia', summary: 'Pick up car, drive to Tuscany via Orvieto.', driveInfo: 'Rome → Orvieto (1h30) → Pienza (1h30)', sleepSuggestion: 'Agriturismo near Pienza/Bagno Vignoni', stops: [
      { id: 'd4-1', type: 'sight', title: 'Orvieto Cathedral & white wine', time: '1h30 from Rome' },
      { id: 'd4-2', type: 'sight', title: 'Pienza (pecorino cheese)' },
      { id: 'd4-3', type: 'sight', title: 'Montepulciano (Vino Nobile)' },
    ] },
    { dayNumber: 5, dateISO: '2025-10-14', cityArea: 'Val d\'Orcia', summary: 'Explore Val d\'Orcia: wine tasting, hot springs, hilltop towns.', sleepSuggestion: 'Agriturismo in Val d\'Orcia', stops: [
      { id: 'd5-1', type: 'sight', title: 'Montalcino (Brunello tasting)' },
      { id: 'd5-2', type: 'sight', title: 'Bagno Vignoni hot springs', time: '30 min drive' },
      { id: 'd5-3', type: 'lodging', title: 'Agriturismo with vineyard views' },
    ] },
    { dayNumber: 6, dateISO: '2025-10-15', cityArea: 'Siena', summary: 'Siena morning: Piazza del Campo & Duomo.', driveInfo: 'Val d\'Orcia → Siena (1h15)', sleepSuggestion: 'Siena historic center', stops: [
      { id: 'd6-1', type: 'sight', title: 'Piazza del Campo' },
      { id: 'd6-2', type: 'sight', title: 'Siena Cathedral' },
      { id: 'd6-3', type: 'food', title: 'Lunch in Siena' },
    ] },
    { dayNumber: 7, dateISO: '2025-10-16', cityArea: 'Siena → Florence', summary: 'Chianti road SR222: Castellina, Greve, wineries. Return car in Florence.', driveInfo: 'Siena → Greve (1h15) → Florence (45min)', sleepSuggestion: 'Florence center', stops: [
      { id: 'd7-1', type: 'sight', title: 'Castellina in Chianti' },
      { id: 'd7-2', type: 'food', title: 'Greve wineries (SR222)' },
      { id: 'd7-3', type: 'other', title: 'Return car, avoid ZTL' },
    ] },
    { dayNumber: 8, dateISO: '2025-10-17', cityArea: 'Florence', summary: 'Duomo, David at Accademia, Mercato Centrale, sunset at Piazzale Michelangelo.', sleepSuggestion: 'Florence center', stops: [
      { id: 'd8-1', type: 'sight', title: 'Duomo (optional climb)' },
      { id: 'd8-2', type: 'sight', title: 'Accademia (David - timed ticket)' },
      { id: 'd8-3', type: 'food', title: 'Mercato Centrale lunch' },
      { id: 'd8-4', type: 'sight', title: 'Piazzale Michelangelo (sunset)' },
    ] },
    { dayNumber: 9, dateISO: '2025-10-18', cityArea: 'Florence → Venice', summary: 'Drive to Venice, optional Padua stop. Return car at Piazzale Roma.', driveInfo: 'Florence → Venice (3h15 direct) or via Padua (+1h15)', sleepSuggestion: 'Venice on-island (Cannaregio/Dorsoduro)', stops: [
      { id: 'd9-1', type: 'other', title: 'Optional: Padua stop' },
      { id: 'd9-2', type: 'other', title: 'Return car at Piazzale Roma' },
      { id: 'd9-3', type: 'other', title: 'Vaporetto to hotel' },
    ] },
    { dayNumber: 10, dateISO: '2025-10-19', cityArea: 'Venice', summary: 'St. Mark\'s, Doge\'s Palace, Rialto. Gondola at dusk. Cicchetti bars.', sleepSuggestion: 'Venice', stops: [
      { id: 'd10-1', type: 'sight', title: 'St. Mark\'s Square & Basilica' },
      { id: 'd10-2', type: 'sight', title: 'Doge\'s Palace' },
      { id: 'd10-3', type: 'sight', title: 'Rialto Bridge' },
      { id: 'd10-4', type: 'food', title: 'Cicchetti in bacari' },
    ] },
    { dayNumber: 11, dateISO: '2025-10-20', cityArea: 'Venice', summary: 'Burano & Murano islands. Seafood risotto. Last evening.', sleepSuggestion: 'Venice', stops: [
      { id: 'd11-1', type: 'sight', title: 'Burano (colorful houses)' },
      { id: 'd11-2', type: 'sight', title: 'Murano (glass workshops)' },
      { id: 'd11-3', type: 'food', title: 'Seafood risotto dinner' },
    ] },
  ],
  points: [
    // Day 1 - Rome Historic Center
    { id: 'rome-start', title: 'Rome (Start)', category: 'city', lat: 41.9028, lng: 12.4964, region: 'Rome', day: 1, description: 'Trip starting point', isStart: true },
    { id: 'piazza-navona', title: 'Piazza Navona', category: 'sight', lat: 41.8986, lng: 12.4735, region: 'Rome', day: 1, description: 'Beautiful baroque square with fountains' },
    { id: 'pantheon', title: 'Pantheon', category: 'sight', lat: 41.8986, lng: 12.4769, region: 'Rome', day: 1, description: 'Ancient Roman temple with impressive dome' },
    { id: 'trevi-fountain', title: 'Trevi Fountain', category: 'sight', lat: 41.9009, lng: 12.4833, region: 'Rome', day: 1, description: 'Famous baroque fountain - throw a coin!' },
    { id: 'spanish-steps', title: 'Spanish Steps', category: 'sight', lat: 41.9057, lng: 12.4823, region: 'Rome', day: 1, description: 'Monumental stairway with great city views' },
    { id: 'trastevere-dinner', title: 'Trastevere Dinner', category: 'food', lat: 41.8894, lng: 12.4694, region: 'Rome', day: 1, description: 'Traditional Roman dinner in bohemian neighborhood' },
    
    // Day 2 - Vatican & Colosseum
    { id: 'vatican', title: 'Vatican Museums', category: 'sight', lat: 41.9065, lng: 12.4536, region: 'Rome', day: 2, description: 'Sistine Chapel & world-class art collection' },
    { id: 'st-peters', title: 'St. Peter\'s Basilica', category: 'sight', lat: 41.9022, lng: 12.4539, region: 'Rome', day: 2, description: 'Largest church in the world' },
    { id: 'colosseum', title: 'Colosseum', category: 'sight', lat: 41.8902, lng: 12.4922, region: 'Rome', day: 2, description: 'Ancient amphitheater & Roman Forum' },
    { id: 'monti-evening', title: 'Monti District', category: 'food', lat: 41.8955, lng: 12.4925, region: 'Rome', day: 2, description: 'Trendy neighborhood for dinner' },
    
    // Day 3 - Drive to Tuscany
    { id: 'orvieto', title: 'Orvieto', category: 'sight', lat: 42.7181, lng: 12.1116, region: 'Val d\'Orcia', day: 3, description: 'Hilltop town with stunning cathedral' },
    { id: 'pienza', title: 'Pienza', category: 'sight', lat: 43.0774, lng: 11.6786, region: 'Val d\'Orcia', day: 3, description: 'Renaissance "ideal city" with pecorino cheese' },
    { id: 'montepulciano', title: 'Montepulciano', category: 'sight', lat: 43.0922, lng: 11.7875, region: 'Val d\'Orcia', day: 3, description: 'Medieval hilltop town famous for Vino Nobile wine' },
    { id: 'val-dorcia-agriturismo', title: 'Val d\'Orcia Agriturismo', category: 'lodging', lat: 43.0500, lng: 11.6500, region: 'Val d\'Orcia', day: 3, description: 'Farm stay with vineyard views' },
    
    // Day 4 - Val d'Orcia Deep Dive
    { id: 'montalcino', title: 'Montalcino', category: 'sight', lat: 43.0609, lng: 11.489, region: 'Val d\'Orcia', day: 4, description: 'Brunello wine capital with fortress views' },
    { id: 'san-quirico', title: 'San Quirico d\'Orcia', category: 'sight', lat: 43.0572, lng: 11.6049, region: 'Val d\'Orcia', day: 4, description: 'Charming village with Renaissance gardens' },
    { id: 'bagno-vignoni', title: 'Bagno Vignoni', category: 'sight', lat: 43.0272, lng: 11.6202, region: 'Val d\'Orcia', day: 4, description: 'Ancient thermal spa village' },
    { id: 'bagni-san-filippo', title: 'Bagni San Filippo', category: 'sight', lat: 42.9597, lng: 11.5239, region: 'Val d\'Orcia', day: 4, description: 'Natural hot springs in the forest' },
    
    // Day 5 - Siena & Chianti Road
    { id: 'siena', title: 'Siena', category: 'city', lat: 43.3188, lng: 11.3308, region: 'Chianti', day: 5, description: 'Medieval city with famous Palio horse race square' },
    { id: 'siena-duomo', title: 'Siena Cathedral', category: 'sight', lat: 43.3173, lng: 11.3296, region: 'Chianti', day: 5, description: 'Stunning striped marble cathedral' },
    { id: 'castellina', title: 'Castellina in Chianti', category: 'sight', lat: 43.4706, lng: 11.2906, region: 'Chianti', day: 5, description: 'Medieval fortress town with underground passages' },
    { id: 'greve', title: 'Greve in Chianti', category: 'sight', lat: 43.5851, lng: 11.3164, region: 'Chianti', day: 5, description: 'Central Chianti town with wine tastings at Le Cantine' },
    { id: 'cantine-greve', title: 'Le Cantine di Greve', category: 'food', lat: 43.5851, lng: 11.3164, region: 'Chianti', day: 5, description: 'Famous wine bar with 100+ Chianti wines on tap' },
    
    // Day 6 - Florence
    { id: 'florence', title: 'Florence', category: 'city', lat: 43.7696, lng: 11.2558, region: 'Florence', day: 6, description: 'Renaissance capital of the world' },
    { id: 'florence-duomo', title: 'Florence Cathedral', category: 'sight', lat: 43.7732, lng: 11.2560, region: 'Florence', day: 6, description: 'Iconic dome by Brunelleschi' },
    { id: 'accademia', title: 'Accademia (David)', category: 'sight', lat: 43.776, lng: 11.2587, region: 'Florence', day: 6, description: 'Michelangelo\'s David statue' },
    { id: 'mercato-centrale', title: 'Mercato Centrale', category: 'food', lat: 43.7755, lng: 11.2538, region: 'Florence', day: 6, description: 'Historic food market with gourmet food court' },
    { id: 'boboli-gardens', title: 'Boboli Gardens', category: 'sight', lat: 43.7647, lng: 11.2499, region: 'Florence', day: 6, description: 'Renaissance gardens behind Pitti Palace' },
    { id: 'piazzale-michelangelo', title: 'Piazzale Michelangelo', category: 'sight', lat: 43.7629, lng: 11.2653, region: 'Florence', day: 6, description: 'Best sunset views over Florence' },
    
    // Day 7 - Train to Venice
    { id: 'venice', title: 'Venice', category: 'city', lat: 45.4408, lng: 12.3155, region: 'Venice', day: 7, description: 'Floating city of canals and bridges' },
    { id: 'rialto', title: 'Rialto Market & Bridge', category: 'sight', lat: 45.438, lng: 12.3358, region: 'Venice', day: 7, description: 'Historic market and iconic bridge over Grand Canal' },
    { id: 'cicchetti-bars', title: 'Cicchetti Bars', category: 'food', lat: 45.4385, lng: 12.3345, region: 'Venice', day: 7, description: 'Venetian tapas bars near Rialto' },
    
    // Day 8 - Venice Islands or Dorsoduro
    { id: 'san-marco', title: 'St. Mark\'s Square', category: 'sight', lat: 45.4342, lng: 12.3386, region: 'Venice', day: 8, description: 'Napoleon\'s "drawing room of Europe"' },
    { id: 'doges-palace', title: 'Doge\'s Palace', category: 'sight', lat: 45.4338, lng: 12.3403, region: 'Venice', day: 8, description: 'Former residence of Venetian rulers' },
    { id: 'burano', title: 'Burano', category: 'sight', lat: 45.4857, lng: 12.4178, region: 'Venice', day: 8, description: 'Colorful fishermen\'s island famous for lace' },
    { id: 'murano', title: 'Murano', category: 'sight', lat: 45.4588, lng: 12.3537, region: 'Venice', day: 8, description: 'Glass-making island with live demonstrations' },
    
    // Day 9 - Venice Final Day
    { id: 'campanile', title: 'St. Mark\'s Campanile', category: 'sight', lat: 45.4342, lng: 12.3386, region: 'Venice', day: 9, description: 'Bell tower with panoramic views' },
    { id: 'cannaregio', title: 'Cannaregio Evening', category: 'food', lat: 45.4444, lng: 12.3275, region: 'Venice', day: 9, description: 'Local neighborhood away from crowds' },
    
    // Day 11 - Final Venice Day
    { id: 'venice-final', title: 'Venice (Final Day)', category: 'other', lat: 45.4408, lng: 12.3155, region: 'Venice', day: 11, description: 'Last memories before departure', isEnd: true },
  ],
  drivingTimes: [
    { from: 'Rome', to: 'Orvieto', duration: '1h 30min', distance: '121 km' },
    { from: 'Orvieto', to: 'Pienza', duration: '1h 30min', distance: '95 km' },
    { from: 'Val d\'Orcia', to: 'Siena', duration: '1h 15min', distance: '60 km' },
    { from: 'Siena', to: 'Greve', duration: '1h 15min', distance: '50 km' },
    { from: 'Greve', to: 'Florence', duration: '45min', distance: '30 km' },
    { from: 'Florence', to: 'Venice', duration: '3h 15min', distance: '260 km' },
    { from: 'Florence', to: 'Padua', duration: '2h 30min', distance: '210 km' },
    { from: 'Padua', to: 'Venice', duration: '45min', distance: '40 km' },
  ]
}


