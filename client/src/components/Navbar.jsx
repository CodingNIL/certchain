import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const linkStyle = (path) =>
    `px-4 py-2 rounded-xl text-sm ${
      location.pathname === path
        ? "bg-blue-500 text-white shadow-lg"
        : "text-gray-300 hover:bg-white/10"
    }`;

  return (
    <div className="glass mx-4 mt-4 px-6 py-3 flex justify-between items-center">

      <h1 className="text-xl font-bold text-blue-400">
        CertChain 🔐
      </h1>

      <div className="flex gap-2">

        <Link to="/" className={linkStyle("/")}>Upload</Link>
        <Link to="/verify" className={linkStyle("/verify")}>Verify</Link>
        <Link to="/blockchain" className={linkStyle("/blockchain")}>Chain</Link>
        <Link to="/merkle" className={linkStyle("/merkle")}>Merkle</Link>
        <Link to="/scanner" className={linkStyle("/scanner")}>Scan</Link>

      </div>

    </div>
  );
};

export default Navbar;
