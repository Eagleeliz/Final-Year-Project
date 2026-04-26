import { useEffect, useState } from "react";
import { usersApi, type User, type UpdateUserPayload } from "../../Features/Apis/usersApi";
import {
  Search, Trash2, CheckCircle,
  XCircle, AlertCircle, Pencil, Save, ShieldCheck,
  Users, HeartPulse, BadgeCheck, BadgeX,
} from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const midnightTeal = "#0B3B3F";
const aquaLight    = "#E6F7F9";

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const getUserTypeColor = (userType: string) => {
  switch (userType) {
    case "admin":         return { bg: "#e8f5f6", color: "#005a63" };
    case "mother":        return { bg: "#fbeaf0", color: "#993556" };
    case "policy_maker":  return { bg: "#fff4e8", color: "#8a4a00" };
    case "health_worker": return { bg: "#edf7ee", color: "#2e6b38" };
    default:              return { bg: "#f1f1f1", color: "#555" };
  }
};

const StatCard = ({ icon: Icon, label, value, bg, color }: any) => (
  <div
    className="bg-white p-7 rounded-2xl shadow-sm border-l-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden"
    style={{ borderLeftColor: color }}
  >
    <div
      className="absolute inset-0 opacity-5"
      style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 50%)` }}
    />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl" style={{ background: bg }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
      <p className="text-4xl font-black" style={{ color }}>
        {value.toLocaleString()}
      </p>
      <p className="text-sm font-black uppercase tracking-wider text-gray-500 mt-2">
        {label}
      </p>
    </div>
  </div>
);

const AllUsers = () => {
  const [users, setUsers]           = useState<User[]>([]);
  const [filtered, setFiltered]     = useState<User[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const [editingUser, setEditingUser]     = useState<User | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName]   = useState("");
  const [editEmail, setEditEmail]         = useState("");
  const [editPhone, setEditPhone]         = useState("");
  const [editCounty, setEditCounty]       = useState("");
  const [editUserType, setEditUserType]   = useState("");
  const [editLoading, setEditLoading]     = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAllUsers();
      setUsers(data);
      setFiltered(data);
    } catch {
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...users];
    if (filterType !== "all") result = result.filter((u) => u.userType === filterType);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.firstName?.toLowerCase().includes(q) ||
          u.lastName?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.county?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, filterType, users]);

  const startEdit = (user: User) => {
    setEditingUser(user);
    setEditFirstName(user.firstName ?? "");
    setEditLastName(user.lastName ?? "");
    setEditEmail(user.email ?? "");
    setEditPhone(user.phone ?? "");
    setEditCounty(user.county ?? "");
    setEditUserType(user.userType ?? "mother");
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    setEditLoading(true);
    try {
      const payload: UpdateUserPayload = {
        firstName: editFirstName,
        lastName:  editLastName,
        email:     editEmail,
        phone:     editPhone,
        county:    editCounty,
        userType:  editUserType as User["userType"],
      };
      await usersApi.updateUser(editingUser.id, payload);
      setUsers((prev) =>
        prev.map((u) => u.id === editingUser.id ? { ...u, ...payload } : u)
      );
      setEditingUser(null);
      toast.success("User details updated successfully");
    } catch {
      toast.error("Failed to update user.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!editingUser) return;
    setVerifyLoading(true);
    try {
      await usersApi.verifyUser(editingUser.id);
      setUsers((prev) =>
        prev.map((u) => u.id === editingUser.id ? { ...u, isEmailVerified: true } : u)
      );
      setEditingUser((prev) => prev ? { ...prev, isEmailVerified: true } : null);
      toast.success(`${editingUser.firstName} ${editingUser.lastName} verified successfully`);
    } catch {
      toast.error("Failed to verify user.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleDelete = (user: User) => {
    MySwal.fire({
      title: "Delete this user?",
      text: `${user.firstName} ${user.lastName} (${user.email}) will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: midnightTeal,
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#FFFFFF",
      color: midnightTeal,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await usersApi.deleteUser(user.id);
          setUsers((prev) => prev.filter((u) => u.id !== user.id));
          setEditingUser(null);
          toast.success("User deleted successfully");
        } catch {
          toast.error("Failed to delete user.");
        }
      }
    });
  };

  const totalMothers    = users.filter((u) => u.userType === "mother").length;
  const totalVerified   = users.filter((u) => u.isEmailVerified).length;
  const totalUnverified = users.filter((u) => !u.isEmailVerified).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div
            className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: aquaLight, borderTopColor: midnightTeal }}
          />
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: users.length,    icon: Users,       bg: "#e6f7f9", color: midnightTeal },
    { label: "Mothers",     value: totalMothers,    icon: HeartPulse,  bg: "#fbeaf0", color: "#993556"   },
    { label: "Verified",    value: totalVerified,   icon: BadgeCheck,  bg: "#edf7ee", color: "#2e6b38"   },
    { label: "Unverified",  value: totalUnverified, icon: BadgeX,      bg: "#fdecea", color: "#e53e3e"   },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header */}
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
            User Management
          </p>
          <h1 className="text-3xl font-black" style={{ color: midnightTeal }}>
            All Users
          </h1>
        </div>
      </header>

      {/* ── Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            bg={stat.bg}
            color={stat.color}
          />
        ))}
      </div>

      {/* ── Search + Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-gray-50 px-4 py-2.5 rounded-xl">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, email or county..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["all", "mother", "admin", "policy_maker", "health_worker"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className="px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize"
              style={{
                background: filterType === type ? midnightTeal : "#f1f5f9",
                color: filterType === type ? "white" : "#64748b",
              }}
            >
              {type === "all" ? "All" : type.replace("_", " ")}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 font-bold ml-auto">
          {filtered.length} of {users.length} users
        </p>
      </div>

      {/* ── Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <AlertCircle size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-bold">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["User", "Email", "County", "Type", "Verified", "Joined", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-black uppercase tracking-widest text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => {
                  const typeColor = getUserTypeColor(user.userType);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">

                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                            style={{ background: midnightTeal }}
                          >
                            {user.firstName?.[0]?.toUpperCase() ?? "U"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-400">ID #{user.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 truncate max-w-[200px]">{user.email}</p>
                        {user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
                      </td>

                      {/* County */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{user.county ?? "—"}</p>
                      </td>

                      {/* User type badge */}
                      <td className="px-6 py-4">
                        <span
                          className="px-2 py-1 rounded-lg text-xs font-bold capitalize"
                          style={{ background: typeColor.bg, color: typeColor.color }}
                        >
                          {user.userType?.replace("_", " ")}
                        </span>
                      </td>

                      {/* Verified */}
                      <td className="px-6 py-4">
                        {user.isEmailVerified ? (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle size={14} className="text-green-500" />
                            <span className="text-xs font-bold text-green-600">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <XCircle size={14} className="text-red-400" />
                            <span className="text-xs font-bold text-red-400">Unverified</span>
                          </div>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500">{formatDate(user.createdAt)}</p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(user)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                            style={{ background: midnightTeal, color: "white" }}
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                            style={{ background: midnightTeal, color: "white" }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">

            <div className="mb-6">
              <h2 className="text-xl font-black" style={{ color: midnightTeal }}>
                Edit User
              </h2>
            </div>

            {/* Avatar + verification status */}
            <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-2xl">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                style={{ background: midnightTeal }}
              >
                {editFirstName?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">{editFirstName} {editLastName}</p>
                <p className="text-xs text-gray-400">ID #{editingUser.id}</p>
              </div>
              {editingUser.isEmailVerified ? (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "#edf7ee" }}>
                  <CheckCircle size={13} className="text-green-600" />
                  <span className="text-xs font-bold text-green-600">Verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "#FEE2E2" }}>
                  <XCircle size={13} className="text-red-500" />
                  <span className="text-xs font-bold text-red-500">Unverified</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {[
                { label: "First Name", value: editFirstName, onChange: setEditFirstName },
                { label: "Last Name",  value: editLastName,  onChange: setEditLastName },
                { label: "Email",      value: editEmail,     onChange: setEditEmail },
                { label: "Phone",      value: editPhone,     onChange: setEditPhone },
                { label: "County",     value: editCounty,    onChange: setEditCounty },
              ].map(({ label, value, onChange }) => (
                <div key={label}>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                    {label}
                  </label>
                  <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 outline-none text-sm font-bold text-gray-800 transition-colors"
                    style={{ borderColor: "#E5E7EB" }}
                    onFocus={e => (e.target.style.borderColor = midnightTeal)}
                    onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
              ))}

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                  User Type
                </label>
                <select
                  value={editUserType}
                  onChange={(e) => setEditUserType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none text-sm font-bold text-gray-800 transition-colors"
                  style={{ borderColor: "#E5E7EB" }}
                  onFocus={e => (e.target.style.borderColor = midnightTeal)}
                  onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
                >
                  <option value="mother">Mother</option>
                  <option value="admin">Admin</option>
                  <option value="policy_maker">Policy Maker</option>
                  <option value="health_worker">Health Worker</option>
                </select>
              </div>
            </div>

            {/* Modal buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <div className="flex gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={editLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm disabled:opacity-50 transition-all hover:opacity-80"
                  style={{ background: midnightTeal, color: "white" }}
                >
                  <Save size={14} />
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-3 rounded-xl font-black text-sm transition-all hover:opacity-80"
                  style={{ background: midnightTeal, color: "white" }}
                >
                  Cancel
                </button>
              </div>

              {!editingUser.isEmailVerified && (
                <button
                  onClick={handleVerify}
                  disabled={verifyLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm disabled:opacity-50 transition-all hover:opacity-80"
                  style={{ background: midnightTeal, color: "white" }}
                >
                  <ShieldCheck size={14} />
                  {verifyLoading ? "Verifying..." : "Verify User Email"}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AllUsers;