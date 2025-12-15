'use client'

import { useRouter } from "next/router";

export default function useRouteMatch(path) {
  const router = useRouter();
  if (path.includes(':')) {
    const routePattern = path.replace(/:[^/]+/g, '[^/]+')
    const regex = new RegExp(`^${routePattern}$`)
    return regex.test(router.asPath)
  }
  return router.asPath === path || router.asPath.startsWith(path + '/')
}
