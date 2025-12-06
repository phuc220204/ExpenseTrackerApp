import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Statistics from './pages/Statistics/Statistics'
import DataTools from './pages/DataTools/DataTools'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import { TransactionsProvider } from './contexts/TransactionsContext'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <TransactionsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route - Trang đăng nhập */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes - Cần đăng nhập mới truy cập được */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="data-tools" element={<DataTools />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </TransactionsProvider>
    </AuthProvider>
  )
}

export default App
