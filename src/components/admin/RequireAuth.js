import {useLocation, Navigate, Outlet} from 'react-router-dom'

const RequireAuth = () => {

  const token = localStorage.getItem('jwtToken')
  const location = useLocation()

  return (
    token ? <Outlet /> : <Navigate to="/" state={{ from: location}} replace />
  )
}

export default RequireAuth
