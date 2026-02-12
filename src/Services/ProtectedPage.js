import { useEffect } from "react";

export default function ProtectedPage() {
  const location = useLocation();

  const protectedRoutes = [
    "/report",
    "/datagathering",
    "/commondashboard",
    "/userflow",
  ];

  const currentPath = location.pathname;
  const isProtected = protectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  if (!isProtected) return <Outlet />;

  const stored = localStorage.getItem("userData");
  let userData = null;

  try {
    userData = stored ? JSON.parse(stored) : null;
  } catch { }

  if (!userData?.user_id) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
