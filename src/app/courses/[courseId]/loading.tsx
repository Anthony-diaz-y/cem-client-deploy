export default function CourseLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="animate-pulse">
        <div className="h-96 bg-gray-200"></div>
        <div className="mx-auto max-w-[1260px] px-4 py-20">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
