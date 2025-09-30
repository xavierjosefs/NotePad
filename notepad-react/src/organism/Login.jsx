import AuthPanel from "../molecules/AuthPanel";

export default function Login() {
  return (
    <main className="min-h-screen grid md:grid-cols-2 bg-white">
      {/* Columna izquierda: panel del formulario */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <AuthPanel />
      </div>
      <div className="hidden md:block relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/illustrations/login.jpg)",
            transform: "scale(1.12)",
          }}
        />
        {/* Overlay opcional para contraste:
  <div className="absolute inset-0 bg-black/10" />
  */}
      </div>
    </main>
  );
}
