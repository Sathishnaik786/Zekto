import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { merchantService } from '../../services/merchantService';

export default function StoreList() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: stores, isLoading, error } = useQuery(
    'stores',
    () => merchantService.getStores(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  if (isLoading) return <div>Loading stores...</div>;
  if (error) return <div>Error loading stores</div>;

  const filteredStores = stores?.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search stores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStores?.map(store => (
          <div key={store.id} className="border rounded p-4">
            <h3 className="text-lg font-semibold">{store.name}</h3>
            <p className="text-gray-600">{store.description}</p>
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                {store.distance}km away
              </span>
            </div>
            <button
              onClick={() => window.location.href = `/customer/store/${store.id}`}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              View Store
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 