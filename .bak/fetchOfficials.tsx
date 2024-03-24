// pages/api/fetchOfficials.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log(`successfully entered fetchOfficials.js`);

  const { address } = req.body;
  const openStatesApiKey = process.env.OPEN_STATES_API_KEY; 
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY; 

  console.log(`successfully set address: ${address}`);

  // Build endpoint URL
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleMapsApiKey}`;
  
  // Make request
  try {
    const geocodeResponse = await axios.get(geocodeUrl);
    if (geocodeResponse.data.status !== 'OK' || !geocodeResponse.data.results.length) {
      console.error('Geocoding failed:', geocodeResponse.data.status);
      return res.status(404).json({ message: 'Geocoding failed' });
    }

    //console.log(geocodeResponse.data.results[0]);

    // Extract latitude and longitude
    const location = geocodeResponse.data.results[0].geometry.location;
    const addressComponents = geocodeResponse.data.results[0].address_components;
    const cityObj = addressComponents.find(component => component.types.includes('locality'));
    const stateObj = addressComponents.find(component => component.types.includes('administrative_area_level_1'));

    // Set new values for objects
    const city = cityObj ? cityObj.long_name : 'Not found';
    const state = stateObj ? stateObj.long_name : 'Not found';
    const latitude = location.lat;
    const longitude = location.lng;

    // Fetch officials from Open States using latitude and longitude
    // https://v3.openstates.org/docs#/people/people_geo_people_geo_get
    const requestUrl = `https://v3.openstates.org/people.geo?apikey=${openStatesApiKey}&lat=${latitude}&lng=${longitude}`;

    const response = await axios.get(requestUrl);
    const officialsData = response.data.results;

    console.log(officialsData);

    // Combine all the data into one object to return
    const result = {
      city,
      state,
      latitude,
      longitude,
      officials: officialsData,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to process request:', error);
    res.status(500).json({ message: 'Failed to process request' });
  }
}