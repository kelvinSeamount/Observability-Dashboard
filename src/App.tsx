import { Route, Routes } from "react-router-dom"
import Layout from "./components/layout/Layout"


const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Routes>
        <Route path="/" element={<Layout/>}>

        </Route>
      </Routes>
    </div>
  )
}

export default App
