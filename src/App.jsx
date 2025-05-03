import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ThemeToggle from './components/ThemeToggle.jsx';

const states = ['Assam', 'Mizoram', 'Meghalaya', 'Manipur', 'Nagaland', 'Tripura', 'Sikkim'];

function App() {
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(false);
  const [pincodeCount, setPincodeCount] = useState(null);
  const [districtCount, setDistrictCount] = useState(null);
  const [error, setError] = useState('');
  
  const fetchData = async () => {
    setLoading(true);
    setError("");
    setPincodeCount(null);
    setDistrictCount(null);
  
    try {
      const apiKey = import.meta.env.VITE_API_KEY;
      const resourceid = import.meta.env.VITE_RESOURCE_ID;
  
      const url = `https://api.data.gov.in/resource/${resourceid}?api-key=${apiKey}&format=json&limit=all&filters[statename]=${selectedState}`;
  
      const response = await axios.get(url);
      const records = response.data.records;
  
      const pincodes = new Set();
      const districts = new Set();
  
      // Process the filtered records
      records.forEach((rec) => {
        pincodes.add(rec.pincode);
        districts.add(rec.district);
      });
  
      setPincodeCount(pincodes.size);
      setDistrictCount(districts.size);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch or filter data. Please check API key/resource ID.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <header className="flex justify-between items-center p-4 shadow-md">
        <h1 className="text-2xl font-bold">NE State Pincode Stats</h1>
        <ThemeToggle />
      </header>

      <main className="p-6 max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="border px-4 py-2 mb-4 w-full rounded dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">-- Select State --</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <button
            onClick={fetchData}
            disabled={!selectedState || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Get Stats'}
          </button>

          {error && <p className="text-red-600 mt-4">{error}</p>}

          {pincodeCount !== null && districtCount !== null && (
            <motion.div
              className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p>
                <strong>State:</strong> {selectedState}
              </p>
              <p>
                <strong>Unique Districts:</strong> {districtCount}
              </p>
              <p>
                <strong>Unique Pincodes:</strong> {pincodeCount}
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>

      <footer className="absolute bottom-0 left-0 w-full text-center p-4 text-sm text-gray-500 dark:text-gray-400">
        © 2025 | Built using data.gov.in API | with ❤️ by Deepak Varshney
      </footer>
    </div>
  );
}

export default App;
