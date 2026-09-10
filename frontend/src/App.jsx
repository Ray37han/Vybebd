import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense, Component } from 'react'
import Navbar from './components/Navbar.optimized'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import VybePageTransitions from './components/VybePageTransitions'
import CheckoutSkeleton from './components/CheckoutSkeleton'
import LoadingStore from './components/LoadingStore'
import ProtectedRoute from './components/ProtectedRoute'
import { AnalyticsProvider } from './context/AnalyticsContext'
import SmoothScroll from './components/SmoothScroll'
import './components/PageTransitions.css'

// Critical storefront entry: static import for fastest initial paint
import Home from './pages/Home'

// Storefront secondary pages: lazy-loaded on demand
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Customize = lazy(() => import('./pages/Customize'))
const Cart = lazy(() => import('./pages/Cart'))
const MyOrders = lazy(() => import('./pages/MyOrders'))
const Account = lazy(() => import('./pages/Account'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Dedicated category landing pages
const HomeDecor = lazy(() => import('./pages/HomeDecor'))
const SolarWobbler = lazy(() => import('./pages/SolarWobbler'))

// Checkout flow: lazy loaded
const Checkout = lazy(() => import('./pages/QuickCheckout'))
const OrderSuccess = lazy(() => import('./pages/OrderConfirmed'))

// Admin components: lazy loaded to isolate heavy dependencies (recharts, jspdf, html2canvas)
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminProducts = lazy(() => import('./pages/admin/Products'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const AdminFeaturedPosters = lazy(() => import('./pages/admin/FeaturedPosters'))
const AdminHeroItems = lazy(() => import('./pages/admin/HeroItems'))
const AdminCustomOrders = lazy(() => import('./pages/admin/AdminCustomOrders'))
const AdminCustomApprovals = lazy(() => import('./pages/admin/CustomApprovals'))
const AdminBulkImport = lazy(() => import('./pages/admin/BulkImport'))
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'))
const DeliveryDashboard = lazy(() => import('./pages/admin/DeliveryDashboard'))

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      const clearCartAndReload = () => {
        try { localStorage.removeItem('cart-storage'); } catch (e) { }
        window.location.href = '/';
      };
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Something went wrong</h2>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>Please refresh the page or clear your cart to continue.</p>
          <p style={{ color: '#999', fontSize: '0.75rem', marginBottom: '1.5rem', fontFamily: 'monospace' }}>{this.state.error?.message}</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="/" style={{ padding: '0.75rem 1.5rem', background: '#7c3aed', color: 'white', borderRadius: '0.75rem', textDecoration: 'none' }}>Go to Home</a>
            <button onClick={clearCartAndReload} style={{ padding: '0.75rem 1.5rem', background: '#ef4444', color: 'white', borderRadius: '0.75rem', border: 'none', cursor: 'pointer' }}>Clear Cart &amp; Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <ErrorBoundary>
      <AnalyticsProvider>
        <SmoothScroll>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-16">
              <VybePageTransitions location={location}>
                <Suspense fallback={<LoadingStore text="Loading page..." />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    {/* New category landing pages */}
                    <Route path="/home-decor" element={<HomeDecor />} />
                    <Route path="/solar-wobbler" element={<SolarWobbler />} />
                    <Route path="/customize" element={<Customize />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />

                    {/* Protected Routes */}
                    {/* Checkout – no auth required, pipeline-based */}
                    <Route path="/checkout" element={
                      <Suspense fallback={<CheckoutSkeleton />}>
                        <Checkout />
                      </Suspense>
                    } />
                    <Route path="/quick-checkout" element={
                      <Suspense fallback={<CheckoutSkeleton />}>
                        <Checkout />
                      </Suspense>
                    } />
                    <Route path="/order-success" element={
                      <Suspense fallback={<CheckoutSkeleton />}>
                        <OrderSuccess />
                      </Suspense>
                    } />
                    <Route path="/order-confirmed" element={
                      <Suspense fallback={<CheckoutSkeleton />}>
                        <OrderSuccess />
                      </Suspense>
                    } />

                    <Route path="/my-orders" element={
                      <ProtectedRoute>
                        <MyOrders />
                      </ProtectedRoute>
                    } />
                    <Route path="/account" element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/products" element={
                      <ProtectedRoute adminOnly>
                        <AdminProducts />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/orders" element={
                      <ProtectedRoute adminOnly>
                        <DeliveryDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                      <ProtectedRoute adminOnly>
                        <AdminUsers />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/featured-posters" element={
                      <ProtectedRoute adminOnly>
                        <AdminFeaturedPosters />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/hero-items" element={
                      <ProtectedRoute adminOnly>
                        <AdminHeroItems />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/custom-orders" element={
                      <ProtectedRoute adminOnly>
                        <AdminCustomOrders />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/custom-approvals" element={
                      <ProtectedRoute adminOnly>
                        <AdminCustomApprovals />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/bulk-import" element={
                      <ProtectedRoute adminOnly>
                        <AdminBulkImport />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/analytics" element={
                      <ProtectedRoute adminOnly>
                        <AdminAnalytics />
                      </ProtectedRoute>
                    } />
                    {/* 404 Catch-all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </VybePageTransitions>
            </main>
            <Footer />
            <BackToTop />
          </div>
        </SmoothScroll>
      </AnalyticsProvider>
    </ErrorBoundary>
  )
}

export default App
