import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'

export default function AppLayout() {
  return (
    <div className="flex h-screen flex-col bg-paper">
      <TopBar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
