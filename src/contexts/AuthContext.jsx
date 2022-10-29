import React from 'react';
import { AuthService } from '../services/AuthService';
import { customHistory } from '../CustomBrowserRouter';
import { notificar } from '../utils/Notification';

const AuthContext = React.createContext({});

function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = React.useState(false)
  const [loading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const preToken = localStorage.getItem('session_token');
    const token = preToken ?? JSON.parse(preToken);

    if (token) {
      setAuthenticated(true);
    }

    setIsLoading(false)
  }, [])

	async function handleLogin(user) {
		return AuthService.signIn(user).then(response => {
			const token = response.headers.authorization;
			localStorage.setItem('session_token', token);
			customHistory.push('/lancamentos-englobados');
      setAuthenticated(true);
		}).catch(() => notificar('error', 'Usuário ou senha incorretos'))
	}

	function handleLogout() {
		localStorage.removeItem('session_token');	
		customHistory.push('/auth');
    setAuthenticated(false);
	}

  async function getCurrentUser() {
    return AuthService.getCurrent();
  }

  if (loading) {
    return <h1>Redirecionando login...</h1>
  }

	return (
		<AuthContext.Provider value={{ handleLogin, handleLogout, getCurrentUser, authenticated }}>
			{children}
		</AuthContext.Provider>
	)
}

export { AuthContext, AuthProvider };