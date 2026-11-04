// import {Navigate} from 'react-router-dom'; import {useSelector} from 'react-redux'; export default function ProtectedRoute({children}){const {user,checking}=useSelector(s=>s.auth);if(checking)return <div className="container py-5">Checking session...</div>;return user?children:<Navigate to="/login" replace/>;}


import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHome, FaSpinner } from "react-icons/fa";

export default function ProtectedRoute({ children }) {
  const { user, checking } = useSelector((state) => state.auth);

  // Show loading screen while checking authentication
  if (checking) {
    return (
      <div className="protected-loading">
        <div className="protected-loading-card">
          <div className="protected-logo">
            <FaHome />
          </div>

          <h5>HomeEstimate</h5>
          <p>Verifying your session...</p>

          <FaSpinner className="protected-spinner" />
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users
  return user ? children : <Navigate to="/login" replace />;
}
