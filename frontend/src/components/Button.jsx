import Loader from './Loader';

const Button = ({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  fullWidth = false,
}) => {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  }[variant] ?? 'btn-primary';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${variantClass} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && <Loader size="sm" className="!p-0" />}
      {children}
    </button>
  );
};

export default Button;
