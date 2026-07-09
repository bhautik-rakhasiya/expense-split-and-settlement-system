import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSettlements } from '../api/expense.service';
import { getGroupById } from '../api/group.service';
import SettlementCard from '../components/SettlementCard';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';

const Settlements = () => {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [groupRes, settleRes] = await Promise.all([
        getGroupById(groupId),
        getSettlements(groupId),
      ]);
      setGroup(groupRes.data.data.group);
      setSettlements(settleRes.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load settlements');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalToSettle = settlements.reduce((sum, s) => sum + s.amount, 0);
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
        <span className="text-slate-800 font-medium">Settle Up</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settlement Suggestions</h1>
          <p className="text-sm text-slate-500 mt-0.5">Minimum transactions to settle all debts</p>
        </div>
        <Link to={`/groups/${groupId}/summary`} className="btn-secondary text-sm">
          ← Summary
        </Link>
      </div>

      {/* Info banner */}
      {settlements.length > 0 && (
        <div className="flex items-start gap-3 bg-brand-50 border border-brand-100 rounded-xl px-4 py-3.5">
          <svg className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-brand-800">Optimised Settlement Plan</p>
            <p className="text-xs text-brand-600 mt-0.5">
              {settlements.length} transaction{settlements.length !== 1 ? 's' : ''} needed to settle{' '}
              {formatCurrency(totalToSettle)} total
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {settlements.length === 0 ? (
        <Card>
          <EmptyState
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="All settled up! 🎉"
            description="Everyone is even. No payments needed."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {settlements.map((s, idx) => (
            <SettlementCard key={idx} from={s.from} to={s.to} amount={s.amount} />
          ))}
        </div>
      )}

      {settlements.length > 0 && (
        <p className="text-center text-xs text-slate-400 pb-2">
          These are suggestions based on the minimum number of transactions required to settle all debts.
        </p>
      )}
    </div>
  );
};

export default Settlements;
