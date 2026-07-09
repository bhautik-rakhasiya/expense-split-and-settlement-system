const BalanceCard = ({ name, balance }) => {
  const isPositive = balance >= 0;
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(Math.abs(balance));

  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className={`card p-5 flex items-center gap-4 transition hover:shadow-md hover:-translate-y-0.5 ${
      isPositive ? 'border-emerald-100' : 'border-rose-100'
    }`}>
      {/* Avatar */}
      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
        isPositive ? 'bg-emerald-500' : 'bg-rose-500'
      }`}>
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 truncate">{name}</p>
        <p className={`text-xs font-medium mt-0.5 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? 'Gets back' : 'Owes'}
        </p>
      </div>

      {/* Amount */}
      <div className={`text-right flex-shrink-0`}>
        <span className={`text-lg font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? '+' : '-'}{formatted}
        </span>
      </div>
    </div>
  );
};

export default BalanceCard;
