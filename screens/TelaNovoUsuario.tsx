
import React, { useState } from 'react';
import { Screen, TelaNovoUsuarioProps } from '../types'; 
import Button from '../components/Button';
import InputField from '../components/InputField';
import Logo from '../components/Logo'; // Import the new Logo component

const TelaNovoUsuario: React.FC<TelaNovoUsuarioProps> = ({ setCurrentScreen, onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterClick = async () => {
    setError(''); 
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Todos os campos obrigatórios (nome, e-mail, senha) devem ser preenchidos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Formato de e-mail inválido.');
        return;
    }
    
    setIsLoading(true);
    try {
      // Pass individual fields to onRegister (documentPhoto removed)
      const result = await onRegister(name, email, password); 
      if (typeof result === 'string') { // Error message from Firebase/App.tsx
        setError(result); 
      }
      // Navigation on success is handled by App.tsx after Firebase registration
    } catch (e: any) {
      console.error("Registration error in TelaNovoUsuario:", e);
      setError(e.message || "Ocorreu um erro ao tentar registrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4"> {/* Removed bg-stone-900 */}
      <div className="w-full max-w-md space-y-4 bg-stone-800 p-6 sm:p-8 rounded-2xl shadow-2xl relative">
        <button 
            onClick={() => !isLoading && setCurrentScreen(Screen.TelaInicial)} 
            className="absolute top-3 left-3 sm:top-4 sm:left-4 text-stone-300 hover:text-white transition-colors z-20 p-1 rounded-full hover:bg-stone-700"
            aria-label="Voltar para Tela Inicial"
            disabled={isLoading}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </button>
        <div className="text-center pt-6 sm:pt-8"> 
            <Logo className="max-w-[180px] sm:max-w-[200px] h-auto mx-auto mb-4 sm:mb-6" /> {/* Replace h1 with Logo component */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Criar Conta</h2>
            <p className="text-stone-400 text-sm sm:text-base">Preencha os campos para se cadastrar.</p>
        </div>
        
        {error && <p className="text-red-400 text-sm bg-red-900 p-3 rounded-md text-center">{error}</p>}

        <InputField
          id="name"
          type="text"
          placeholder="Nome Completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Nome Completo"
          disabled={isLoading}
          className="p-3 sm:p-4"
        />
        <InputField
          id="email"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="E-mail"
          disabled={isLoading}
          className="p-3 sm:p-4"
        />
        <InputField
          id="password"
          type="password"
          placeholder="Senha (mín. 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Senha"
          disabled={isLoading}
          className="p-3 sm:p-4"
        />
        <InputField
          id="confirmPassword"
          type="password"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-label="Confirmar Senha"
          disabled={isLoading}
          className="p-3 sm:p-4"
        />
        
        <Button variant="primary" onClick={handleRegisterClick} fullWidth disabled={isLoading} size="md" className="mt-3">
          {isLoading ? 'CADASTRANDO...' : 'CADASTRAR'}
        </Button>
      </div>
    </div>
  );
};

export default TelaNovoUsuario;
