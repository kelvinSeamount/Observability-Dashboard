import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { Outlet } from "react-router-dom"


const Layout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false)
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity lg:hidden ${sideBarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSideBarOpen(false)}
      />

      <Sidebar open={sideBarOpen} setOpen={setSideBarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
