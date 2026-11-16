
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:4000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function verificarLogin() {
    try {
      const resposta = await fetch(`${API_URL}/usuario`, {
        credentials: "include"
      });

      if (!resposta.ok) {
        throw new Error("Erro ao verificar sessão.");
      }

      const resultado = await resposta.json();

      if (resultado.logado && resultado.usuario) {
        setUser(resultado.usuario);
        return true;
      }

      setUser(null);
      return false;

    } catch (erro) {
      console.error(erro);
      setUser(null);
      return false;

    } finally {
      setLoading(false);
    }
  }

  async function login(email, senha) {
    const resposta = await fetch(`${API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, senha })
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        resultado.mensagem || "Erro ao realizar login."
      );
    }

    setUser(resultado.usuario);
    return resultado.usuario;
  }

  async function logout() {
    const resposta = await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include"
    });

    if (!resposta.ok) {
      throw new Error("Erro ao sair da conta.");
    }

    setUser(null);
  }

  useEffect(() => {
    verificarLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        verificarLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      "useAuth deve ser utilizado dentro de AuthProvider"
    );
  }

  return contexto;
}