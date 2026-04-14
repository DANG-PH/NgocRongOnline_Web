"use client"
function Diendan() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-fixed bg-cover relative"
      style={{ backgroundImage: "url('/assets/br.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div className="relative z-10 bg-black/60 backdrop-blur-md border border-white/10 text-white px-8 py-6 rounded-xl">
        helo
      </div>
    </div>
  );
}

export default Diendan;