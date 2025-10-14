import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { getCurrentUser, logoutAdmin } from "@/lib/auth";
import { toast } from "sonner";
import { Download, LogOut, Users, TrendingUp } from "lucide-react";
import "./Admin.css";

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchUsers();
    setupRealtimeSubscription();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (!user) {
      toast.error("Please login to access admin dashboard");
      navigate("/admin");
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error, count } = await supabase
        .from("waitlist")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (error) throw error;

      setUsers(data || []);
      setTotalCount(count || 0);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("waitlist-admin-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "waitlist",
        },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      toast.success("Logged out successfully");
      navigate("/admin");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Joined Date"];
    const csvData = users.map((user) => [
      user.name,
      user.email,
      new Date(user.created_at).toLocaleString(),
    ]);

    const csv = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scout-waitlist-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Exported to CSV!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="admin-container">
        <div className="loading-state">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-dashboard-header">
        <div className="header-left">
          <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            SCOUT
          </h1>
          <span className="admin-badge">Admin Dashboard</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} />
          Logout
        </button>
      </header>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Signups</p>
            <h2 className="stat-value">{207 + totalCount}</h2>
            <p className="stat-detail">{totalCount} in database</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Progress</p>
            <h2 className="stat-value">{Math.round(((207 + totalCount) / 1000) * 100)}%</h2>
            <p className="stat-detail">of 1000 goal</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Download size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Export Data</p>
            <button onClick={exportToCSV} className="export-btn-inline">
              Download CSV
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>Waitlist Users ({totalCount})</h2>
          <button onClick={exportToCSV} className="export-btn">
            <Download size={18} />
            Export CSV
          </button>
        </div>

        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-state">
                    No users yet. Share your waitlist link!
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{formatDate(user.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

