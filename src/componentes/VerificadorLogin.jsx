import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const verificarLogin = async () => {
        try {
            const dados = await fetch("http://localhost:4000/api/usuario");
            const resultado = await dados.json();
            
            if (!resultado.username) {
                throw new Error("Usuário não logado");
            }

            setUser(resultado.username);
            localStorage.setItem("logado", "true");
            return true;
        } catch (error) {
            console.log("Erro de login:", error);
            setUser(null);
            localStorage.removeItem("logado");
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verificarLogin();
    }, []);

    return (
        <AuthContext.Provider value={{ user, verificarLogin, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para facilitar o uso em outros componentes
export function useAuth() {
    return useContext(AuthContext);
}