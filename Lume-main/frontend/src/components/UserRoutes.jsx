import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const UserRoute = ({ children }) => {
  const { isAuthenticated, hydrated } = useAuth();

  if (!hydrated) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}

export default UserRoute