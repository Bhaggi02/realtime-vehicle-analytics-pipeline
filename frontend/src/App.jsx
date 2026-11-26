import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Car, RefreshCw, Layers, ArrowUpRight, ArrowDownLeft, SlidersHorizontal, Video } from 'lucide-react';

export default function App() {
  const [events, setEvents] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, colors: {}, inbound: 0, outbound: 0 });
  const [selectedColorFilter, setSelectedColorFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalyticsData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch('http://localhost:5001/api/events');
      const data = await res.json();
      setEvents(data);
      
      const counts = {};
      let inboundCount = 0;
      let outboundCount = 0;
      
      data.forEach(item => {
        const itemColor = item.color || 'Unknown';
        counts[itemColor] = (counts[itemColor] || 0) + 1;
        if (item.direction === 'Inbound') inboundCount++;
        if (item.direction === 'Outbound') outboundCount++;
      });
      
      setMetrics({ total: data.length, colors: counts, inbound: inboundCount, outbound: outboundCount });
      setTimeout(() => setIsRefreshing(false), 400);
    } catch (err) {
      console.error("Backend Rest API fetch error:", err);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    const networkInterval = setInterval(fetchAnalyticsData, 1500); 
    return () => clearInterval(networkInterval);
  }, []);

  const barChartData = Object.entries(metrics.colors).map(([color, count]) => ({
    name: color.charAt(0).toUpperCase() + color.slice(1),
    Count: count,
  }));

  const pieChartData = [
    { name: 'Inbound Vector', value: metrics.inbound, color: '#10B981' },
    { name: 'Outbound Vector', value: metrics.outbound, color: '#EF4444' }
  ];

  const filteredEvents = selectedColorFilter === 'All' 
    ? events 
    : events.filter(e => e.color.toLowerCase() === selectedColorFilter.toLowerCase());

  const uniqueColors = ['All', ...Object.keys(metrics.colors)];
  return (
    <div style={{ backgroundColor: '#0F172A', color: '#F8FAFC', minHeight: '100vh', padding: '32px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #334155', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0, background: 'linear-gradient(to right, #3B82F6, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Real-Time Vehicle Analytics Pipeline
          </h1>
          <p style={{ color: '#94A3B8', margin: '4px 0 0 0', fontSize: '14px' }}>Vision Engineering Sprint Hub • Production Control Center</p>
        </div>
        <button onClick={fetchAnalyticsData} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Syncing...' : 'Force Data Sync'}
        </button>
      </div>

      {/* Numerical Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px', border: '1px solid #2563EB', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3B82F6' }}><Car size={24} /><Layers size={24} /></div>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '12px', marginBottom: '4px' }}>Total System Counts</p>
          <p style={{ fontSize: '42px', fontWeight: '900', margin: 0, color: '#3B82F6' }}>{metrics.total}</p>
        </div>
        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px', border: '1px solid #10B981' }}>
          <div style={{ color: '#10B981' }}><ArrowDownLeft size={24} /></div>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '12px', marginBottom: '4px' }}>Inbound Entry Vector</p>
          <p style={{ fontSize: '42px', fontWeight: '900', margin: 0, color: '#10B981' }}>{metrics.inbound}</p>
        </div>
        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px', border: '1px solid #EF4444' }}>
          <div style={{ color: '#EF4444' }}><ArrowUpRight size={24} /></div>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '12px', marginBottom: '4px' }}>Outbound Exit Vector</p>
          <p style={{ fontSize: '42px', fontWeight: '900', margin: 0, color: '#EF4444' }}>{metrics.outbound}</p>
        </div>
      </div>

      {/* Video Stream + Graphs Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#60A5FA', margin: 0 }}><Video size={20} /> DeepStream Live Processing View</h3>
            <span style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>● LIVE STREAM</span>
          </div>
          <div style={{ backgroundColor: '#020617', flexGrow: 1, borderRadius: '12px', minHeight: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', border: '1px solid #475569' }}>
            <div style={{ position: 'absolute', top: '55%', left: 0, right: 0, height: '2px', backgroundColor: '#EF4444', boxShadow: '0 0 8px #EF4444', zIndex: 10 }} />
            <div style={{ position: 'absolute', top: '46%', left: '16px', color: '#EF4444', fontSize: '11px', fontWeight: '800', zIndex: 11 }}>TRIGGER_LINE (Y=540)</div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: '#38BDF8', fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0' }}>MediaMTX Stream Channel Active</p>
              <p style={{ color: '#64748B', fontSize: '12px', margin: 0 }}>Bounding Boxes Overlay Rendering Enabled</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 12px 0', color: '#38BDF8' }}>Vehicle Color Attributes Distribution</h4>
            <div style={{ width: '100%', height: 110 }}>
              <ResponsiveContainer>
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#FFF' }} />
                  <Bar dataKey="Count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 12px 0', color: '#34D399' }}>Real-Time Inbound / Outbound Ratio Split</h4>
            <div style={{ width: '100%', height: 100 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={28} outerRadius={42} paddingAngle={4} dataKey="value">
                    {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="right" layout="vertical" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      {/* Event Log Register Table and Filter Center */}
      <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#F1F5F9', margin: 0 }}>Live Crossing Boundary Registers Database</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0F172A', padding: '8px 14px', borderRadius: '8px', border: '1px solid #334155' }}>
            <SlidersHorizontal size={14} style={{ color: '#94A3B8' }} />
            <span style={{ color: '#94A3B8', fontSize: '13px', fontWeight: '500' }}>Filter Attribute:</span>
            <select value={selectedColorFilter} onChange={(e) => setSelectedColorFilter(e.target.value)} style={{ backgroundColor: 'transparent', color: '#F8FAFC', border: 'none', outline: 'none', cursor: 'pointer', textTransform: 'capitalize', fontWeight: '600' }}>
              {uniqueColors.map(c => <option key={c} value={c} style={{ backgroundColor: '#0F172A' }}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #334155', color: '#94A3B8', fontSize: '14px' }}>
                <th style={{ padding: '14px 12px' }}>Tracking Engine ID</th>
                <th style={{ padding: '14px 12px' }}>Color Attribute</th>
                <th style={{ padding: '14px 12px' }}>Direction Vector</th>
                <th style={{ padding: '14px 12px' }}>Event Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>Awaiting operational database logs...</td></tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} style={{ borderBottom: '1px solid #334155', fontSize: '15px', color: '#E2E8F0' }}>
                    <td style={{ padding: '14px 12px', fontWeight: '700', color: '#3B82F6' }}>#{event.vehicle_id}</td>
                    <td style={{ padding: '14px 12px', textTransform: 'capitalize' }}>{event.color}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ backgroundColor: event.direction === 'Inbound' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: event.direction === 'Inbound' ? '#10B981' : '#EF4444', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                        {event.direction}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#94A3B8' }}>{new Date(event.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
