import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import service from '../appwrite/config'
import Container from '../components/Container'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await service.getProduct(id)
        if (productData) {
          setProduct(productData)
        } else {
          setError("Product not found")
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [id])
  
  const handleQuantityChange = (value) => {
    if (value < 1) return
    setQuantity(value)
  }
  
  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }))
  }
  
  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity }))
    navigate('/checkout')
  }
  
  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </Container>
    )
  }
  
  if (error || !product) {
    return (
      <Container>
        <div className="py-16 text-center">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist or has been removed."}</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Container>
    )
  }
  
  return (
    <Container>
      <div className="py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              {product.featuredimage ? (
                <img 
                  src={service.getFilePreview(product.featuredimage)}
                  alt={product.name} 
                  className="w-full h-auto object-cover"
                />
              ) : product.images && product.images.length > 0 ? (
                <img
                  src={service.getMultipleFilesPreviews(product.images)[selectedImage]}
                  alt={`${product.name} - Image ${selectedImage + 1}`}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-purple-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={service.getMultipleFilesPreviews(product.images)[index]}
                      alt={`${product.name} - Thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">{product.shortdescription}</p>
                
                <div className="flex items-baseline mb-2">
                  <span className="text-2xl font-bold text-purple-600 mr-2">₹{product.salerate}</span>
                  {product.purchaserate > product.salerate && (
                    <span className="text-lg text-gray-500 line-through">₹{product.purchaserate}</span>
                  )}
                </div>
                
                {product.purchaserate > product.salerate && (
                  <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                    {Math.round((1 - product.salerate / product.purchaserate) * 100)}% OFF
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Quantity</h3>
                <div className="flex items-center border border-gray-300 rounded w-32">
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:text-gray-800"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="flex-1 text-center py-2 text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:text-gray-800"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  type="button"
                  className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Description</h3>
                <div className="prose prose-sm text-gray-600">
                  <p>{product.longdescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ProductDetail