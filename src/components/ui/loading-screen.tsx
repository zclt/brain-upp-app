export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="relative w-20 h-20">
        {/* Spinner ring */}
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />

        {/* Logo centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/brain.svg" alt="Brain Upp" className="w-9 h-9" />
        </div>
      </div>
    </div>
  )
}
