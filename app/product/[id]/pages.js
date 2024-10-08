"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

// Fetches product details by productId from the API
async function getProduct(productId) {
  const res = await fetch(
    `https://next-ecommerce-api.vercel.app/products/${productId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}

const ProductDetailPage = ({ params }) => {
  const { id: productId } = params;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("dateDesc");
  const [sortedReviews, setSortedReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(productId);
        setProduct(productData);
        setMainImage(productData.thumbnail);
        setSortedReviews(productData.reviews || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product data.");
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    if (product && product.reviews) {
      const reviews = [...product.reviews];
      switch (sortOption) {
        case "ratingDesc":
          reviews.sort((a, b) => b.rating - a.rating);
          break;
        case "ratingAsc":
          reviews.sort((a, b) => a.rating - b.rating);
          break;
        case "dateDesc":
          reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case "dateAsc":
          reviews.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        default:
          break;
      }
      setSortedReviews(reviews);
    }
  }, [sortOption, product]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-center mt-4 text-xl font-semibold">
        {error}
      </p>
    );
  }

  if (!product) {
    return (
      <p className="text-gray-500 text-center mt-4 text-xl font-semibold">
        Product not found.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back to Products */}
        <button
          onClick={() => router.back()}
          className="mb-8 text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors duration-300 flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Back to results</span>
        </button>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8">
            {/* Main Image and Gallery */}
            <div className="space-y-6">
              <div className="relative h-96 w-full">
                <Image
                  src={mainImage}
                  alt={`Image of ${product.title}`}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg transition-transform duration-300 transform hover:scale-105"
                  priority
                  onError={(e) => {
                    e.currentTarget.src = "/path/to/placeholder-image.jpg";
                  }}
                />
              </div>
              {product.images && product.images.length > 0 && (
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <div
                      key={index}
                      className="w-24 h-24 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-300"
                      onClick={() => setMainImage(img)}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail image ${index + 1}`}
                        width={96}
                        height={96}
                        objectFit="cover"
                        className="transition-opacity duration-300 hover:opacity-75"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/path/to/placeholder-image.jpg";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.title}
              </h1>
              <div className="flex items-center justify-between">
                <p className="text-4xl font-semibold text-green-500">
                  ${product.price.toFixed(2)}
                </p>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                  {product.category}
                </span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">Warranty:</span>
                  <span>{product.warrantyInformation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Discount:</span>
                  <span className="text-red-500 font-semibold">
                    {product.discountPercentage}% OFF
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Stock:</span>
                  <span>{product.stock} available</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">SKU:</span>
                  <span>{product.sku}</span>
                </div>
              </div>
              <div>
                <span className="font-semibold">Tags: </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Customer Reviews
            </h2>
            <div className="flex items-center space-x-2">
              <label
                htmlFor="sort-reviews"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Sort by:
              </label>
              <select
                id="sort-reviews"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="dateDesc">Newest First</option>
                <option value="dateAsc">Oldest First</option>
                <option value="ratingDesc">Highest Rating</option>
                <option value="ratingAsc">Lowest Rating</option>
              </select>
            </div>
          </div>

          {sortedReviews.length > 0 ? (
            <div className="space-y-8">
              {sortedReviews.map((review, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {review.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927C9.36 2.036 10.64 2.036 10.951 2.927l1.116 3.43a1 1 0 00.95.69h3.612c.97 0 1.37 1.24.588 1.81l-2.924 2.1a1 1 0 00-.364 1.118l1.116 3.43c.311.89-.755 1.631-1.538 1.118l-2.924-2.1a1 1 0 00-1.176 0l-2.924 2.1c-.783.513-1.849-.228-1.538-1.118l1.116-3.43a1 1 0 00-.364-1.118l-2.924-2.1c-.783-.57-.382-1.81.588-1.81h3.612a1 1 0 00.95-.69l1.116-3.43z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {review.comment}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
