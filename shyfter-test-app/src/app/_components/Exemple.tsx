"use client";
import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Identifiant unique pour le type d'élément qu'on va déplacer
const ItemTypes = {
  BOX: "box",
};

// Composant draggable (élément qu'on peut déplacer)
const DraggableBox: React.FC = () => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.BOX, // Type d'élément
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // Vérifie si l'élément est en cours de déplacement
    }),
  }));

  return (
    <div
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: "green",
        color: "white",
        width: "100px",
        height: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "move",
      }}
    >
      Drag me!
    </div>
  );
};

// Composant DropZone (zone où on peut déposer l'élément)
const DropZone: React.FC = () => {
  const [{ canDrop, isOver }, dropRef] = useDrop(() => ({
    accept: ItemTypes.BOX, // Accepte uniquement les éléments de type BOX
    drop: () => alert("Box dropped!"), // Action lors du drop
    collect: (monitor) => ({
      isOver: monitor.isOver(), // Si l'élément est au-dessus de la zone
      canDrop: monitor.canDrop(), // Si on peut déposer l'élément
    }),
  }));

  return (
    <div
      ref={dropRef}
      style={{
        width: "200px",
        height: "200px",
        backgroundColor: isOver ? "lightblue" : "lightgrey",
        border: "2px dashed black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {canDrop ? "Release to drop" : "Drag a box here"}
    </div>
  );
};

// Composant principal
const App: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "50px",
        }}
      >
        <DraggableBox />
        <DropZone />
      </div>
    </DndProvider>
  );
};

export default App;
