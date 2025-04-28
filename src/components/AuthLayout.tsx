
import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side with image and brand */}
      <div className="hidden lg:flex lg:flex-1 retailayu-gradient items-center justify-center relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-white max-w-md p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">RetailAyu</h1>
            <p className="text-xl opacity-90">
              Complete grocery store and wholesale management system
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-lg">
              Manage your inventory, sales, customers, and staff all in one
              place.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span>Smart inventory management</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span>Point of sale with barcode scanning</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span>Customer loyalty system</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span>In-depth reports and analytics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side with auth forms */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <Link to="/" className="block mx-auto">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-retailayu-purple inline-flex items-center gap-2">
                  <span className="retailayu-gradient text-transparent bg-clip-text">RetailAyu</span>
                </h1>
              </div>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
