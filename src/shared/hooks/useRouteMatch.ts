'use client'

import { usePathname } from "next/navigation";

export default function useRouteMatch(path: string) {
  const pathname = usePathname();
  if (path.includes(':')) {
    const routePattern = path.replace(/:[^/]+/g, '[^/]+')
    const regex = new RegExp(`^${routePattern}$`)
    return regex.test(pathname)
  }
  return pathname === path || pathname.startsWith(path + '/')
}
