import React from 'react'
import { FaceExtraction } from './modules/FaceExtraction'

export const menuOptions = ['Face Extraction']

function App() {
  const [menu, setMenu] = React.useState(menuOptions[0])
  // React.useEffect(() => {
  //   document.title = 'Image Recognition'
  // }, [])
  return (
    <div className="App">
      <header className="App-header">
        <span>Image Recognition</span>
        <nav>
          {menuOptions.map((item: string, i: number) => (
            <a
              key={i}
              href="#"
              onClick={(e: any) => {
                e.preventDefault()
                setMenu(item)
              }}
              className={item === menu ? 'active' : ''}
            >
              {item}
            </a>
          ))}
        </nav>
      </header>
      <div className="body">
        {menu === 'Face Extraction' ? <FaceExtraction /> : <div />}
      </div>
    </div>
  )
}

export default App
