export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="custom-loader"></div>
        <p className="text-richblack-700 text-sm">Cargando...</p>
      </div>
    </div>
  );
}
