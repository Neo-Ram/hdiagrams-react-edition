import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import * as UI from "./Inputs";
import Spinner from "./Spinner";
import ProfileBar from "./ProfileBar";
import ProjectCard from "./ProjectCard";
import CreateProjectModal from "./CreateProjectModal";
import "./Menu.css";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const Menu = () => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const response = await axios.get(`http://localhost:3000/projects?user_id=${userId}`);
    const mappedProjects = response.data.map((project: any) => ({
      ...project,
      createdAt: project.created_at,
    }));
    setProjects(mappedProjects);
  } catch (error) {
    console.error('Error al cargar los proyectos:', error);
  }
  };
//pruebas
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    console.log('Menu useEffect', {userName, userId})
    if (!userName) {
      console.log('Redirigiendo a login porque falta userName');
      navigate('/login');
      return;
    }
    
    fetchProjects();
  }, [navigate]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="menu-container">
        <ProfileBar />
        <div className="menu-content">
          <div className="carrusel">
            <Carousel>
              <Carousel.Item interval={2000}>
                <img
                  className="d-block w-100"
                  src="/Diagramas-transformed.png"
                  alt="First slide"
                  onLoad={handleImageLoad}
                />
                <Carousel.Caption>
                  <h3>La mejor herramienta para crear diagramas</h3>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval={2000}>
                <img
                  className="d-block w-100"
                  src="/Diagramas2-transformed.jpeg"
                  alt="Second slide"
                  onLoad={handleImageLoad}
                />
                <Carousel.Caption>
                  <h3>O lo mas probable es que no</h3>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval={2000}>
                <img
                  className="d-block w-100"
                  src="/Diagrama3-transformed.jpeg"
                  alt="Third slide"
                  onLoad={handleImageLoad}
                />
                <Carousel.Caption>
                  <h3>Pero existe 👍🏼</h3>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>

          <div className="projects-section">
            <UI.H2>Mis Proyectos</UI.H2>
            <div className="projects-grid">
              <ProjectCard
                isNew
                onClick={() => setShowModal(true)}
              />
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => navigate(`/project/${project.id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <CreateProjectModal
          onClose={() => {
            setShowModal(false);
            fetchProjects(); // Recargar proyectos después de crear uno nuevo
          }}
        />
      )}
    </>
  );
};

export default Menu;
