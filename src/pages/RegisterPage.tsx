import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthAlert from '../components/auth/AuthAlert';
import AuthLayout from '../components/auth/AuthLayout';
import AuthSubmitButton from '../components/auth/AuthSubmitButton';
import AuthTextField from '../components/auth/AuthTextField';
import { getApiErrorMessage } from '../lib/api-error';
import { authService } from '../services/auth.service';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({ username, password, confirmPassword, role: 'FLOORSTAFF' });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account."
      subtitle="Create staff access for the catalog"
      asideTitle={
        <>
          Add a new
          <br />
          staff member
          <br />
          <em>to the floor.</em>
        </>
      }
      asideDescription="New registrations are assigned floor staff permissions by the backend and can start managing movies immediately."
      stats={[
        { value: 'MANAGER', label: 'Delete access' },
        { value: 'FLOOR', label: 'Default role' },
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
          placeholder="At least 6 characters"
          disabled={isLoading}
          autoComplete="new-password"
          minLength={6}
          required
        />

        <AuthTextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Repeat password"
          disabled={isLoading}
          autoComplete="new-password"
          minLength={6}
          required
        />

        <AuthSubmitButton isLoading={isLoading} loadingLabel="Creating account">
          Create account
        </AuthSubmitButton>
      </form>

      <div className="auth-hint">
        <div className="hint-dot" />
        <span className="hint-txt">New accounts are created as floor staff by the backend</span>
      </div>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
