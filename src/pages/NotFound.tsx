import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted" role="main" aria-labelledby="error-title">
      <div className="text-center">
        <h1 id="error-title" className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Ops! Página não encontrada</p>
        <a href="/" className="text-primary underline hover:text-primary/90" aria-label="Voltar para a página inicial">
          Voltar para o Início
        </a>
      </div>
    </main>
  );
};

export default NotFound;
