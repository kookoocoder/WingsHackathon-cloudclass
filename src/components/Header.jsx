import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/personal-info');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="user-info">
        <FaUserCircle className="user-avatar" onClick={handleProfileClick} />
        <span className="username" onClick={handleProfileClick}>{user.username}</span>
        <button onClick={handleLogout} className="logout">logout</button>
      </div>
    </header>
  );
}