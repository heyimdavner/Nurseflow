import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp, 
  Building2, 
  ArrowRight,
  ShieldAlert,
  Info,
  ChevronRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useNurseFlow } from '../../context/NurseFlowContext';

export const DashboardTab: React.FC = () => {
  const {
    user,
    programCompletionPercentage,
    overallAttendanceRate,
    isAttendanceBelowThreshold,
    totalValidDays,
    totalPresentDays,
    totalAbsentDays,
    totalMedicalHolidayDays,
    totalHalfDays,
    totalClinicalHoursLogged,
    semesterHoursStats,
    monthlyStats,
    wardCategoryDistribution,
    specificWardDistribution,
    setActiveTab,
    duties
  } = useNurseFlow();

  const [wardViewMode, setWardViewMode] = useState<'categories' | 'specific'>('categories');
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // Maximum clinical hours for monthly scaling
  const maxMonthlyHours = Math.max(
    30,
    ...monthlyStats.map(m => m.clinicalHours)
  );

  return (
    <div id="dashboard-tab-container" className="space-y-6 animate-in fade-in duration-200">
      
      {/* 2. PROGRAM TIMELINE & TOTAL COMPLETION PROGRESS BAR */}
      <div 
        id="program-progress-card"
        className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Program Completion</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-white/10 text-cyan-300 border border-white/10">
                LSN: {user.lsn}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">3-Year Nursing Curriculum Journey</h2>
            <p className="text-xs text-zinc-400 italic mt-0.5">
              Program Span: <span className="text-zinc-300 font-mono">{user.programStartDate}</span> to <span className="text-zinc-300 font-mono">{user.programEndDate}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-black text-cyan-400 font-mono">
                {programCompletionPercentage}%
              </span>
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Timeline Elapsed</p>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar with Semester Dividers */}
        <div className="space-y-2">
          <div className="relative w-full bg-white/5 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div 
              className="h-full bg-cyan-500 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
              style={{ width: `${programCompletionPercentage}%` }}
            />
          </div>

          {/* 6 Semester Markers */}
          <div className="grid grid-cols-6 text-[10px] text-zinc-400 font-mono pt-1 text-center border-t border-white/5">
            <span>Sem 1</span>
            <span>Sem 2</span>
            <span>Sem 3</span>
            <span>Sem 4</span>
            <span>Sem 5</span>
            <span>Sem 6 (Grad)</span>
          </div>
        </div>
      </div>

      {/* 3. EXECUTIVE ATTENDANCE GAUGES & COMPLIANCE DIALS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overall Attendance Dial & Breakdown */}
        <div 
          id="attendance-rate-gauge-card"
          className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isAttendanceBelowThreshold ? 'bg-rose-500/20 text-rose-400' : 'bg-teal-500/20 text-teal-400'}`}>
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Attendance</span>
                <h3 className="text-base font-bold text-white">Current Standing: {overallAttendanceRate}%</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border backdrop-blur-sm ${
                isAttendanceBelowThreshold
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-teal-500/20 border-teal-500/30 text-teal-300'
              }`}>
                {isAttendanceBelowThreshold ? 'Below 80% Threshold' : 'Compliant Standing'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-2">
            
            {/* Visual Gauge Meter */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-zinc-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Target 80% guide line marker */}
                  <path
                    className="text-amber-500/40"
                    strokeWidth="3.5"
                    strokeDasharray="80, 100"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Actual Attendance Value */}
                  <path
                    className={isAttendanceBelowThreshold ? 'text-rose-400' : 'text-teal-400'}
                    strokeDasharray={`${Math.min(100, overallAttendanceRate)}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-white font-mono">{overallAttendanceRate}%</span>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400">Target 80%</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 text-center mt-2">
                Min. Benchmark: <strong className="text-amber-400">80.0%</strong>
              </p>
            </div>

            {/* Attendance Mathematical Breakdown Grid */}
            <div className="sm:col-span-2 grid grid-cols-2 gap-2.5">
              
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Eligible / Valid Days</span>
                <p className="text-xl font-bold text-white font-mono mt-0.5">{totalValidDays}</p>
                <p className="text-[10px] text-zinc-500">Denominator pool</p>
              </div>

              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-400">Present Shifts</span>
                <p className="text-xl font-bold text-teal-300 font-mono mt-0.5">{totalPresentDays}</p>
                <p className="text-[10px] text-teal-500/80">1.0 day weight (100%)</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Half Day Duties</span>
                <p className="text-xl font-bold text-amber-300 font-mono mt-0.5">{totalHalfDays}</p>
                <p className="text-[10px] text-amber-500/80">0.5 day credit weight</p>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400">Absent Days</span>
                <p className="text-xl font-bold text-rose-300 font-mono mt-0.5">{totalAbsentDays}</p>
                <p className="text-[10px] text-rose-500/80">0.0 day penalty</p>
              </div>

              <div className="col-span-2 p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                <span className="text-cyan-300">Protected Medical &amp; Special Holidays:</span>
                <span className="font-bold text-cyan-200 font-mono">{totalMedicalHolidayDays} days (1.0 weight)</span>
              </div>

            </div>

          </div>
        </div>

        {/* Quick Shift Counter & Summary */}
        <div 
          id="clinical-hours-summary-card"
          className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-white/10 text-cyan-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Clinical Hours</span>
                <h3 className="text-base font-bold text-white">Program Rollover</h3>
              </div>
            </div>

            <div className="my-4 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono">
                {totalClinicalHoursLogged}
              </span>
              <span className="text-sm font-semibold text-zinc-400 ml-1">/ 1,205.0h</span>
              <p className="text-xs text-zinc-400 mt-1 italic">
                Semester 1 Deficit Tracking Active
              </p>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Total Logged Duties:</span>
                <span className="font-semibold text-white font-mono">{duties.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Active Wards Rotated:</span>
                <span className="font-semibold text-cyan-300 font-mono">{wardCategoryDistribution.length} Categories</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Semester 1 Rollover:</span>
                <span className="font-semibold text-teal-300 font-mono">Enabled</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('calendar')}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-white/10 backdrop-blur-sm"
          >
            <span>Log or Schedule Duty</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 4. SEMESTER CLINICAL HOURS TRACKERS (WITH AUTOMATIC DEFICIT ROLLOVER) */}
      <div 
        id="semester-hours-trackers-card"
        className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Clinical Hours Rollover</span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              <span>Semester Clinical Hours Breakdown</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 italic">
              Tracks logged clinical hours against curriculum semester benchmarks with automated deficit rollover.
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-[11px] text-teal-300 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Automatic Deficit Backfill Active</span>
          </div>
        </div>

        {/* 6 Semester Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((sem) => {
            const stats = semesterHoursStats[sem] || { target: 100, rawHours: 0, effectiveHours: 0, percent: 0 };
            const isCompleted = stats.target > 0 && stats.effectiveHours >= stats.target;

            return (
              <div 
                key={sem}
                id={`semester-${sem}-tracker`}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted 
                    ? 'bg-teal-500/10 border-teal-500/30' 
                    : 'bg-white/5 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-white/10 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center border border-white/10">
                      {sem}
                    </span>
                    <span className="text-sm font-semibold text-white">Semester {sem}</span>
                  </div>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Met
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-zinc-300">
                      {stats.effectiveHours} / {stats.target}h
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2 border border-white/5">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.5)]' : 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                    }`}
                    style={{ width: `${Math.min(100, stats.percent)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>{stats.percent}% achieved</span>
                  <span className="font-mono">{stats.target > 0 ? `${stats.target}h Target` : 'Elective'}</span>
                </div>


              </div>
            );
          })}
        </div>
      </div>

      {/* 5. VISUALIZATIONS SECTION: 
          (A) Attendance per Month (Placed physically BEFORE Clinical Hours per Month)
          (B) Dynamic Clinical Hours by Month Bar Chart
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* (A) ATTENDANCE RATE PER MONTH CHART */}
        <div 
          id="monthly-attendance-chart-card"
          className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Attendance Analysis</span>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                <Award className="w-5 h-5 text-cyan-400" />
                <span>Attendance per Month (%)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 italic">
                Evaluates compliance consistency against the 80% threshold month-by-month.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              80% Line
            </span>
          </div>

          {monthlyStats.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-zinc-500">
              No monthly attendance logs recorded yet.
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {monthlyStats.map((item) => {
                const isBelow = item.attendanceRate < 80.0;
                return (
                  <div key={item.monthKey} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-200 font-mono">{item.monthLabel}</span>
                        {isBelow && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                            <AlertTriangle className="w-2.5 h-2.5" /> &lt;80% Warning
                          </span>
                        )}
                      </div>
                      <span className={`font-mono font-bold ${isBelow ? 'text-rose-400' : 'text-cyan-300'}`}>
                        {item.attendanceRate}%
                      </span>
                    </div>

                    <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      {/* 80% Marker Indicator */}
                      <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-amber-400/80 z-10" />
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isBelow 
                            ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' 
                            : 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]'
                        }`}
                        style={{ width: `${Math.min(100, item.attendanceRate)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* (B) DYNAMIC CLINICAL HOURS BY MONTH BAR CHART */}
        <div 
          id="monthly-clinical-hours-chart-card"
          className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Volume Tracking</span>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                <Clock className="w-5 h-5 text-teal-400" />
                <span>Clinical Hours by Month</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 italic">
                Auto-scaling volume. Low-attendance months flagged in orange/red.
              </p>
            </div>
          </div>

          {monthlyStats.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-zinc-500">
              No clinical duties logged yet.
            </div>
          ) : (
            <div className="pt-4">
              {/* Dynamic Bar Graph */}
              <div className="flex items-end justify-between gap-2 h-44 border-b border-white/5 pb-2 px-1">
                {monthlyStats.map((item) => {
                  const heightPercent = maxMonthlyHours > 0 
                    ? Math.max(8, (item.clinicalHours / maxMonthlyHours) * 100) 
                    : 8;
                  const isLowAttendance = item.isLowAttendance;

                  return (
                    <div 
                      key={item.monthKey} 
                      className="flex-1 flex flex-col items-center group relative h-full justify-end"
                      onMouseEnter={() => setHoveredMonth(item.monthKey)}
                      onMouseLeave={() => setHoveredMonth(null)}
                    >
                      {/* Tooltip on hover */}
                      {hoveredMonth === item.monthKey && (
                        <div className="absolute -top-12 z-20 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded-lg shadow-xl border border-white/10 whitespace-nowrap pointer-events-none backdrop-blur-md">
                          <p className="font-bold text-cyan-300">{item.clinicalHours} Hours</p>
                          <p className="text-zinc-400">{item.attendanceRate}% Attendance ({item.totalDuties} duties)</p>
                        </div>
                      )}

                      {/* Warning Icon if low attendance */}
                      {isLowAttendance && (
                        <div className="mb-1 text-rose-400 animate-bounce">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      )}

                      {/* Bar */}
                      <div 
                        className={`w-full max-w-[38px] rounded-t-lg transition-all duration-300 group-hover:opacity-90 ${
                          isLowAttendance
                            ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                            : 'bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.4)]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />

                      <span className="text-[10px] font-mono text-zinc-400 mt-2 truncate max-w-full">
                        {item.monthLabel.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 font-mono">
                <span>0h</span>
                <span>Auto-scaled Max: {maxMonthlyHours}h</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 6. WARD HOURS DISTRIBUTION (CUSTOM WARD CATEGORIES & SPECIFIC 28 WARDS) */}
      <div 
        id="ward-distribution-card"
        className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Ward Rotations</span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <span>Clinical Ward Rotation Exposure</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 italic">
              Transparent distribution of clinical hours across hospital wards and clinical departments.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto backdrop-blur-sm">
            <button
              onClick={() => setWardViewMode('categories')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                wardViewMode === 'categories'
                  ? 'bg-white/10 text-cyan-300 border border-white/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              General Categories
            </button>
            <button
              onClick={() => setWardViewMode('specific')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                wardViewMode === 'specific'
                  ? 'bg-white/10 text-cyan-300 border border-white/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Specific Wards (28 Directory)
            </button>
          </div>
        </div>

        {wardViewMode === 'categories' ? (
          /* General Ward Categories */
          wardCategoryDistribution.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No ward category hours logged yet. Log clinical shifts from the Calendar.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {wardCategoryDistribution.map((item) => (
                <div 
                  key={item.category}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200">{item.category}</span>
                    <span className="font-mono text-cyan-400 font-bold">{item.hours}h ({item.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                      style={{ width: `${Math.min(100, item.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Specific Wards (28 Directory) */
          specificWardDistribution.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No specific ward duties recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
              {specificWardDistribution.map((item) => (
                <div 
                  key={item.ward}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 text-center"
                >
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 font-mono text-xs font-bold border border-white/10">
                    Ward {item.ward}
                  </span>
                  <p className="text-sm font-bold text-white font-mono mt-1.5">{item.hours}h</p>
                  <p className="text-[10px] text-zinc-400">{item.percentage}% share</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>

    </div>
  );
};
