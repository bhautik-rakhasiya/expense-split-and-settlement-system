import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSummary } from '../api/expense.service';
import { getGroupById } from '../api/group.service';
import BalanceCard from '../components/BalanceCard';
import Card from '../components/Card';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Summary = () => {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [groupRes, summaryRes] = await Promise.all([
        getGroupById(groupId),
        getSummary(groupId),
      ]);
      setGroup(groupRes.data.data.group);
      setSummary(summaryRes.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load summary');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const creditors = summary.filter((s) => s.balance > 0);
  const debtors = summary.filter((s) => s.balance < 0);
  const settled = summary.filter((s) => s.balance === 0);

  const totalCredit = creditors.reduce((sum, s) => sum + s.balance, 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);

  if (loading) return <Loader size="lg" className="py-32" />;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/groups" className="hover:text-brand-600 transition">Groups</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link to={`/groups/${groupId}`} className="hover:text-brand-600 transition">
          {group?.name || 'Group'}
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-800 font-medium">Summary</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Group Summary</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {group?.name} · Balance overview
          </p>
        </div>
        <Link to={`/groups/${groupId}/settlements`} className="btn-primary text-sm">
          View Settlements →
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalCredit)}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Total Owed Back</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-brand-600">{summary.length}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Members</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-slate-700">{debtors.length}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Need to Pay</p>
        </Card>
      </div>

      {/* Empty state if no expenses */}
      {summary.length === 0 || (creditors.length === 0 && debtors.length === 0 && settled.length === 0) ? (
        <EmptyState
          title="No balance data"
          description="Add expenses to the group to see the balance summary."
        />
      ) : (
        <>
          {/* Creditors — gets money back */}
          {creditors.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Gets Back
              </h2>
              <div className="space-y-3">
                {creditors.map((s) => (
                  <BalanceCard key={s.userId} name={s.name} balance={s.balance} />
                ))}
              </div>
            </div>
          )}

          {/* Debtors — owes money */}
          {debtors.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                Owes Money
              </h2>
              <div className="space-y-3">
                {debtors.map((s) => (
                  <BalanceCard key={s.userId} name={s.name} balance={s.balance} />
                ))}
              </div>
            </div>
          )}

          {/* Settled — zero balance */}
          {settled.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                Settled Up
              </h2>
              <div className="space-y-3">
                {settled.map((s) => (
                  <BalanceCard key={s.userId} name={s.name} balance={0} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Summary;
