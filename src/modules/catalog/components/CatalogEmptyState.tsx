'use client'

import React from "react"

/**
 * CatalogEmptyState - Empty state component for catalog page
 */
const CatalogEmptyState: React.FC = () => {
  return (
    <div className="text-white text-4xl flex justify-center items-center mt-[20%]">
      No Courses found for selected Category
    </div>
  )
}

export default CatalogEmptyState

