import React, { useState, useEffect } from 'react';
import { 
  Search, RefreshCw, Eye, MessageSquare, CheckCircle, 
  Clock, AlertCircle, X, Calendar, Mail, Phone,
  Plane, Compass, Briefcase, ArrowLeft, Download
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface Inquiry {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string | null;
  inquiry_type: 'tour' | 'ticketing' | 'corporate';
  status: 'new' | 'in_progress' | 'responded' | 'closed';
  tour_name: string | null;
  travel_date: string | null;
  group_size: string | null;
  trip_type: string | null;
  departure_city: string | null;
  destination_city: string | null;
  departure_date: string | null;
  return_date: string | null;
  passengers: number | null;
  travel_class: string | null;
  company_name: string | null;
  position: string | null;
  employee_count: string | null;
  travel_frequency: string | null;
  services_needed: string[] | null;
  message: string | null;
  admin_notes: string | null;
  responded_at: string | null;
  responded_by: string | null;
}

interface TourPackage {
  id: string;
  created_at: string;
  name: string;
  location: string;
  category: string;
  duration: string;
  group_size: string;
  difficulty: string;
  price: string;
  description: string;
  image: string;
  highlights: string[] | null;
  is_active: boolean | null;
  sort_order: number | null;
}

const Admin: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'inquiries' | 'packages'>('inquiries');

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [clearingInquiries, setClearingInquiries] = useState(false);

  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [packageError, setPackageError] = useState<string | null>(null);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [packageForm, setPackageForm] = useState({
    name: '',
    location: '',
    category: '',
    duration: '',
    group_size: '',
    difficulty: '',
    price: '',
    description: '',
    image: '',
    highlights: '',
    is_active: true,
    sort_order: 0
  });
  const [packageSaving, setPackageSaving] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setAuthError(error.message);
      }
      setSession(data.session);
      setAuthLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    fetchInquiries();
    fetchPackages();
  }, [session]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    setPackagesLoading(true);
    setPackageError(null);
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setPackages((data as TourPackage[]) || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load packages.';
      setPackageError(message);
    } finally {
      setPackagesLoading(false);
    }
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPackageForm = () => {
    setEditingPackage(null);
    setPackageForm({
      name: '',
      location: '',
      category: '',
      duration: '',
      group_size: '',
      difficulty: '',
      price: '',
      description: '',
      image: '',
      highlights: '',
      is_active: true,
      sort_order: 0
    });
  };

  const openPackageEditor = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setPackageForm({
      name: pkg.name || '',
      location: pkg.location || '',
      category: pkg.category || '',
      duration: pkg.duration || '',
      group_size: pkg.group_size || '',
      difficulty: pkg.difficulty || '',
      price: pkg.price || '',
      description: pkg.description || '',
      image: pkg.image || '',
      highlights: (pkg.highlights || []).join(', '),
      is_active: pkg.is_active ?? true,
      sort_order: pkg.sort_order ?? 0
    });
  };

  const handlePackageSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPackageSaving(true);
    setPackageError(null);

    const highlights = packageForm.highlights
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      name: packageForm.name.trim(),
      location: packageForm.location.trim(),
      category: packageForm.category.trim(),
      duration: packageForm.duration.trim(),
      group_size: packageForm.group_size.trim(),
      difficulty: packageForm.difficulty.trim(),
      price: packageForm.price.trim(),
      description: packageForm.description.trim(),
      image: packageForm.image.trim(),
      highlights,
      is_active: packageForm.is_active,
      sort_order: Number(packageForm.sort_order) || 0
    };

    try {
      if (editingPackage) {
        const { error } = await supabase
          .from('tours')
          .update(payload)
          .eq('id', editingPackage.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tours')
          .insert(payload);
        if (error) throw error;
      }

      resetPackageForm();
      fetchPackages();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save package.';
      setPackageError(message);
    } finally {
      setPackageSaving(false);
    }
  };

  const togglePackageActive = async (pkg: TourPackage) => {
    setPackageSaving(true);
    setPackageError(null);
    try {
      const { error } = await supabase
        .from('tours')
        .update({ is_active: !pkg.is_active })
        .eq('id', pkg.id);
      if (error) throw error;
      fetchPackages();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update package.';
      setPackageError(message);
    } finally {
      setPackageSaving(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    setUpdating(true);
    try {
      const updateData: Partial<Inquiry> & { status: Inquiry['status']; updated_at: string } = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'responded') {
        updateData.responded_at = new Date().toISOString();
        updateData.responded_by = 'Admin';
      }

      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      const { error } = await supabase
        .from('inquiries')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setInquiries(prev => 
        prev.map(inq => 
          inq.id === id ? { ...inq, ...updateData } : inq
        )
      );

      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, ...updateData } : null);
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
    } finally {
      setUpdating(false);
    }
  };

  const clearAllInquiries = async () => {
    const confirmClear = window.confirm('This will permanently delete all inquiries. Continue?');
    if (!confirmClear) return;
    setClearingInquiries(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        throw new Error('Missing session token for clearing inquiries.');
      }
      const { error } = await supabase.functions.invoke('clear-inquiries', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (error) throw error;
      setInquiries([]);
      setSelectedInquiry(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error clearing inquiries:', error);
    } finally {
      setClearingInquiries(false);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inquiry.company_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inquiry.tour_name?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    const matchesType = typeFilter === 'all' || inquiry.inquiry_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-amber-100 text-amber-700',
      responded: 'bg-emerald-100 text-emerald-700',
      closed: 'bg-gray-100 text-gray-700'
    };
    const labels = {
      new: 'New',
      in_progress: 'In Progress',
      responded: 'Responded',
      closed: 'Closed'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tour':
        return <Compass className="w-4 h-4" />;
      case 'ticketing':
        return <Plane className="w-4 h-4" />;
      case 'corporate':
        return <Briefcase className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      tour: 'Tour',
      ticketing: 'Ticketing',
      corporate: 'Corporate'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    inProgress: inquiries.filter(i => i.status === 'in_progress').length,
    responded: inquiries.filter(i => i.status === 'responded').length
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Type', 'Status', 'Details', 'Message'];
    const rows = filteredInquiries.map(inq => [
      formatDate(inq.created_at),
      inq.name,
      inq.email,
      inq.phone || '',
      getTypeLabel(inq.inquiry_type),
      inq.status,
      inq.inquiry_type === 'tour' ? `${inq.tour_name || 'Custom'} - ${inq.travel_date || 'TBD'}` :
      inq.inquiry_type === 'ticketing' ? `${inq.departure_city} to ${inq.destination_city}` :
      inq.company_name || '',
      inq.message || ''
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-emerald-100/60 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600 mb-6">Sign in to manage inquiries and packages.</p>
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {authError}
            </div>
          )}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                placeholder="admin@businessplusvacation.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/85 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href={import.meta.env.BASE_URL}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Site</span>
              </a>
              <div className="h-6 w-px bg-emerald-200/80" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Inquiry Management</h1>
                <p className="text-xs text-emerald-700 font-medium">Busiva Admin Console</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'inquiries'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Inquiries
              </button>
              <button
                onClick={() => setActiveTab('packages')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'packages'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Packages
              </button>
              <button
                onClick={exportToCSV}
                disabled={activeTab !== 'inquiries'}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={clearAllInquiries}
                disabled={activeTab !== 'inquiries' || clearingInquiries}
                className="flex items-center gap-2 px-4 py-2 text-red-700 bg-white border border-red-200 rounded-full hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <X className={`w-4 h-4 ${clearingInquiries ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">Clear All</span>
              </button>
              <button
                onClick={() => (activeTab === 'inquiries' ? fetchInquiries() : fetchPackages())}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full hover:from-emerald-700 hover:to-emerald-800 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <RefreshCw className={`w-4 h-4 ${activeTab === 'inquiries' ? (loading ? 'animate-spin' : '') : (packagesLoading ? 'animate-spin' : '')}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'inquiries' && (
          <>
            {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm border border-emerald-100/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm border border-emerald-100/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
                <p className="text-sm text-gray-500">New</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm border border-emerald-100/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.inProgress}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm border border-emerald-100/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{stats.responded}</p>
                <p className="text-sm text-gray-500">Responded</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm border border-emerald-100/60 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="tour">Tours</option>
              <option value="ticketing">Ticketing</option>
              <option value="corporate">Corporate</option>
            </select>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-emerald-100/60 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading inquiries...</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No inquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-50/60 border-b border-emerald-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Contact</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Details</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-emerald-50/40">
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{formatDate(inquiry.created_at)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{inquiry.name}</p>
                        <p className="text-sm text-gray-500">{inquiry.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            inquiry.inquiry_type === 'tour' ? 'bg-purple-100 text-purple-600' :
                            inquiry.inquiry_type === 'ticketing' ? 'bg-blue-100 text-blue-600' :
                            'bg-amber-100 text-amber-600'
                          }`}>
                            {getTypeIcon(inquiry.inquiry_type)}
                          </div>
                          <span className="text-sm text-gray-700">{getTypeLabel(inquiry.inquiry_type)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700 max-w-xs truncate">
                          {inquiry.inquiry_type === 'tour' && (inquiry.tour_name || 'Custom Tour')}
                          {inquiry.inquiry_type === 'ticketing' && `${inquiry.departure_city} -> ${inquiry.destination_city}`}
                          {inquiry.inquiry_type === 'corporate' && inquiry.company_name}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(inquiry.status)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            setAdminNotes(inquiry.admin_notes || '');
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
          </>
        )}

        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-sm border border-emerald-100/60">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Tour Packages</h2>
                  <p className="text-sm text-gray-500">Create, update, and deactivate tour packages.</p>
                </div>
                <button
                  onClick={resetPackageForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  New Package
                </button>
              </div>

              {packageError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {packageError}
                </div>
              )}

              <form onSubmit={handlePackageSubmit} className="grid lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={packageForm.name}
                    onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={packageForm.location}
                    onChange={(e) => setPackageForm({ ...packageForm, location: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={packageForm.category}
                    onChange={(e) => setPackageForm({ ...packageForm, category: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <input
                    type="text"
                    value={packageForm.difficulty}
                    onChange={(e) => setPackageForm({ ...packageForm, difficulty: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={packageForm.duration}
                    onChange={(e) => setPackageForm({ ...packageForm, duration: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group Size</label>
                  <input
                    type="text"
                    value={packageForm.group_size}
                    onChange={(e) => setPackageForm({ ...packageForm, group_size: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="text"
                    value={packageForm.price}
                    onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={packageForm.sort_order}
                    onChange={(e) => setPackageForm({ ...packageForm, sort_order: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={packageForm.image}
                    onChange={(e) => setPackageForm({ ...packageForm, image: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={packageForm.description}
                    onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                    rows={4}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Highlights (comma or new line)</label>
                  <textarea
                    value={packageForm.highlights}
                    onChange={(e) => setPackageForm({ ...packageForm, highlights: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                  />
                </div>
                <div className="lg:col-span-2 flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={packageForm.is_active}
                      onChange={(e) => setPackageForm({ ...packageForm, is_active: e.target.checked })}
                    />
                    Active
                  </label>
                  <div className="ml-auto flex gap-3">
                    {editingPackage && (
                      <button
                        type="button"
                        onClick={resetPackageForm}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={packageSaving}
                      className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-70"
                    >
                      {editingPackage ? 'Update Package' : 'Create Package'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-emerald-100/60 overflow-hidden">
              {packagesLoading ? (
                <div className="p-12 text-center">
                  <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Loading packages...</p>
                </div>
              ) : packages.length === 0 ? (
                <div className="p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No packages found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-emerald-50/60 border-b border-emerald-100">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Name</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Category</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Price</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {packages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-emerald-50/40">
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-gray-900">{pkg.name}</p>
                            <p className="text-xs text-gray-500">{pkg.location}</p>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{pkg.category}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{pkg.price}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pkg.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {pkg.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => openPackageEditor(pkg)}
                                className="px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => togglePackageActive(pkg)}
                                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                {pkg.is_active ? 'Deactivate' : 'Activate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeTab === 'inquiries' && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedInquiry(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-emerald-100/60 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Inquiry Details</h2>
                <p className="text-sm text-gray-500">ID: {selectedInquiry.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Type */}
              <div className="flex items-center gap-4">
                {getStatusBadge(selectedInquiry.status)}
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  selectedInquiry.inquiry_type === 'tour' ? 'bg-purple-100 text-purple-700' :
                  selectedInquiry.inquiry_type === 'ticketing' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {getTypeIcon(selectedInquiry.inquiry_type)}
                  {getTypeLabel(selectedInquiry.inquiry_type)} Inquiry
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{selectedInquiry.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a href={`mailto:${selectedInquiry.email}`} className="font-medium text-emerald-600 hover:underline">
                        {selectedInquiry.email}
                      </a>
                    </div>
                  </div>
                  {selectedInquiry.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a href={`tel:${selectedInquiry.phone}`} className="font-medium text-emerald-600 hover:underline">
                          {selectedInquiry.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submitted</p>
                      <p className="font-medium text-gray-900">{formatDate(selectedInquiry.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inquiry Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Inquiry Details</h3>
                
                {selectedInquiry.inquiry_type === 'tour' && (
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Tour:</span> <span className="font-medium">{selectedInquiry.tour_name || 'Custom Tour'}</span></p>
                    <p><span className="text-gray-500">Travel Date:</span> <span className="font-medium">{selectedInquiry.travel_date || 'Not specified'}</span></p>
                    <p><span className="text-gray-500">Group Size:</span> <span className="font-medium">{selectedInquiry.group_size || 'Not specified'}</span></p>
                  </div>
                )}

                {selectedInquiry.inquiry_type === 'ticketing' && (
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Trip Type:</span> <span className="font-medium capitalize">{selectedInquiry.trip_type}</span></p>
                    <p><span className="text-gray-500">Route:</span> <span className="font-medium">{selectedInquiry.departure_city} to {selectedInquiry.destination_city}</span></p>
                    <p><span className="text-gray-500">Departure:</span> <span className="font-medium">{selectedInquiry.departure_date || 'Not specified'}</span></p>
                    {selectedInquiry.return_date && (
                      <p><span className="text-gray-500">Return:</span> <span className="font-medium">{selectedInquiry.return_date}</span></p>
                    )}
                    <p><span className="text-gray-500">Passengers:</span> <span className="font-medium">{selectedInquiry.passengers}</span></p>
                    <p><span className="text-gray-500">Class:</span> <span className="font-medium capitalize">{selectedInquiry.travel_class}</span></p>
                  </div>
                )}

                {selectedInquiry.inquiry_type === 'corporate' && (
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Company:</span> <span className="font-medium">{selectedInquiry.company_name}</span></p>
                    {selectedInquiry.position && (
                      <p><span className="text-gray-500">Position:</span> <span className="font-medium">{selectedInquiry.position}</span></p>
                    )}
                    {selectedInquiry.employee_count && (
                      <p><span className="text-gray-500">Employees:</span> <span className="font-medium">{selectedInquiry.employee_count}</span></p>
                    )}
                    {selectedInquiry.travel_frequency && (
                      <p><span className="text-gray-500">Travel Frequency:</span> <span className="font-medium capitalize">{selectedInquiry.travel_frequency}</span></p>
                    )}
                    {selectedInquiry.services_needed && selectedInquiry.services_needed.length > 0 && (
                      <div>
                        <p className="text-gray-500 mb-1">Services Needed:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedInquiry.services_needed.map((service, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white rounded-lg text-sm">{service}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message */}
              {selectedInquiry.message && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Message</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                  placeholder="Add internal notes about this inquiry..."
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => updateInquiryStatus(selectedInquiry.id, 'in_progress')}
                  disabled={updating || selectedInquiry.status === 'in_progress'}
                  className="flex-1 py-3 bg-amber-100 text-amber-700 rounded-xl font-medium hover:bg-amber-200 transition-colors disabled:opacity-50"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => updateInquiryStatus(selectedInquiry.id, 'responded')}
                  disabled={updating || selectedInquiry.status === 'responded'}
                  className="flex-1 py-3 bg-emerald-100 text-emerald-700 rounded-xl font-medium hover:bg-emerald-200 transition-colors disabled:opacity-50"
                >
                  Mark Responded
                </button>
                <button
                  onClick={() => updateInquiryStatus(selectedInquiry.id, 'closed')}
                  disabled={updating || selectedInquiry.status === 'closed'}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Close
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: Your ${getTypeLabel(selectedInquiry.inquiry_type)} Inquiry - Busiva Travel`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Send Email
                </a>
                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

