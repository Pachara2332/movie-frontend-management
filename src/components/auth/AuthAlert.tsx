import { CircleAlert } from 'lucide-react';

interface AuthAlertProps {
  message: string;
}

const AuthAlert = ({ message }: AuthAlertProps) => {
  if (!message) {
    return null;
  }

  return (
    <div className="auth-error" role="alert">
      <CircleAlert className="err-icon" size={16} />
      <span className="err-text">{message}</span>
    </div>
  );
};

export default AuthAlert;
