interface AuthSubmitButtonProps {
  isLoading: boolean;
  loadingLabel: string;
  children: string;
}

const AuthSubmitButton = ({ isLoading, loadingLabel, children }: AuthSubmitButtonProps) => {
  return (
    <button type="submit" className="auth-btn" disabled={isLoading}>
      {isLoading && <span className="btn-spin" />}
      {isLoading ? loadingLabel : children}
    </button>
  );
};

export default AuthSubmitButton;
