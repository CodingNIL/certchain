import {
  Link,
  useNavigate
} from "react-router-dom";

const Navbar = ({ setIsAuth }) => {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    setIsAuth(false);

    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white">

      <h1 className="text-xl font-bold">
        CertChain 🔐
      </h1>

      <div className="flex gap-6">

        <Link to="/upload">Upload</Link>

        <Link to="/verify">Verify</Link>

        <Link to="/blockchain">Blocks</Link>

        <Link to="/merkle">Merkle</Link>

        <Link to="/scanner">QR Scanner</Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
