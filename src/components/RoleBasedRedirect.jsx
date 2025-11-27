import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleBasedRedirect = () => {
  const { user } = useSelector((state) => state.user.current);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'owner':
      return <Navigate to="/owner/dashboard" replace />;
    case 'user':
      return <Navigate to="/user" replace />;
    default:
      return <Navigate to="/auth/login" replace />;
  }
};

export default RoleBasedRedirect;