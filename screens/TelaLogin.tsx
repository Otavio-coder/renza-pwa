
import React, { useState } from 'react';
import { Screen, TelaLoginProps } from '../types'; 
import Button from '../components/Button';
import InputField from '../components/InputField';
import Logo from '../components/Logo'; // Import the new Logo component

const TelaLogin: React.FC<TelaLoginProps> = ({ setCurrentScreen, onLoginAttempt, onForgotPasswordRequest }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginClick = async () => {
    setError(''); 
    if (!email.trim() || !password.trim()) {
      setError('E-mail e senha são obrigatórios.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Formato de e-mail inválido.');
        return;
    }
    
    setIsLoading(true);
    try {
      const result = await onLoginAttempt(email, password);
      if (typeof result === 'string') {
        setError(result); 
      }
      // Navigation on success is handled by App.tsx
    } catch (e) {
      console.error("Login error:", e);
      setError("Ocorreu um erro ao tentar fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordClick = async () => {
    setError('');
    if (!email.trim()) {
      setError('Por favor, insira seu e-mail para redefinir a senha.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Formato de e-mail inválido.');
      return;
    }

    if (onForgotPasswordRequest) {
      setIsLoading(true);
      try {
        const result = await onForgotPasswordRequest(email);
        if (typeof result === 'string') {
          setError(result); 
        } else if (result === true) {
          // Success message is handled by App.tsx alert
          setError(''); 
        }
      } catch (e) {
        console.error("Forgot password error:", e);
        setError("Ocorreu um erro ao solicitar a redefinição de senha.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Funcionalidade de recuperação de senha não disponível no momento.");
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4"> {/* Removed bg-stone-900 */}
       <div className="w-full max-w-md space-y-6 bg-stone-800 p-8 rounded-2xl shadow-2xl relative">
        <button 
            onClick={() => !isLoading && setCurrentScreen(Screen.TelaInicial)} 
            className="absolute top-4 left-4 text-stone-300 hover:text-white transition-colors z-20"
            aria-label="Voltar para Tela Inicial"
            disabled={isLoading}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </button>
        <div className="text-center pt-8"> 
            <Logo className="max-w-[200px] h-auto mx-auto mb-6" /> {/* Replace h1 with Logo component */}
            <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
            <p className="text-stone-400">Acesse sua conta para continuar.</p>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-900 p-3 rounded-md text-center">{error}</p>}

        <InputField
          id="email"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="E-mail"
          disabled={isLoading}
        />
        <InputField
          id="password"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Senha"
          disabled={isLoading}
        />
        <Button variant="primary" onClick={handleLoginClick} fullWidth disabled={isLoading}>
          {isLoading ? 'LOGANDO...' : 'LOGAR'}
        </Button>
        <button 
            onClick={handleForgotPasswordClick} 
            className="text-sm text-orange-500 hover:underline text-center w-full mt-3"
            aria-label="Esqueceu sua senha?"
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : 'Esqueceu sua senha?'}
          </button>
         <p className="text-sm text-center text-stone-400 mt-4">
            Não tem uma conta?{' '}
            <button 
              onClick={() => !isLoading && setCurrentScreen(Screen.TelaNovoUsuario)} 
              className="font-medium text-orange-500 hover:underline"
              disabled={isLoading}
            >
              Cadastre-se
            </button>
          </p>
      </div>
    </div>
  );
};

export default TelaLogin;
