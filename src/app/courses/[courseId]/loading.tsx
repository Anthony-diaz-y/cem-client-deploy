export default function CourseLoading() {
  return (
    <div className="min-h-screen bg-richblack-900">
      <div className="animate-pulse">
        <div className="h-96 bg-richblack-800"></div>
        <div className="mx-auto w-11/12 max-w-maxContent py-20">
          <div className="h-10 bg-richblack-800 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-richblack-800 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-48 bg-richblack-800 rounded"></div>
              <div className="h-32 bg-richblack-800 rounded"></div>
            </div>
            <div className="h-64 bg-richblack-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

