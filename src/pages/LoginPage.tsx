import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthAlert from '../components/auth/AuthAlert';
import AuthLayout from '../components/auth/AuthLayout';
import AuthSubmitButton from '../components/auth/AuthSubmitButton';
import AuthTextField from '../components/auth/AuthTextField';
import { getApiErrorMessage } from '../lib/api-error';
import { authService } from '../services/auth.service';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.login({ username, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Sign in to manage your movie catalog"
      asideTitle={
        <>
          Manage every
          <br />
          title like a
          <br />
          <em>pro catalog.</em>
        </>
      }
      asideDescription="A compact movie management workspace for roles, ratings, releases, and day-to-day catalog operations."
      stats={[
        { value: '3', label: 'Staff roles' },
        { value: '5', label: 'Rating types' },
      ]}
    >
      <AuthAlert message={error} />

      <form onSubmit={handleSubmit}>
        <AuthTextField
          label="Username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          disabled={isLoading}
          autoComplete="username"
          required
        />

        <AuthTextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          disabled={isLoading}
          autoComplete="current-password"
          required
        />

        <AuthSubmitButton isLoading={isLoading} loadingLabel="Signing in">
          Sign in
        </AuthSubmitButton>
      </form>

      <div className="auth-hint">
        <div className="hint-dot" />
        <span className="hint-txt">Default users: manager, teamleader, floorstaff / Password123!</span>
      </div>

      <p className="auth-switch">
        Don&apos;t have an account? <Link to="/register">Create one</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
