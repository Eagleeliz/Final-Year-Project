import { useEffect, useState } from "react";
import { usersApi, type User, type UpdateUserPayload } from "../../Features/Apis/usersApi";
import {
  Search, Trash2, CheckCircle,
  XCircle, RefreshCw, AlertCircle, Pencil, X, Save,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// ── Helpers ───────────────────────────────────────────────────

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

// ── Main Page ─────────────────────────────────────────────────

const AllUsers = () => {
  const [users, setUsers]           = useState<User[]>([]);
  const [filtered, setFiltered]     = useState<User[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // Edit modal state
  const [editingUser, setEditingUser]     = useState<User | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName]   = useState("");
  const [editEmail, setEditEmail]         = useState("");
  const [editPhone, setEditPhone]         = useState("");
  const [editCounty, setEditCounty]       = useState("");
  const [editUserType, setEditUserType]   = useState("");
  const [editLoading, setEditLoading]     = useState(false);

  // ── Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

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

  // ── Filter whenever search or filterType changes
  useEffect(() => {
    let result = [...users];

    if (filterType !== "all") {
      result = result.filter((u) => u.userType === filterType);
    }

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

  // ── Open edit modal
  const startEdit = (user: User) => {
    setEditingUser(user);
    setEditFirstName(user.firstName ?? "");
    setEditLastName(user.lastName ?? "");
    setEditEmail(user.email ?? "");
    setEditPhone(user.phone ?? "");
    setEditCounty(user.county ?? "");
    setEditUserType(user.userType ?? "mother");
  };

  // ── Save edit
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

      // Update local state immediately
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, ...payload }
            : u
        )
      );

      setEditingUser(null);
      toast.success("User updated successfully");
    } catch {
      toast.error("Failed to update user.");
    } finally {
      setEditLoading(false);
    }
  };

  // ── Delete user
  const handleDelete = (user: User) => {
    MySwal.fire({
      title: "Delete this user?",
      text: `${user.firstName} ${user.lastName} (${user.email}) will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#002e33",
      color: "#ffffff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await usersApi.deleteUser(user.id);
          setUsers((prev) => prev.filter((u) => u.id !== user.id));
          toast.success("User deleted successfully");
        } catch {
          toast.error("Failed to delete user.");
        }
      }
    });
  };

  // ── Stats
  const totalMothers    = users.filter((u) => u.userType === "mother").length;
  const totalAdmins     = users.filter((u) => u.userType === "admin").length;
  const totalVerified   = users.filter((u) => u.isEmailVerified).length;
  const totalUnverified = users.filter((u) => !u.isEmailVerified).length;

  // ── Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#002e33] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header */}
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
            User Management
          </p>
          <h1 className="text-3xl font-black" style={{ color: "#002e33" }}>
            All Users
          </h1>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80"
          style={{ background: "#002e33", color: "#86d9e1" }}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </header>

      {/* ── Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users",  value: users.length,    color: "#002e33" },
          { label: "Mothers",      value: totalMothers,    color: "#993556" },
          { label: "Verified",     value: totalVerified,   color: "#2e6b38" },
          { label: "Unverified",   value: totalUnverified, color: "#e53e3e" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-5 rounded-2xl shadow-sm border-l-4"
            style={{ borderLeftColor: stat.color }}
          >
            <p className="text-2xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1">
              {stat.label}
            </p>
          </div>
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
                background: filterType === type ? "#002e33" : "#f1f5f9",
                color: filterType === type ? "#86d9e1" : "#64748b",
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
                            style={{ background: "#002e33" }}
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
                        <p className="text-sm text-gray-600 truncate max-w-[200px]">
                          {user.email}
                        </p>
                        {user.phone && (
                          <p className="text-xs text-gray-400">{user.phone}</p>
                        )}
                      </td>

                      {/* County */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {user.county ?? "—"}
                        </p>
                      </td>

                      {/* User type badge */}
                      <td className="px-6 py-4">
                        <span
                          className="px-2 py-1 rounded-lg text-xs font-bold capitalize"
                          style={{
                            background: typeColor.bg,
                            color: typeColor.color,
                          }}
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
                        <p className="text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(user)}
                            className="p-2 rounded-xl hover:bg-blue-50 transition-colors group"
                            title="Edit user"
                          >
                            <Pencil
                              size={16}
                              className="text-gray-300 group-hover:text-blue-500 transition-colors"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 rounded-xl hover:bg-red-50 transition-colors group"
                            title="Delete user"
                          >
                            <Trash2
                              size={16}
                              className="text-gray-300 group-hover:text-red-500 transition-colors"
                            />
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

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black" style={{ color: "#002e33" }}>
                Edit User
              </h2>
              <button
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            {/* Avatar preview */}
            <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-2xl">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                style={{ background: "#002e33" }}
              >
                {editFirstName?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {editFirstName} {editLastName}
                </p>
                <p className="text-xs text-gray-400">ID #{editingUser.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                  First Name
                </label>
                <input
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#002e33] outline-none text-sm font-bold text-gray-800 transition-colors"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                  Last Name
                </label>
                <input
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#002e33] outline-none text-sm font-bold text-gray-800 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                  Email
                </label>
                <input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#002e33] outline-none text-sm font-bold text-gray-800 transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                  Phone
                </label>
                <input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#002e33] outline-none text-sm font-bold text-gray-800 transition-colors"
                />
              </div>

              {/* County */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                  County
                </label>
                <input
                  value={editCounty}
                  onChange={(e) => setEditCounty(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#002e33] outline-none text-sm font-bold text-gray-800 transition-colors"
                />
              </div>

              {/* User Type */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                  User Type
                </label>
                <select
                  value={editUserType}
                  onChange={(e) => setEditUserType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#002e33] outline-none text-sm font-bold text-gray-800 transition-colors"
                >
                  <option value="mother">Mother</option>
                  <option value="admin">Admin</option>
                  <option value="policy_maker">Policy Maker</option>
                  <option value="health_worker">Health Worker</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdate}
                disabled={editLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm disabled:opacity-50 transition-all"
                style={{ background: "#002e33", color: "#86d9e1" }}
              >
                <Save size={14} />
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 py-3 rounded-xl font-black text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AllUsers;