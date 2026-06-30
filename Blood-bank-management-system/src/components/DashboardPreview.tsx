"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Activity,
  Users,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Clock,
  HeartPulse,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";
import { fetchJson } from "@/lib/fetchJson";

const donationTrend = [
  { month: "Jan", donations: 320, requests: 280 },
  { month: "Feb", donations: 380, requests: 310 },
  { month: "Mar", donations: 350, requests: 340 },
  { month: "Apr", donations: 420, requests: 390 },
  { month: "May", donations: 480, requests: 420 },
  { month: "Jun", donations: 520, requests: 460 },
  { month: "Jul", donations: 580, requests: 500 },
  { month: "Aug", donations: 540, requests: 490 },
  { month: "Sep", donations: 610, requests: 530 },
  { month: "Oct", donations: 650, requests: 570 },
  { month: "Nov", donations: 700, requests: 610 },
  { month: "Dec", donations: 750, requests: 650 },
];

const bloodTypeDist = [
  { name: "O+", value: 38, count: 38, color: "#DC143C" },
  { name: "A+", value: 28, count: 28, color: "#8B0000" },
  { name: "B+", value: 18, count: 18, color: "#FF6B6B" },
  { name: "AB+", value: 8, count: 8, color: "#FF9999" },
  { name: "O-", value: 4, count: 4, color: "#CC1F1F" },
  { name: "A-", value: 2, count: 2, color: "#A81414" },
  { name: "B-", value: 1.5, count: 1.5, color: "#771818" },
  { name: "AB-", value: 0.5, count: 0.5, color: "#400808" },
];

type BloodGroupChartItem = {
  name: string;
  value: number;
  count: number;
  color: string;
};

type RecentDonor = {
  donorId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bloodGroup: string;
  status: string;
  createdAt: string;
};

type StatsPayload = {
  totalUnits: number;
  donorCount: number;
  newRegistrations: number;
  requestCount: number;
  pendingRequests: number;
  recentDonors: RecentDonor[];
  bloodGroupStats: Array<{ bloodGroup: string; count: number }>;
};

const weeklyDonations = [
  { day: "Mon", units: 42 },
  { day: "Tue", units: 58 },
  { day: "Wed", units: 65 },
  { day: "Thu", units: 47 },
  { day: "Fri", units: 72 },
  { day: "Sat", units: 85 },
  { day: "Sun", units: 54 },
];

const recentActivity = [
  { action: "New donor registered", name: "Sarah M.", time: "2 min ago", type: "new" },
  { action: "Blood request fulfilled", name: "City General", time: "8 min ago", type: "fulfilled" },
  { action: "Emergency request", name: "St. Mary's", time: "15 min ago", type: "urgent" },
  { action: "Donation completed", name: "James K.", time: "22 min ago", type: "donation" },
  { action: "Inventory restocked", name: "Central Bank", time: "35 min ago", type: "inventory" },
];

const subscribeToClientSnapshot = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 group hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
          <Icon className="w-5 h-5 text-crimson-400" />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            positive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {positive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {change}
        </div>
      </div>
      <div className="font-display text-2xl font-bold text-white mb-1">
        {value}
      </div>
      <div className="text-xs text-white/40">{label}</div>
    </div>
  );
}

export default function DashboardPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState<'analytics' | 'requests' | 'donors' | 'inventory'>('analytics');
  
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  // Donation modal states
  const [selectedDonor, setSelectedDonor] = useState<any | null>(null);
  const [donationUnits, setDonationUnits] = useState(1);
  const [donationLocation, setDonationLocation] = useState("");
  const [donationNotes, setDonationNotes] = useState("");
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const canRenderCharts = useSyncExternalStore(
    subscribeToClientSnapshot,
    getClientSnapshot,
    getServerSnapshot
  );

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchJson<StatsPayload>("/api/stats", {
        label: "Admin dashboard statistics",
        cache: "no-store",
      });
      setStats(data);
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
      setStats(null);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    try {
      const data = await fetchJson<any[]>("/api/requests");
      setRequests(data);
    } catch (e) {
      console.error("Failed to load requests", e);
    }
  }, []);

  const loadDonors = useCallback(async () => {
    try {
      const data = await fetchJson<any[]>("/api/donors");
      setDonors(data);
    } catch (e) {
      console.error("Failed to load donors", e);
    }
  }, []);

  const loadInventory = useCallback(async () => {
    try {
      const data = await fetchJson<any[]>("/api/inventory");
      setInventory(data);
    } catch (e) {
      console.error("Failed to load inventory", e);
    }
  }, []);

  const refreshAllData = useCallback(() => {
    loadStats();
    loadRequests();
    loadDonors();
    loadInventory();
  }, [loadStats, loadRequests, loadDonors, loadInventory]);

  const updateRequestStatus = async (id: number, status: string) => {
    try {
      await fetchJson("/api/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      refreshAllData();
    } catch (e) {
      console.error("Failed to update request status", e);
    }
  };

  const updateInventoryUnits = async (bloodGroup: string, unitsAvailable: number, unitsReserved: number) => {
    try {
      await fetchJson("/api/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bloodGroup, unitsAvailable, unitsReserved }),
      });
      refreshAllData();
    } catch (e) {
      console.error("Failed to update inventory", e);
    }
  };

  const logDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonor) return;
    try {
      await fetchJson("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorId: selectedDonor.id,
          unitsDonated: donationUnits,
          location: donationLocation,
          notes: donationNotes,
        }),
      });
      setIsDonationModalOpen(false);
      setSelectedDonor(null);
      setDonationUnits(1);
      setDonationLocation("");
      setDonationNotes("");
      refreshAllData();
    } catch (e) {
      console.error("Failed to log donation", e);
    }
  };

  useEffect(() => {
    window.setTimeout(refreshAllData, 0);
    const interval = window.setInterval(refreshAllData, 5000);
    window.addEventListener("lifestream:donor-registered", refreshAllData);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("lifestream:donor-registered", refreshAllData);
    };
  }, [refreshAllData]);

  const adminBloodGroups = useMemo<BloodGroupChartItem[]>(() => {
    if (!stats?.bloodGroupStats?.length) return bloodTypeDist;
    const total = stats.bloodGroupStats.reduce((sum, item) => sum + Number(item.count), 0);
    const colors = ["#DC143C", "#8B0000", "#FF6B6B", "#FF9999", "#CC1F1F", "#A81414", "#771818", "#400808"];

    return stats.bloodGroupStats.map((item, index) => ({
      name: item.bloodGroup,
      value: total ? Math.round((Number(item.count) / total) * 100) : 0,
      count: Number(item.count),
      color: colors[index % colors.length],
    }));
  }, [stats]);

  const recentDonorActivity = stats?.recentDonors?.length
    ? stats.recentDonors.map((donor) => ({
        action: "New donor registered",
        name: `${donor.firstName} ${donor.lastName} - ${donor.bloodGroup}`,
        time: new Date(donor.createdAt).toLocaleString(),
        type: "new",
      }))
    : recentActivity;

  return (
    <section id="dashboard" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-crimson-900/8 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Building2 className="w-4 h-4 text-crimson-500" />
            <span className="text-sm font-medium text-white/60">
              Admin Dashboard
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-white">Powerful </span>
            <span className="gradient-text-red">Analytics</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Track new registrations, total donors, recent donor activity, and
            blood group statistics as LifeStream registrations arrive.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/5 mb-8 overflow-x-auto gap-2 p-1">
          {[
            { id: "analytics", label: "Analytics Overview" },
            { id: "requests", label: "Emergency Requests" },
            { id: "donors", label: "Donors Directory" },
            { id: "inventory", label: "Inventory Control" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-br from-crimson-600 to-blood-dark text-white shadow-lg shadow-crimson-950/20"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        {activeTab === "analytics" && (
          <>
            {/* Stat Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              <StatCard
                icon={HeartPulse}
                label="New Registrations"
                value={String(stats?.newRegistrations ?? 0)}
                change="Live"
                positive
              />
              <StatCard
                icon={Users}
                label="Total Donors"
                value={String(stats?.donorCount ?? 0)}
                change="DB"
                positive
              />
              <StatCard
                icon={Activity}
                label="Blood Requests"
                value={String(stats?.requestCount ?? 0)}
                change="All"
                positive={false}
              />
              <StatCard
                icon={AlertCircle}
                label="Pending Requests"
                value={String(stats?.pendingRequests ?? 0)}
                change="Open"
                positive
              />
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Area Chart - Donations vs Requests */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-2 glass-strong rounded-3xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      Donations vs Requests
                    </h3>
                    <p className="text-xs text-white/40 mt-1">
                      Monthly trend for the past year
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-1 rounded-full bg-crimson-500" />
                      Donations
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-1 rounded-full bg-white/20" />
                      Requests
                    </span>
                  </div>
                </div>
                <div className="h-[280px]" style={{ minHeight: 1 }}>
                  {canRenderCharts && (
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={donationTrend}>
                        <defs>
                          <linearGradient id="donationGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#DC143C" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#DC143C" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="requestGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.1} />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis
                          dataKey="month"
                          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#1a1a1a",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 12,
                            color: "#fff",
                            fontSize: 12,
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="donations"
                          stroke="#DC143C"
                          fill="url(#donationGrad)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="requests"
                          stroke="rgba(255,255,255,0.3)"
                          fill="url(#requestGrad)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </motion.div>

              {/* Pie Chart - Blood Type Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="glass-strong rounded-3xl p-6"
              >
                <div className="mb-4">
                  <h3 className="font-display text-lg font-bold text-white">
                    Blood Group Statistics
                  </h3>
                  <p className="text-xs text-white/40 mt-1">Registered donor mix</p>
                </div>
                <div className="h-[200px]" style={{ minHeight: 1 }}>
                  {canRenderCharts && (
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPie>
                        <Pie
                          data={adminBloodGroups}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {adminBloodGroups.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "#1a1a1a",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 12,
                            color: "#fff",
                            fontSize: 12,
                          }}
                          formatter={(value) => [`${String(value ?? 0)}%`, "Share"]}
                        />
                      </RechartsPie>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {adminBloodGroups.slice(0, 4).map((d) => (
                    <div key={d.name} className="flex items-center gap-2 text-xs">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: d.color }}
                      />
                      <span className="text-white/50">
                        {d.name}{" "}
                        <span className="text-white font-medium">
                          {d.count}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Bar Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="lg:col-span-2 glass-strong rounded-3xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      This Week&apos;s Donations
                    </h3>
                    <p className="text-xs text-white/40 mt-1">
                      Daily donation volume
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">+18%</span>
                    vs last week
                  </div>
                </div>
                <div className="h-[220px]" style={{ minHeight: 1 }}>
                  {canRenderCharts && (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={weeklyDonations}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.03)"
                        />
                        <XAxis
                          dataKey="day"
                          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#1a1a1a",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 12,
                            color: "#fff",
                            fontSize: 12,
                          }}
                        />
                        <Bar
                          dataKey="units"
                          fill="#DC143C"
                          radius={[6, 6, 0, 0]}
                          opacity={0.8}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="glass-strong rounded-3xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-5 h-5 text-crimson-400" />
                  <h3 className="font-display text-lg font-bold text-white">
                    Recent Donors
                  </h3>
                </div>
                <div className="space-y-4">
                  {recentDonorActivity.map((item, i) => (
                    <div
                      key={`recent-${item.name}-${item.time}-${i}`}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          item.type === "urgent"
                            ? "bg-red-400 animate-pulse"
                            : item.type === "fulfilled"
                            ? "bg-emerald-400"
                            : item.type === "donation"
                            ? "bg-crimson-400"
                            : "bg-blue-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white/80">{item.action}</div>
                        <div className="text-xs text-white/30 mt-0.5">
                          {item.name} - {item.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Requests Management Tab */}
        {activeTab === "requests" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Emergency Blood Requests</h3>
                <p className="text-xs text-white/40 mt-1">Pending and fulfilled hospital requests</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/5 text-xs uppercase text-white/30">
                    <th className="py-3 px-4">Patient / Hospital</th>
                    <th className="py-3 px-4">Group Needed</th>
                    <th className="py-3 px-4">Units Needed</th>
                    <th className="py-3 px-4">Urgency</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-white/35">No blood requests logged yet.</td>
                    </tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={`req-${req.id}`} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">{req.patientName}</div>
                          <div className="text-xs text-white/45 mt-0.5">{req.hospitalName}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-crimson-600/10 border border-crimson-600/20 text-crimson-400 font-bold">
                            {req.bloodGroup}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-base font-semibold text-white">{req.unitsNeeded} units</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            req.urgency === "critical"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : req.urgency === "urgent"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-white/5 text-white/50"
                          }`}>
                            {req.urgency}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            req.status === "fulfilled"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : req.status === "rejected"
                              ? "bg-white/5 text-white/30"
                              : req.status === "urgent"
                              ? "bg-red-500/15 text-red-400 border border-red-500/20 animate-pulse"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                          {req.status === "pending" || req.status === "urgent" ? (
                            <>
                              <button
                                onClick={() => updateRequestStatus(req.id, "fulfilled")}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold transition-all"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateRequestStatus(req.id, "rejected")}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs font-semibold transition-all"
                              >
                                Reject
                              </button>
                              {req.urgency !== "critical" && req.status !== "urgent" && (
                                <button
                                  onClick={() => updateRequestStatus(req.id, "urgent")}
                                  className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 text-red-400 text-xs font-semibold transition-all"
                                >
                                  Mark Urgent
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-white/20">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Donors Directory Tab */}
        {activeTab === "donors" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Donors Directory</h3>
                <p className="text-xs text-white/40 mt-1">List of registered blood donors</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/5 text-xs uppercase text-white/30">
                    <th className="py-3 px-4">Donor ID / Name</th>
                    <th className="py-3 px-4">Blood Group</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Last Donation</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {donors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-white/35">No donors registered yet.</td>
                    </tr>
                  ) : (
                    donors.map((donor) => (
                      <tr key={`donor-${donor.id}`} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">{donor.firstName} {donor.lastName}</div>
                          <div className="text-xs text-white/45 mt-0.5">{donor.donorId}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-crimson-600/10 border border-crimson-600/20 text-crimson-400 font-bold">
                            {donor.bloodGroup}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs">
                          <div>{donor.email}</div>
                          <div className="text-white/45 mt-0.5">{donor.phone}</div>
                        </td>
                        <td className="py-4 px-4 text-xs text-white/70">
                          {donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : "Never"}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            donor.status === "Active Donor"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-white/5 text-white/50"
                          }`}>
                            {donor.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedDonor(donor);
                              setIsDonationModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-crimson-500/10 border border-crimson-500/20 hover:bg-crimson-500/25 text-crimson-400 text-xs font-semibold transition-all whitespace-nowrap"
                          >
                            Record Donation
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Inventory Control Tab */}
        {activeTab === "inventory" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Inventory Control</h3>
                <p className="text-xs text-white/40 mt-1">Directly adjust available and reserved units</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {inventory.length === 0 ? (
                <div className="col-span-full py-8 text-center text-white/35">No inventory loaded yet.</div>
              ) : (
                inventory.map((item) => (
                  <div key={`inv-${item.id}`} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-crimson-600/15 border border-crimson-600/30 text-crimson-400 font-display text-lg font-bold">
                        {item.bloodGroup}
                      </span>
                      <span className="text-right text-[10px] text-white/45 uppercase tracking-wider">
                        Updated {new Date(item.lastUpdated).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-white/30">Available</div>
                          <div className="text-2xl font-bold text-white mt-1">{item.unitsAvailable} units</div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateInventoryUnits(item.bloodGroup, Math.max(0, item.unitsAvailable - 1), item.unitsReserved)}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white font-bold transition-all"
                          >
                            -
                          </button>
                          <button
                            onClick={() => updateInventoryUnits(item.bloodGroup, item.unitsAvailable + 1, item.unitsReserved)}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white font-bold transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/5 pt-3">
                        <div>
                          <div className="text-xs text-white/30">Reserved</div>
                          <div className="text-sm font-semibold text-white/80 mt-0.5">{item.unitsReserved} units</div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateInventoryUnits(item.bloodGroup, item.unitsAvailable, Math.max(0, item.unitsReserved - 1))}
                            className="w-7 h-7 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white/70 text-xs transition-all"
                          >
                            -
                          </button>
                          <button
                            onClick={() => updateInventoryUnits(item.bloodGroup, item.unitsAvailable, item.unitsReserved + 1)}
                            className="w-7 h-7 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white/70 text-xs transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Donation Record Modal Overlay */}
        <AnimatePresence>
          {isDonationModalOpen && selectedDonor && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDonationModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl shadow-crimson-950/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-lg font-bold text-white">Record Blood Donation</h3>
                  <button
                    onClick={() => setIsDonationModalOpen(false)}
                    className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white text-xl transition-all"
                  >
                    &times;
                  </button>
                </div>
                <form onSubmit={logDonation} className="space-y-4">
                  <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4 text-xs text-white/70 space-y-2">
                    <div>
                      <span className="text-white/30 uppercase tracking-wider">Donor:</span>{" "}
                      <strong className="text-white font-semibold">{selectedDonor.firstName} {selectedDonor.lastName}</strong>
                    </div>
                    <div>
                      <span className="text-white/30 uppercase tracking-wider">Donor ID:</span>{" "}
                      <code className="text-white">{selectedDonor.donorId}</code>
                    </div>
                    <div>
                      <span className="text-white/30 uppercase tracking-wider">Blood Group:</span>{" "}
                      <strong className="text-crimson-400 font-bold">{selectedDonor.bloodGroup}</strong>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Units Donated</label>
                    <input
                      type="number"
                      min="1"
                      value={donationUnits}
                      onChange={(e) => setDonationUnits(parseInt(e.target.value) || 1)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-crimson-500/40 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Donation Location</label>
                    <input
                      type="text"
                      value={donationLocation}
                      onChange={(e) => setDonationLocation(e.target.value)}
                      placeholder="Central Clinic, St. Jude Center..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-crimson-500/40 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Internal Notes</label>
                    <textarea
                      value={donationNotes}
                      onChange={(e) => setDonationNotes(e.target.value)}
                      placeholder="E.g., regular donation, post-travel check complete..."
                      rows={2}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-crimson-500/40 transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-br from-crimson-600 to-blood-dark text-white font-semibold text-base shadow-lg shadow-crimson-950/20 hover:shadow-crimson-600/10 transition-all flex items-center justify-center gap-2"
                  >
                    Save Donation Record
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
