import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import Container from '../components/Container'
import ProductsTab from '../components/ProductManagement/ProductsTab'
import DashboardTab from '../components/Dashboard/DashboardTab'

function AdminDashboard() {
  const navigate = useNavigate()
  const authStatus = useSelector(state => state.auth.status)
  const userData = useSelector(state => state.auth.userData)
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: []
  })
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authStatus) {
      navigate('/login')
      return
    }
    
    // Check if user has admin role (this would be implemented with your backend)
    // For now, we'll just simulate it
    const isAdmin = userData?.role === 'admin'
    if (!isAdmin) {
      navigate('/')
      return
    }
    
    // Fetch admin dashboard data
    fetchDashboardData()
  }, [authStatus, navigate, userData])
  
  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // This would fetch data from your backend
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API delay
      
      const mockStats = {
        totalOrders: 156,
        pendingOrders: 23,
        totalProducts: 48,
        totalRevenue: 125750,
        recentOrders: [
          { id: 'ORD123456', customer: 'Rahul Sharma', date: '2023-07-15', total: 1250, status: 'Delivered' },
          { id: 'ORD789012', customer: 'Priya Patel', date: '2023-07-16', total: 1800, status: 'Processing' },
          { id: 'ORD345678', customer: 'Amit Kumar', date: '2023-07-17', total: 950, status: 'Shipped' },
          { id: 'ORD901234', customer: 'Neha Singh', date: '2023-07-18', total: 2100, status: 'Pending' },
          { id: 'ORD567890', customer: 'Vikram Joshi', date: '2023-07-19', total: 1500, status: 'Processing' }
        ],
        topProducts: [
          { id: 'PROD001', name: 'Birthday Gift Box', sold: 42, revenue: 35700 },
          { id: 'PROD002', name: 'Anniversary Special', sold: 38, revenue: 57000 },
          { id: 'PROD003', name: 'Chocolate Gift Hamper', sold: 35, revenue: 33250 },
          { id: 'PROD004', name: 'Personalized Photo Frame', sold: 30, revenue: 15000 },
          { id: 'PROD005', name: 'Premium Gift Set', sold: 25, revenue: 37500 }
        ]
      }
      
      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Shipped':
        return 'bg-blue-100 text-blue-800'
      case 'Pending':
        return 'bg-orange-100 text-orange-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab stats={stats} />
      case 'products':
        return <ProductsTab />
      default:
        return (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h2>
            <p className="text-gray-600 mb-6">
              This section is under development. Please check back later.
            </p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )
    }
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{userData?.name}</h2>
                  <p className="text-gray-600">Administrator</p>
                </div>
              </div>
              
              <ul className="space-y-2 mb-6">
                <li 
                  className={`px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'dashboard' ? 'bg-purple-50 text-purple-700 font-medium' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </li>
                <li 
                  className={`px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'orders' ? 'bg-purple-50 text-purple-700 font-medium' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('orders')}
                >
                  Orders
                </li>
                <li 
                  className={`px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'products' ? 'bg-purple-50 text-purple-700 font-medium' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('products')}
                >
                  Products
                </li>
                <li 
                  className={`px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'customers' ? 'bg-purple-50 text-purple-700 font-medium' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('customers')}
                >
                  Customers
                </li>
                <li 
                  className={`px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'settings' ? 'bg-purple-50 text-purple-700 font-medium' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </li>
              </ul>
              
              <Link 
                to="/"
                className="block w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                Back to Store
              </Link>
            </div>
          </div>
          
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              renderActiveTab()
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}

export default AdminDashboard