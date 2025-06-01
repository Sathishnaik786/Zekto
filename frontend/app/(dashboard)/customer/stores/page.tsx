'use client';

import { useState } from 'react';
import { useStores } from '@/hooks/useStores';
import { Store } from '@/lib/api/store-service';

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const {
    stores,
    loading,
    error,
    total,
    page,
    setPage,
    refetch
  } = useStores({
    search: searchQuery,
    type: selectedType,
    category: selectedCategory,
    page: 1,
    limit: 12
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          <p>Error: {error.message}</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Stores</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Types</option>
            <option value="restaurant">Restaurant</option>
            <option value="retail">Retail</option>
            <option value="service">Service</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            {/* Add your categories here */}
          </select>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stores.map((store) => (
            <StoreCard key={store._id} store={store} />
          ))}
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {Math.ceil(total / 12)}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(total / 12)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* No Results */}
        {stores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No stores found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StoreCard({ store }: { store: Store }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        {/* Add store image here */}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{store.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{store.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm">{store.rating.average.toFixed(1)}</span>
            <span className="text-gray-500 text-sm ml-1">
              ({store.rating.count})
            </span>
          </div>
          <span className="text-sm text-gray-500">{store.type}</span>
        </div>
        <div className="mt-4">
          <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            View Store
          </button>
        </div>
      </div>
    </div>
  );
} 