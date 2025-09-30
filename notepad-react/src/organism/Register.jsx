import RegisterPanel from "../molecules/RegisterPanel";

export default function Register() {
  return (
    <main className="min-h-screen grid md:grid-cols-2 bg-white">
      {/* Columna IZQUIERDA: ilustración (cubre todo) */}
      <div className="hidden md:block relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/illustrations/login2.jpg)",
            transform: "scale(1.12)",
          }}
        />
      </div>

      {/* Columna DERECHA: panel del formulario */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <RegisterPanel />
      </div>
    </main>
  );
}
