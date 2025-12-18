export default function CatalogLoading() {
  return (
    <div className="min-h-screen bg-richblack-900">
      <div className="animate-pulse">
        <div className="h-96 bg-richblack-800"></div>
        <div className="mx-auto w-11/12 max-w-maxContent py-20">
          <div className="h-8 bg-richblack-800 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-richblack-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

