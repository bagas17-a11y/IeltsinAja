import { Navigate } from "react-router-dom";

const NotFound = () => {
  return <Navigate to="/pricing-selection" replace />;
};

export default NotFound;
