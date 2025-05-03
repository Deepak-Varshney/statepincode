import { useState } from "react";
import axios from "axios";

const states = ["Assam", "Mizoram", "Meghalaya", "Manipur", "Nagaland", "Tripura", "Sikkim"];

function App() {
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(false);
  const [pincodeCount, setPincodeCount] = useState(null);
  const [districtCount, setDistrictCount] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setPincodeCount(null);
    setDistrictCount(null);

    try {
      const apiKey = import.meta.env.VITE_API_KEY;
      const resourceid = import.meta.env.VITE_RESOURCE_ID;
      const url = `https://api.data.gov.in/resource/${resourceid}?api-key=${apiKey}&format=json&limit=all`;
      const response = await axios.get(url);
      const records = response.data.records;

      const filtered = records.filter(
        (item) => item.statename?.toLowerCase() === selectedState.toLowerCase()
      );

      const pincodes = new Set();
      const districts = new Set();

      filtered.forEach((rec) => {
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
    <div className="p-6 font-sans max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">NE State Pincode Stats</h1>

      <select
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        className="border px-4 py-2 mb-4 w-full"
      >
        <option value="">-- Select State --</option>
        {states.map((state) => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>

      <button
        onClick={fetchData}
        disabled={!selectedState || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Loading..." : "Get Stats"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {pincodeCount !== null && districtCount !== null && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <p><strong>State:</strong> {selectedState}</p>
          <p><strong>Unique Districts:</strong> {districtCount}</p>
          <p><strong>Unique Pincodes:</strong> {pincodeCount}</p>
        </div>
      )}
    </div>
  );
}

export default App;
