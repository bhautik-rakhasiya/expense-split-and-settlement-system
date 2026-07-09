import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import { getGroups, createGroup } from '../api/group.service';
import { getUsers } from '../api/user.service';
import Button from '../components/Button';
import Input from '../components/Input';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';

const Groups = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Searchable dropdown state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]); // [{ _id, name, email }]

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // ── Fetch groups on mount ──────────────────────────────────────────────────
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getGroups();
      setGroups(res.data.data.groups || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // ── Users list/search debounced ────────────────────────────────────────────
  useEffect(() => {
    if (!dropdownOpen) return;

    const delayDebounce = setTimeout(async () => {
      setLoadingUsers(true);
      try {
        const res = await getUsers(searchQuery);
        setSearchResults(res.data.data.users || []);
      } catch (err) {
        console.error('Failed to search users', err);
      } finally {
        setLoadingUsers(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, dropdownOpen]);

  const removeMember = (_id) =>
    setSelectedMembers((prev) => prev.filter((m) => m._id !== _id));

  // ── Create group ───────────────────────────────────────────────────────────
  const onCreateGroup = async (data) => {
    if (selectedMembers.length === 0) {
      toast.error('Add at least one other member to create a group.');
      return;
    }
    try {
      const payload = {
        name: data.name,
        members: selectedMembers.map((m) => m._id),
      };
      await createGroup(payload);
      toast.success(`Group "${data.name}" created!`);
      reset();
      setSelectedMembers([]);
      setSearchQuery('');
      setShowModal(false);
      fetchGroups(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create group');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    reset();
    setSelectedMembers([]);
    setSearchQuery('');
    setDropdownOpen(false);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Groups</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {loading ? 'Loading…' : `${groups.length} group${groups.length !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="shadow-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Group
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <Loader size="lg" className="py-20" />
      ) : groups.length === 0 ? (
        <EmptyState
          title="No groups yet"
          description="Create your first group to start splitting expenses with friends."
          action={<Button onClick={() => setShowModal(true)}>Create Group</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => navigate(`/groups/${group._id}`)}
              className="card p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-transparent hover:border-brand-100 group"
            >
              {/* Icon + expense count */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                  {group.name.replace(/[^a-zA-Z]/g, '').charAt(0)?.toUpperCase() || '?'}
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                  {group.totalExpenses ?? 0} expense{(group.totalExpenses ?? 0) !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Name */}
              <h3 className="font-semibold text-slate-900 text-base mb-1 group-hover:text-brand-700 transition">
                {group.name}
              </h3>

              {/* Member avatar stack */}
              <div className="flex items-center gap-1 mb-3">
                {group.members.slice(0, 4).map((m, idx) => (
                  <div
                    key={m._id || idx}
                    className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold flex items-center justify-center border-2 border-white -ml-1 first:ml-0"
                    title={m.name}
                  >
                    {m.name?.charAt(0)?.toUpperCase()}
                  </div>
                ))}
                {group.members.length > 4 && (
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center border-2 border-white -ml-1">
                    +{group.members.length - 4}
                  </div>
                )}
                <span className="text-xs text-slate-500 ml-1.5">
                  {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">{formatDate(group.createdAt)}</span>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Group Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Create New Group</h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(onCreateGroup)} noValidate className="p-6 space-y-5">
              {/* Group name */}
              <Input
                id="group-name"
                label="Group Name"
                placeholder="e.g. Goa Trip 🏖️"
                error={errors.name?.message}
                {...register('name', {
                  required: 'Group name is required',
                  minLength: { value: 2, message: 'At least 2 characters required' },
                })}
              />

              {/* Searchable Dropdown */}
              <div className="space-y-2 relative">
                <label className="block text-sm font-medium text-slate-700">
                  Select Group Members
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    placeholder="Search by name or email..."
                    className="input-base pr-10 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Dropdown Popover */}
                  {dropdownOpen && (
                    <>
                      {/* Invisible backdrop to close the dropdown */}
                      <div className="fixed inset-0 z-0" onClick={() => setDropdownOpen(false)} />

                      <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl mt-1.5 shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-50 animate-fade-in">
                        {loadingUsers ? (
                          <div className="p-3 text-center text-xs text-slate-400">
                            Loading users...
                          </div>
                        ) : searchResults.filter(
                            (u) => !selectedMembers.some((sm) => sm._id === u._id)
                          ).length === 0 ? (
                          <div className="p-3 text-center text-xs text-slate-400">
                            {searchQuery ? 'No matching users found' : 'All available users selected'}
                          </div>
                        ) : (
                          searchResults
                            .filter((u) => !selectedMembers.some((sm) => sm._id === u._id))
                            .map((u) => (
                              <button
                                key={u._id}
                                type="button"
                                onClick={() => {
                                  setSelectedMembers((prev) => [...prev, u]);
                                  setSearchQuery('');
                                  setDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition flex flex-col"
                              >
                                <span className="text-sm font-semibold text-slate-800">{u.name}</span>
                                <span className="text-xs text-slate-400">{u.email}</span>
                              </button>
                            ))
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Selected members chips */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="flex items-center gap-1.5 bg-brand-50 border border-brand-100 rounded-full px-3 py-1.5 text-xs font-medium text-brand-700">
                    <div className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[9px] font-bold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    {user?.name?.split(' ')[0]} (you)
                  </div>

                  {selectedMembers.map((m) => (
                    <div key={m._id} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full pl-3 pr-1.5 py-1.5 text-xs font-medium text-emerald-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                        {m.name?.charAt(0)?.toUpperCase()}
                      </div>
                      {m.name}
                      <button
                        type="button"
                        onClick={() => removeMember(m._id)}
                        className="ml-0.5 hover:text-rose-600 transition"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-400">
                  {selectedMembers.length === 0
                    ? 'Add at least one other member'
                    : `${selectedMembers.length + 1} member${selectedMembers.length + 1 !== 1 ? 's' : ''} total`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button type="button" variant="secondary" fullWidth onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" fullWidth loading={isSubmitting}>
                  Create Group
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
