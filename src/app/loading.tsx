export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="custom-loader"></div>
        <p className="text-richblack-400 text-sm">Cargando...</p>
      </div>
    </div>
  );
}

