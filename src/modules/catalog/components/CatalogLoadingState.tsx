'use client'

import React from "react"
import Loading from "../../../shared/components/Loading"

/**
 * CatalogLoadingState - Loading component for catalog page
 */
const CatalogLoadingState: React.FC = () => {
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      <Loading />
    </div>
  )
}

export default CatalogLoadingState

