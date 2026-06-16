import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex flex-col flex-1">

        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>

    </div>
  );
}

export default MainLayout;