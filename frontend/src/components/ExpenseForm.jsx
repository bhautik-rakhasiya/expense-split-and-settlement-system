import { useForm, useFieldArray } from 'react-hook-form';
import Input from './Input';
import Button from './Button';

/**
 * ExpenseForm
 * members: [{ _id, name, email }]  — from backend (populated)
 * currentUser: { _id, name, email } — logged-in user
 * onSubmit: ({ paidBy: _id, amount, description, splitAmong: [{ user: _id, amount }] }) => void
 */
const ExpenseForm = ({ members = [], currentUser, onSubmit }) => {
  const defaultPayerId = currentUser?._id || members[0]?._id || '';

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      paidBy: defaultPayerId,
      amount: '',
      description: '',
      splitAmong: members.map((m) => ({ user: m._id, name: m.name, amount: '' })),
    },
  });

  const { fields } = useFieldArray({ control, name: 'splitAmong' });

  const watchedAmount = parseFloat(watch('amount')) || 0;
  const splitAmounts = watch('splitAmong');
  const splitTotal = splitAmounts?.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0) || 0;
  const remaining = Math.round((watchedAmount - splitTotal) * 100) / 100;

  const onFormSubmit = (data) => {
    const processed = {
      paidBy: data.paidBy,             // _id string
      amount: parseFloat(data.amount),
      description: data.description || '',
      splitAmong: data.splitAmong.map((s) => ({
        user: s.user,                  // _id string
        amount: parseFloat(s.amount),
      })),
    };
    return onSubmit?.(processed);
  };

  const handleReset = () => {
    reset({
      paidBy: defaultPayerId,
      amount: '',
      description: '',
      splitAmong: members.map((m) => ({ user: m._id, name: m.name, amount: '' })),
    });
  };

  // ── Split Equally calculation ──────────────────────────────────────────────
  const handleSplitEqually = () => {
    if (watchedAmount <= 0) return;
    const count = members.length;
    const baseShare = Math.floor((watchedAmount / count) * 100) / 100;
    const remainder = Math.round((watchedAmount - (baseShare * count)) * 100) / 100;

    members.forEach((m, idx) => {
      // Add remainder to the first member to make it exactly balanced
      const share = idx === 0 ? (baseShare + remainder) : baseShare;
      setValue(`splitAmong.${idx}.amount`, share.toFixed(2));
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5" noValidate>
      {/* Hidden input for paidBy since it's prefilled with logged-in user */}
      <input type="hidden" {...register('paidBy')} />

      {/* Paid By info card */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3.5 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">Paid By</span>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-slate-800">
            You ({currentUser?.name})
          </span>
        </div>
      </div>

      {/* Amount + Description */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="amount"
          label="Total Amount (₹)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="e.g. 1500"
          error={errors.amount?.message}
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be > 0' },
            validate: (v) => !isNaN(parseFloat(v)) || 'Must be a number',
          })}
        />
        <Input
          id="description"
          label="Description"
          placeholder="e.g. Hotel booking"
          error={errors.description?.message}
          {...register('description', {
            required: 'Description is required',
          })}
        />
      </div>

      {/* Split Among */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700">Split Among</label>
          <div className="flex items-center gap-2">
            {watchedAmount > 0 && (
              <button
                type="button"
                onClick={handleSplitEqually}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline transition flex items-center gap-1"
              >
                ⚖️ Split Equally
              </button>
            )}
            {watchedAmount > 0 && (
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full transition ${
                  remaining === 0
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {remaining === 0 ? '✓ Balanced' : `Remaining: ₹${remaining}`}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
            >
              <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {(field.name || members[idx]?.name || '?').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700 flex-1 truncate">
                {field.name || members[idx]?.name}
              </span>
              <div className="w-28 flex-shrink-0">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="₹ 0"
                  className={`input-base text-right py-1.5 text-sm ${
                    errors.splitAmong?.[idx]?.amount ? 'input-error' : ''
                  }`}
                  {...register(`splitAmong.${idx}.amount`, {
                    required: 'Required',
                    min: { value: 0.01, message: '> 0' },
                  })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-slate-100">
        <Button type="button" variant="ghost" onClick={handleReset} className="flex-shrink-0">
          Reset
        </Button>
        <Button type="submit" fullWidth loading={isSubmitting}>
          Add Expense
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
