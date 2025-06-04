import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import './ProfileBar.css';

const ProfileBar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('/default-profile.png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    const savedImage = localStorage.getItem('profileImage');
    if (name) {
      setUserName(name);
    }
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setProfileImage(imageUrl);
        localStorage.setItem('profileImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const menuItems = [
    { icon: '📊', text: 'Recientes', onClick: () => console.log('Recientes') },
    { icon: '📁', text: 'Mis Diagramas', onClick: () => console.log('Mis Diagramas') },
    { icon: '⭐', text: 'Favoritos', onClick: () => console.log('Favoritos') },
    { icon: '✨', text: 'Hopes and Dreams', onClick: () => console.log('Hopes and Dreams') },
  ];

  return (
    <div className="profile-bar">
      <div className="profile-section">
        <div className="profile-image-container">
          <img src={profileImage} alt="Profile" className="profile-image" />
          <div 
            className="edit-profile-image" 
            onClick={() => fileInputRef.current?.click()}
            title="Cambiar foto de perfil"
          >
            ✏️
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="file-input"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="welcome-message">
          ¡Bienvenido, <span className="user-name">{userName}</span>!
        </div>
      </div>

      <div className="menu-sections">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item" onClick={item.onClick}>
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        <span>🚪</span>
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default ProfileBar; 