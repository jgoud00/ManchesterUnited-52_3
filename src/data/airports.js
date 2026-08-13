export const AIRPORTS = [
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International', country: 'India' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International', country: 'India' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda International', country: 'India' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International', country: 'India' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International', country: 'India' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International', country: 'India' },
  { code: 'PNQ', city: 'Pune', name: 'Pune Airport', country: 'India' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International', country: 'India' },
  { code: 'GOI', city: 'Goa', name: 'Manohar International', country: 'India' },
  { code: 'COK', city: 'Kochi', name: 'Cochin International', country: 'India' },
  { code: 'JAI', city: 'Jaipur', name: 'Jaipur International', country: 'India' },
  { code: 'LKO', city: 'Lucknow', name: 'Chaudhary Charan Singh International', country: 'India' },
  { code: 'IXC', city: 'Chandigarh', name: 'Chandigarh Airport', country: 'India' },
  { code: 'VTZ', city: 'Visakhapatnam', name: 'Visakhapatnam Airport', country: 'India' },
  { code: 'TIR', city: 'Tirupati', name: 'Tirupati Airport', country: 'India' },
  { code: 'NAG', city: 'Nagpur', name: 'Dr. Babasaheb Ambedkar International', country: 'India' },
  { code: 'IXZ', city: 'Port Blair', name: 'Veer Savarkar International', country: 'India' },
  { code: 'SXR', city: 'Srinagar', name: 'Sheikh ul-Alam International', country: 'India' },
  { code: 'GAU', city: 'Guwahati', name: 'Lokpriya Gopinath Bordoloi International', country: 'India' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International', country: 'UAE' },
  { code: 'SIN', city: 'Singapore', name: 'Changi Airport', country: 'Singapore' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport', country: 'Thailand' },
];

export function findAirport(code) {
  return AIRPORTS.find((a) => a.code === code);
}
