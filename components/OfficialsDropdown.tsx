// components/OfficialsDropdown.js
import { useState } from 'react';
import axios from 'axios';

export default function OfficialsDropdown({electedOfficial, onSelectOfficial}) {
  const [zipCode, setZipCode] = useState('');
  const [officials, setOfficials] = useState([]);
  const apiKey = process.env.OPENSTATES_API_KEY;

  const fetchOfficials = async () => {
    try {
      // Make a POST request to the API endpoint
      //console.log(officials);
      const response = await axios.post('/api/fetchOfficials', { zipCode });
      // Assuming the API returns an array or an object that can be directly set as 'officials'
      setOfficials(Array.isArray(response.data.officials) ? response.data.officials : []);

    } catch (error) {
      console.error('Error fetching officials:', error);
      setOfficials([]); // Ensure officials is reset to an empty array on error
    }
  };

  return (
    <div>
      <input
        type="text"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        placeholder="Enter ZIP code"
      />
      <button onClick={fetchOfficials}>Show Elected Officials</button>
      <select 
        value={electedOfficial}
        onChange={(e) => onSelectOfficial(e.target.value)}
        placeholder="Select an elected official"
        required>
          <option>Select an elected official</option>
          {officials.map((official, index) => (
            <option key={index} value={official.name}>
              {official.name} ({official.party.charAt(0)}) - {official.jurisdiction.name} {official.current_role.title} ({official.current_role.district})
            </option>
        ))}
      </select>
    </div>
  );
}