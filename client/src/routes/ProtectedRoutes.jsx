import { useLocation, Navigate } from "react-router-dom";


export default function ProtectedRoutes({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("userinfo");

  if (!token) {
    return (
      <>
        <Navigate to={"/"} state={{ from: location }} replace />
      </>
    );
  }

  return children;
}
