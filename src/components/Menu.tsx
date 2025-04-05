import Card from "./Card";
const Menu = () => {
  return (
    <div className="menu-mitad">
      <h2>Seleccione una opción</h2>
      <div className="cartitas">
        <Card
          titulo="Opción 1"
          parrafo="Descripción 1"
          children="Crear"
          imagen=""
        />
        <Card
          titulo="Opción 2"
          parrafo="Descripción 2"
          children="Crear"
          imagen=""
        />
        <Card
          titulo="Opción 3"
          parrafo="Descripción 3"
          children="Crear"
          imagen=""
        />
      </div>
      <div className="menu-mitad">
        <h1>Diagramas ya creados</h1>
        <div>
          <Card
            titulo="Opción 1"
            parrafo="Descripción 1"
            children="Crear"
            imagen=""
          />
        </div>
      </div>
    </div>
  );
};

export default Menu;
