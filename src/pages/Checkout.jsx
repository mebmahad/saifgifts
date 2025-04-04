import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { clearCart } from '../store/cartSlice'
import Container from '../components/Container'
import service from '../appwrite/config'

function Checkout() {
  const { items, totalAmount } = useSelector(state => state.cart)
  const authStatus = useSelector(state => state.auth.status)
  const userData = useSelector(state => state.auth.userData)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authStatus) {
      navigate('/login')
    }
    
    // Redirect to home if cart is empty
    if (items.length === 0 && !orderPlaced) {
      navigate('/')
    }
    
    // Fetch user addresses if authenticated
    if (authStatus && userData) {
      fetchUserAddresses()
    }
  }, [authStatus, items.length, navigate, userData])
  
  const fetchUserAddresses = async () => {
    try {
      // This would be implemented with your backend service
      // For now, we'll use mock data
      const mockAddresses = [
        {
          id: '1',
          name: userData?.name || 'User',
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          phone: '9876543210'
        }
      ]
      setAddresses(mockAddresses)
      if (mockAddresses.length > 0) {
        setSelectedAddress(mockAddresses[0].id)
      } else {
        setShowAddressForm(true)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }
  
  const onAddressSubmit = (data) => {
    // This would save the address to the backend
    // For now, we'll just add it to the local state
    const newAddress = {
      id: Date.now().toString(),
      ...data
    }
    
    setAddresses([...addresses, newAddress])
    setSelectedAddress(newAddress.id)
    setShowAddressForm(false)
    reset()
  }
  
  const handlePlaceOrder = async () => {
    if (!selectedAddress) return
    
    setLoading(true)
    
    try {
      // This would create an order in your backend
      // For now, we'll just simulate it
      const address = addresses.find(addr => addr.id === selectedAddress)
      
      const orderData = {
        userId: userData?.$id,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: totalAmount + 50, // Adding shipping
        shippingAddress: address,
        orderDate: new Date().toISOString(),
        status: 'Pending'
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate a random order ID
      const generatedOrderId = 'ORD' + Math.floor(100000 + Math.random() * 900000)
      setOrderId(generatedOrderId)
      setOrderPlaced(true)
      dispatch(clearCart())
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDownloadInvoice = () => {
    // This would generate and download an invoice
    alert('Invoice download functionality would be implemented here')
  }
  
  if (orderPlaced) {
    return (
      <Container>
        <div className="py-16 text-center">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="mb-6 text-green-500 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
            <p className="text-gray-600 mb-6">Your order ID is: <span className="font-semibold">{orderId}</span></p>
            
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleDownloadInvoice}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Download Invoice
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </Container>
    )
  }
  
  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
                
                {addresses.length > 0 && !showAddressForm && (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map(address => (
                        <div 
                          key={address.id}
                          className={`border rounded-lg p-4 cursor-pointer ${
                            selectedAddress === address.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedAddress(address.id)}
                        >
                          <div className="flex items-start">
                            <input
                              type="radio"
                              name="address"
                              checked={selectedAddress === address.id}
                              onChange={() => setSelectedAddress(address.id)}
                              className="mt-1 mr-3"
                            />
                            <div>
                              <p className="font-medium">{address.name}</p>
                              <p className="text-sm text-gray-600">{address.street}</p>
                              <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                              <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      className="mt-4 text-purple-600 hover:text-purple-700"
                      onClick={() => setShowAddressForm(true)}
                    >
                      + Add a new address
                    </button>
                  </div>
                )}
                
                {showAddressForm && (
                  <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          defaultValue={userData?.name || ''}
                          {...register("name", { required: "Name is required" })}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                          }`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phone"
                          {...register("phone", { 
                            required: "Phone number is required",
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Please enter a valid 10-digit phone number"
                            }
                          })}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="street" className="block text-gray-700 font-medium mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="street"
                        {...register("street", { required: "Street address is required" })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.street ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                        }`}
                      />
                      {errors.street && (
                        <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-gray-700 font-medium mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          {...register("city", { required: "City is required" })}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.city ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                          }`}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-gray-700 font-medium mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          {...register("state", { required: "State is required" })}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.state ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                          }`}
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-gray-700 font-medium mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          {...register("zipCode", { 
                            required: "ZIP code is required",
                            pattern: {
                              value: /^[0-9]{6}$/,
                              message: "Please enter a valid 6-digit ZIP code"
                            }
                          })}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.zipCode ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                          }`}
                        />
                        {errors.zipCode && (
                          <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAddressForm(false)}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      checked
                      className="mr-3"
                    />
                    <label htmlFor="cod" className="font-medium">Cash on Delivery</label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-6">Pay when your order is delivered</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="max-h-64 overflow-y-auto mb-4">
                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.id} className="py-4 flex">
                      <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-center object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=Product";
                          }}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm font-medium text-gray-900">₹{item.price}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">₹{totalAmount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium">₹50.00</p>
                </div>
                <div className="flex justify-between text-base font-medium mt-4">
                  <p>Total</p>
                  <p>₹{(totalAmount + 50).toFixed(2)}</p>
                </div>
              </div>
              
              <button
                type="button"
                disabled={!selectedAddress || loading}
                className="w-full mt-6 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePlaceOrder}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Checkout