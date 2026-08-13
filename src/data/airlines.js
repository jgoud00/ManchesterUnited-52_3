export const AIRLINES = [
  { code: 'IN', name: 'Indira Air', color: '#E8A23D', short: 'IA' },
  { code: 'VT', name: 'Vistara Sky', color: '#7C6AE8', short: 'VS' },
  { code: 'AK', name: 'Akasha Wings', color: '#2E8B57', short: 'AW' },
  { code: 'GO', name: 'GoQuick', color: '#D9534F', short: 'GQ' },
  { code: 'SP', name: 'SpiceRoute', color: '#E85D75', short: 'SR' },
  { code: 'AI', name: 'AirBharat', color: '#3E7CB1', short: 'AB' },
];

export function findAirline(code) {
  return AIRLINES.find((a) => a.code === code);
}
