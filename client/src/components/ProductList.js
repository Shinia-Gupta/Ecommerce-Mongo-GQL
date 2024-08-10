"use client";
import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import ProductCard from './ProductCard';
import PaginationList from './PaginationList';
import SkeletonCard from './SkeletonCard';

const GET_PRODUCTS = gql`
  query GetProducts($skip: Int, $limit: Int) {
    getProducts(skip: $skip, limit: $limit) {
      products {
        _id
        name
        salePrice
        url
        image
        customerReviewCount
      }
      resultCount
    }
  }
`;

const ProductList = () => {
  const [skip, setSkip] = useState(0);
  const [limit] = useState(21);
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { skip, limit },
    notifyOnNetworkStatusChange: true,
  });

  return (
    <div style={{ padding: '1rem' }}>
      {error && <p>Error fetching products: {error.message}</p>}
      <div className="flex flex-wrap gap-4 p-4">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : data?.getProducts?.products.map(product => (
              <ProductCard
                key={product._id}
                id={product._id}
                title={product.name}
                price={product.salePrice}
                url={product.url}
                image={product.image}
                reviewCount={product.customerReviewCount}
                className="w-64" // or any other width you prefer
              />
            ))}
      </div>
      {data?.getProducts?.products && (
        <PaginationList
          totalItems={data.getProducts.resultCount || 0}
          itemsPerPage={limit}
          onPageChange={newPage => setSkip(Math.max(0, (newPage - 1) * limit))}
        />
      )}
    </div>
  );
};

export default ProductList;
