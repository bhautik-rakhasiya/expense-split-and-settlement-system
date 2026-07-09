const Card = ({ children, className = '', padding = true }) => (
  <div className={`card ${padding ? 'p-6' : ''} ${className}`}>
    {children}
  </div>
);

export default Card;
