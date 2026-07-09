const MemberList = ({ members = [] }) => {
  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const colors = [
    'bg-brand-500',
    'bg-purple-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {members.map((member, idx) => (
        <div
          key={member._id || member.id || idx}
          className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-100 transition"
        >
          <div className={`w-5 h-5 rounded-full ${colors[idx % colors.length]} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
            {getInitials(member.name)}
          </div>
          <span className="text-xs font-medium text-slate-700">{member.name}</span>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
