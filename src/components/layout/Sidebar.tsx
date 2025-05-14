import { Activity, BarChart4, FileText, GitBranch, HomeIcon, Layers, Network, ServerCrash, X } from "lucide-react";
import { useState } from "react"
import { NavLink } from "react-router-dom";

interface SidebarProps{
    open:boolean,
setOpen:(open:boolean)=>void
}

const Sidebar = ({open,setOpen}:SidebarProps) => {
    const [isCollapsed,setIsCollapsed]=useState(true)
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-200 ease-in-out lg:translate-x-0 lg:static ${
        open ? "translate-x-0" : "translate-x-full"
      } ${isCollapsed ? "w-16 lg:w-16" : "w-64"}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar header with logo*/}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            <span
              className={`font-semibold text-lg text-gray-900 dark:text-white transition-opacity duration-200 ${
                isCollapsed ? "opacity-0 hidden" : "opacity-100"
              }`}
            >
              ObserveMon
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className={`p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden transition-colors focus-ring ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <HomeIcon className="h-4 w-4" />
                <span
                  className={`transition-opacity duration-200 ${
                    isCollapsed ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  Dashboard
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <Network className="h-4 w-4" />
                <span
                  className={`transition-opacity duration-200 ${
                    isCollapsed ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  Services
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/traces"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <GitBranch className="h-4 w-4" />
                <span
                  className={`transition-opacity duration-200 ${
                    isCollapsed ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  Traces
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/metrics"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <BarChart4 className="h-4 w-4" />
                <span
                  className={`transition-opacity duration-200 ${
                    isCollapsed ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  Metrics
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/logs"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <FileText className="h-4 w-4" />
                <span
                  className={`transition-opacity duration-200 ${
                    isCollapsed ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  Logs
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/errors"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <ServerCrash className="h-4 w-4" />
                <span
                  className={`transition-opacity duration-200 ${
                    isCollapsed ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  Errors
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/latency"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <Activity className="h-4 w-4" />
                <span
                  className={`transition-opacity duration-200 ${
                    isCollapsed ? "opacity-0 hidden" : "opacity-100"
                  }`}
                >
                  Latency
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar
