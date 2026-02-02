import React from 'react'
import type { ModeloA } from '@paquetes/modelos' //ejemplo de importación desde un paquete compartido

function App() {

  const hola : ModeloA = {
    nombre: 'Ejemplo',
    descripcion: 'Descripción del ejemplo'
  }

  return (
    <p>
      Estoy vivo 👋

      {JSON.stringify(hola)}

    </p>
  )
}

export default App
