export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-richblack-900">
      <div className="animate-pulse">
        <div className="mx-auto w-11/12 max-w-maxContent py-20">
          <div className="h-12 bg-richblack-800 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 bg-richblack-800 rounded"></div>
            <div className="h-64 bg-richblack-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

