import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import authService from '../appwrite/auth'
import { login } from '../store/authSlice'
import Container from '../components/Container'

function UserProfile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userData = useSelector(state => state.auth.userData)
  const authStatus = useSelector(state => state.auth.status)
  
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [orders, setOrders] = useState([])
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: userData?.name || '',
      email: userData?.email || '',
    }
  })
  
  useEffect(() => {
    if (!authStatus) {
      navigate('/login')
    }
    
    // Reset form with user data when it changes
    if (userData) {
      reset({
        name: userData.name || '',
        email: userData.email || '',
      })
    }
    
    // Fetch user orders (mock data for now)
    fetchUserOrders()
  }, [authStatus, userData, navigate, reset])
  
  const fetchUserOrders = () => {
    // This would fetch orders from your backend
    // For now, we'll use mock data
    const mockOrders = [
      {
        id: 'ORD123456',
        date: '2023-05-15',
        total: 1250,
        status: 'Delivered',
        items: [
          { name: 'Birthday Gift Box', quantity: 1, price: 850 },
          { name: 'Greeting Card', quantity: 2, price: 200 }
        ]
      },
      {
        id: 'ORD789012',
        date: '2023-06-20',
        total: 1800,
        status: 'Processing',
        items: [
          { name: 'Anniversary Special', quantity: 1, price: 1500 },
          { name: 'Gift Wrapping', quantity: 1, price: 300 }
        ]
      }
    ]
    
    setOrders(mockOrders)
  }
  
  const onSubmit = async (data) => {
    setError("")
    setLoading(true)
    
    try {
      // This would update the user profile in your backend
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local user data
      const updatedUserData = {
        ...userData,
        name: data.name,
      }
      
      dispatch(login({ userData: updatedUserData }))
      setIsEditing(false)
      
    } catch (error) {
      console.error("Profile update error:", error)
      setError(error.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }
  
  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/')
    } catch (error) {
      console.error("Logout error:", error)
    }
  }
  
  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{userData?.name}</h2>
                  <p className="text-gray-600">{userData?.email}</p>
                </div>
              </div>
              
              <ul className="space-y-2 mb-6">
                <li className="bg-purple-50 text-purple-700 font-medium px-4 py-2 rounded-lg">
                  Profile Information
                </li>
                <li className="px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <Link to="/orders" className="block">Order History</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  Saved Addresses
                </li>
                <li className="px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  Wishlist
                </li>
              </ul>
              
              <button
                onClick={handleLogout}
                className="w-full bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register("name", { required: "Name is required" })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      disabled
                      {...register("email")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-gray-500 text-sm mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1">{userData?.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                    <p className="mt-1">{userData?.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                    <p className="mt-1">{new Date(userData?.$createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-gray-600">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{order.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : order.status === 'Processing' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-purple-600 hover:text-purple-900">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default UserProfile