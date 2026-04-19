import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navItem = (path, label) => {
    const isActive = location.pathname === path;

    return (
      <Link
        to={path}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition
          ${
            isActive
              ? "bg-white text-black"
              : "text-gray-300 hover:text-white hover:bg-zinc-800"
          }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="w-full bg-black border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
      
      {/* Logo / Title */}
      <h1 className="text-lg font-bold text-white">
        Hybrid CoT AV
      </h1>

      {/* Navigation */}
      <div className="flex gap-3">
        {navItem("/", "Simulation")}
        {navItem("/compare", "Compare Models")}
        {navItem("/analytics", "Analytics")}
      </div>
    </div>
  );
};

export default Navbar;