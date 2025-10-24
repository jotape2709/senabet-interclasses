import { auth, db } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useState } from 'react';


// Ícone do Google para o botão
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  );
}

// Ícone de Spinner para loading
function SpinnerIcon() {
  return (
    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  );
}


function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    setNotification(null); // Limpa notificações antigas
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuário logado:", user);

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        try {
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email || '',
              name: user.displayName || '',
              phone: '',
              role: 'student',
              rewards: 0,
              createdAt: new Date()
            });
          } else {
            await setDoc(
              userRef,
              {
                email: user.email || '',
                name: user.displayName || ''
              },
              { merge: true }
            );
          }

          setNotification({ type: 'success', text: 'Login bem-sucedido! Redirecionando...' });
          // O redirecionamento já estava correto:
          setTimeout(() => navigate('/'), 1000); // Aumentei levemente para dar tempo de ler
        
        } catch (dbError) {
          console.error('Erro salvando usuário no Firestore:', dbError);
          setNotification({ type: 'error', text: 'Erro ao salvar perfil. Tente novamente.' });
          setTimeout(() => setNotification(null), 4000);
        }
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setNotification({ type: 'error', text: 'Falha no login com Google. Tente novamente.' });
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Fundo escuro (preto/cinza) para destacar o cartão amarelo/preto
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      
      {/* Este é o novo "Card" estilizado com Tailwind.
        Substitui o <LoginCard> para termos controle total do visual.
      */}
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-xl">
        
        {/* Cabeçalho */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-yellow-400">
            Bem-vindo!
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Entre com sua conta Google para continuar
          </p>
        </div>

        {/* Notificações (adaptadas para o fundo escuro) */}
        {notification && (
          <div className={`p-3 rounded-md text-sm ${
            notification.type === 'success' 
              ? 'bg-green-900 border border-green-700 text-green-300' 
              : 'bg-red-900 border border-red-700 text-red-300'
          }`}>
            {notification.text}
          </div>
        )}

        {/* Botão de Login */}
        <div className="flex justify-center">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`
              w-full inline-flex items-center justify-center gap-3 px-4 py-3 
              font-semibold text-black rounded-lg shadow-md
              transition-all duration-300 ease-in-out
              ${isLoading 
                ? 'bg-yellow-600 cursor-not-allowed' 
                : 'bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800'
              }
            `}
          >
            {isLoading ? <SpinnerIcon /> : <GoogleIcon />}
            <span>{isLoading ? 'Entrando...' : 'Login com Google'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;