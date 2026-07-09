import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import { getGroupById } from '../api/group.service';
import { addExpense, getExpenses } from '../api/expense.service';
import MemberList from '../components/MemberList';
import ExpenseForm from '../components/ExpenseForm';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Button from '../components/Button';

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Logged-in user context

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // ── Fetch group ─────────────────────────────────────────────────────────────
  const fetchGroup = useCallback(async () => {
    try {
      setLoadingGroup(true);
      const res = await getGroupById(groupId);
      setGroup(res.data.data.group);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load group');
      navigate('/groups');
    } finally {
      setLoadingGroup(false);
    }
  }, [groupId, navigate]);

  // ── Fetch expenses ──────────────────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    try {
      setLoadingExpenses(true);
      const res = await getExpenses(groupId);
      setExpenses(res.data.data.expenses || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoadingExpenses(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroup();
    fetchExpenses();
  }, [fetchGroup, fetchExpenses]);

  // ── Submit expense ──────────────────────────────────────────────────────────
  const handleAddExpense = async (data) => {
    try {
      await addExpense(groupId, {
        paidBy: data.paidBy,           // _id string
        amount: data.amount,
        description: data.description || '',
        splitAmong: data.splitAmong.map((s) => ({
          user: s.user,                // _id string
          amount: s.amount,
        })),
      });
      toast.success('Expense added successfully!');
      setShowForm(false);
      fetchExpenses(); // Refresh expense list
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add expense';
      const errors = err.response?.data?.errors;
      if (errors?.length) {
        toast.error(errors[0].message);
      } else {
        toast.error(message);
      }
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);

  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loadingGroup) {
    return <Loader size="lg" className="py-32" />;
  }

  if (!group) return null;

  // Normalise members for ExpenseForm — must have _id field
  const members = group.members || [];

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/groups" className="hover:text-brand-600 transition">Groups</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-800 font-medium">{group.name}</span>
      </div>

      {/* Group Hero Card */}
      <Card className="!p-0 overflow-hidden shadow-md">
        <div className="bg-gradient-to-r from-brand-600 to-purple-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{group.name}</h1>
              <p className="text-brand-200 text-sm mt-1">
                {members.length} member{members.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-brand-200 text-xs uppercase tracking-wide font-semibold">Total Spent</p>
              <p className="text-2xl font-bold mt-0.5">{formatCurrency(totalSpend)}</p>
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <MemberList members={members} />
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setShowForm(true)}
              className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg transition shadow-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Expense
            </button>
            <button
              onClick={() => navigate(`/groups/${groupId}/summary`)}
              className="text-sm font-semibold text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-lg transition border border-slate-200"
            >
              Summary
            </button>
            <button
              onClick={() => navigate(`/groups/${groupId}/settlements`)}
              className="text-sm font-semibold text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-lg transition border border-purple-200"
            >
              Settle Up
            </button>
          </div>
        </div>
      </Card>

      {/* Expense History - Full Width */}
      <Card className="shadow-sm">
        <h2 className="font-bold text-slate-900 mb-5 text-lg">
          Expense History
          <span className="ml-2 text-sm font-normal text-slate-400">({expenses.length})</span>
        </h2>

        {loadingExpenses ? (
          <Loader size="md" className="py-10" />
        ) : expenses.length === 0 ? (
          <EmptyState
            title="No expenses yet"
            description="Add the first expense to get started splitting."
            action={
              <Button onClick={() => setShowForm(true)}>Add Expense</Button>
            }
          />
        ) : (
          <div className="space-y-2">
            {expenses.map((exp) => (
              <div
                key={exp._id}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">
                    {exp.description || 'Expense'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Paid by{' '}
                    <span className="font-medium text-slate-600">
                      {exp.paidBy?.name || 'Unknown'}
                    </span>
                    {' · '}
                    {formatDate(exp.createdAt)}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-slate-900 text-sm">
                    {formatCurrency(exp.amount)}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    split {exp.splitAmong?.length || 0} ways
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add Expense Popup Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Add Group Expense</h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <ExpenseForm
                members={members}
                currentUser={user}
                onSubmit={handleAddExpense}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
