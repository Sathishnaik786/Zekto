import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import StoreList from '../../components/Customer/StoreList';
import Cart from '../../components/Customer/Cart';

export default function CustomerDashboard() {
  const { user, loading } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <StoreList />
        </div>
        <div>
          <Cart items={cart} />
        </div>
      </div>
    </div>
  );
} 