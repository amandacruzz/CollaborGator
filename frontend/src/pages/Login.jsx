import { supabase } from '../supabaseClient';

const Login = () => {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Login Error:', error.message);
  };

  return (
    <div>
      <h1>Login to CollaborGators</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;
