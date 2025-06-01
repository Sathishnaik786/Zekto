'use client';

import { useState } from 'react';
import { useProduct, useRelatedProducts } from '@/hooks/useProducts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import Image from 'next/image';
import { useCreateOrder } from '@/hooks/useOrders';
import { useToast } from '@/components/ui/use-toast';

export default function ProductPage({ params }: { params: { id: string } }) {
  const { product, loading, error } = useProduct(params.id);
  const { products: relatedProducts, loading: relatedLoading } = useRelatedProducts(params.id);
  const { createOrder, loading: orderLoading } = useCreateOrder();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await createOrder({
        store: product.store._id,
        items: [{
          product: product._id,
          quantity,
        }],
        deliveryAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          location: {
            type: 'Point',
            coordinates: [72.8777, 19.0760]
          }
        },
        paymentMethod: 'cash'
      });

      toast({
        title: 'Success',
        description: 'Product added to cart successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add product to cart',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center">
          {error?.message || 'Product not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="relative aspect-square">
          <Image
            src={product.images.find(img => img.isDefault)?.url || product.images[0]?.url || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
          {product.discount && (
            <Badge className="absolute top-4 right-4 bg-red-500">
              {product.discount}% OFF
            </Badge>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg">{product.rating.average.toFixed(1)}</span>
              <span className="text-gray-500">({product.rating.count} reviews)</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Variants</h3>
              {product.variants.map((variant) => (
                <div key={variant.name} className="space-y-2">
                  <p className="text-sm text-gray-500">{variant.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => (
                      <Button
                        key={option.value}
                        variant="outline"
                        className="text-sm"
                      >
                        {option.label}
                        {option.priceAdjustment > 0 && ` (+₹${option.priceAdjustment})`}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                -
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(q => q + 1)}
              >
                +
              </Button>
            </div>
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={orderLoading || !product.isAvailable}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {orderLoading ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Store Information</h3>
            <p className="text-gray-600">{product.store.name}</p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="aspect-square w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : (
              relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-4">
                      <Image
                        src={relatedProduct.images.find(img => img.isDefault)?.url || relatedProduct.images[0]?.url || '/placeholder.png'}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-semibold mb-1">{relatedProduct.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">₹{relatedProduct.price}</span>
                      {relatedProduct.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{relatedProduct.originalPrice}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
} 