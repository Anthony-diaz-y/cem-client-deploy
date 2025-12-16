'use client'

import React from "react"
import { CatalogPageData } from "../types"

interface CatalogHeroProps {
  catalogPageData: CatalogPageData
}

/**
 * CatalogHero - Hero section component for catalog page
 * Displays category name, breadcrumb, and description
 */
const CatalogHero: React.FC<CatalogHeroProps> = ({ catalogPageData }) => {
  return (
    <div className=" box-content bg-richblack-800 px-4">
      <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
        <p className="text-sm text-richblack-300">
          {`Home / Catalog / `}
          <span className="text-yellow-25">
            {catalogPageData?.selectedCategory?.name}
          </span>
        </p>
        <p className="text-3xl text-richblack-5">
          {catalogPageData?.selectedCategory?.name}
        </p>
        <p className="max-w-[870px] text-richblack-200">
          {catalogPageData?.selectedCategory?.description}
        </p>
      </div>
    </div>
  )
}

export default CatalogHero

