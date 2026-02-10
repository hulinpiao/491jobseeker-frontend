import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
          >
            491JobSeeker
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/jobs"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Browse Jobs
            </Link>

            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </nav>

          {/* Mobile menu button - simplified for now */}
          <div className="md:hidden">
            <Link to="/jobs">
              <Button variant="ghost" size="sm">
                Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
