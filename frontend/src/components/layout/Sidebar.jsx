import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Assets",
      path: "/assets",
    },
    {
      name: "Allocations",
      path: "/allocations",
    },
    {
      name: "Employees",
      path: "/employees",
    },
    {
      name: "Categories",
      path: "/categories",
    },
    {
      name: "Vendors",
      path: "/vendors",
    },
    {
      name: "Locations",
      path: "/locations",
    },
    {
      name: "Reports",
      path: "/reports"
    },
    {
      name: "Damages",
      path: "/damages",
    }
  ];

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-5 border-b flex items-center gap-3">

        <img
          src={logo}
          alt="FL Assets"
          className="w-auto"
        />

        {/* <div>
          <h1 className="text-lg font-bold">
            Stock Nest
          </h1>

          <p className="text-xs text-gray-500">
            Asset Management
          </p>
        </div> */}

      </div>

      <nav className="p-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block p-3 rounded mb-2 ${location.pathname === item.path
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
              }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;