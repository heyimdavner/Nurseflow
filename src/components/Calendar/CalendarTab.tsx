import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  UploadCloud, 
  Filter, 
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Building2,
  BookOpen,
  Info
} from 'lucide-react';
import { useNurseFlow } from '../../context/NurseFlowContext';
import { Duty } from '../../types';
import { DutyModal } from './DutyModal';

export const CalendarTab: React.FC = () => {
  const { 
    duties, 
    user, 
    dutyFilter, 
    setDutyFilter,
    shifts 
  } = useNurseFlow();

  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [selectedDateForModal, setSelectedDateForModal] = useState<string | null>(null);
  const [isDutyModalOpen, setIsDutyModalOpen] = useState(false);

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 to 11

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Build month grid days
  const { calendarGridDays, monthLabel } = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = lastDayOfMonth.getDate();

    // Previous month filler days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const days: Array<{
      dateString: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }> = [];

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const pDay = prevMonthLastDay - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      const pDateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(pDay).padStart(2, '0')}`;
      days.push({
        dateString: pDateStr,
        dayNumber: pDay,
        isCurrentMonth: false,
        isToday: pDateStr === todayStr
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const curDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateString: curDateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: curDateStr === todayStr
      });
    }

    // Next month filler days to complete grid (multiples of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      const nDateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
      days.push({
        dateString: nDateStr,
        dayNumber: n,
        isCurrentMonth: false,
        isToday: nDateStr === todayStr
      });
    }

    const monthLabel = firstDayOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    return { calendarGridDays: days, monthLabel };
  }, [year, month]);

  // Map duties by dateString and apply filter
  const dutiesByDate = useMemo(() => {
    const map = new Map<string, Duty>();
    duties.forEach(d => {
      if (dutyFilter === 'Clinical Duties Only' && d.type !== 'Clinical Shift') return;
      if (dutyFilter === 'Academic Lectures Only' && d.type !== 'Academic Lecture') return;
      map.set(d.date, d);
    });
    return map;
  }, [duties, dutyFilter]);

  // Click on a day cell opens modal for that exact date
  const handleDateClick = (dateStr: string) => {
    setSelectedDateForModal(dateStr);
    setIsDutyModalOpen(true);
  };

  const selectedDuty = selectedDateForModal ? duties.find(d => d.date === selectedDateForModal) : undefined;

  // Status color pill helper
  const getStatusBadge = (status: Duty['status']) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
      case 'Half Day':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/60';
      case 'Absent':
        return 'bg-rose-950/80 text-rose-300 border-rose-700/60';
      case 'Special Holiday':
      case 'Medical':
        return 'bg-purple-950/80 text-purple-300 border-purple-700/60';
      case 'Day Off':
      case 'Public Holiday':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'Pending':
      default:
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60 animate-pulse';
    }
  };

  return (
    <div id="calendar-tab-container" className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. TOP CONTROLS & FILTER BAR */}
      <div 
        id="calendar-header-toolbar"
        className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 backdrop-blur-sm shadow-xl"
      >
        {/* Month Title & Nav Buttons */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-1.5">
            <button
              id="calendar-prev-month-btn"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors border border-white/5"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="calendar-next-month-btn"
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors border border-white/5"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight font-mono">
            {monthLabel}
          </h2>

          <button
            id="calendar-today-btn"
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-cyan-300 border border-white/10 transition-colors"
          >
            Today
          </button>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Quick-Toggle Filter */}
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            {(['All', 'Clinical Duties Only', 'Academic Lectures Only'] as const).map((filterOpt) => (
              <button
                key={filterOpt}
                id={`filter-btn-${filterOpt.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setDutyFilter(filterOpt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  dutyFilter === filterOpt
                    ? 'bg-white/15 text-cyan-300 border border-white/10 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {filterOpt === 'Clinical Duties Only' ? 'Clinical Shifts' : filterOpt === 'Academic Lectures Only' ? 'Lectures' : 'All Duties'}
              </button>
            ))}
          </div>

          {/* Add Duty Button */}
          <button
            id="calendar-add-duty-btn"
            onClick={() => handleDateClick(new Date().toISOString().split('T')[0])}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all shadow-md border border-white/20 backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Log Today</span>
          </button>
        </div>
      </div>

      {/* 2. MONTHLY CALENDAR GRID */}
      <div 
        id="monthly-calendar-grid-card"
        className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-5 backdrop-blur-sm shadow-xl overflow-hidden"
      >
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold uppercase tracking-wider text-zinc-400 pb-3 border-b border-white/5">
          <span className="text-rose-400">Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span className="text-teal-400">Sat</span>
        </div>

        {/* Days Grid - EXACT CORNER DATE PLACEMENT TO PREVENT ANY SIZING/OVERLAP BUGS */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2">
          {calendarGridDays.map((cell) => {
            const duty = dutiesByDate.get(cell.dateString);
            const isClinical = duty?.type === 'Clinical Shift';
            const isAcademic = duty?.type === 'Academic Lecture';

            return (
              <div
                key={cell.dateString}
                id={`calendar-day-${cell.dateString}`}
                onClick={() => handleDateClick(cell.dateString)}
                className={`min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border transition-all duration-150 flex flex-col justify-between cursor-pointer group relative ${
                  cell.isCurrentMonth
                    ? 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                    : 'bg-white/[0.02] border-transparent opacity-30 hover:opacity-60'
                } ${
                  cell.isToday ? 'ring-2 ring-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.3)]' : ''
                }`}
              >
                {/* Clean Corner Date Header */}
                <div className="flex items-center justify-between w-full">
                  <span 
                    className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      cell.isToday
                        ? 'bg-cyan-500 text-zinc-950 font-black'
                        : cell.isCurrentMonth
                          ? 'text-zinc-300 group-hover:text-cyan-300'
                          : 'text-zinc-500'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {/* Add icon on hover if empty */}
                  {!duty && (
                    <span className="opacity-0 group-hover:opacity-100 text-cyan-400/60 p-0.5 transition-opacity">
                      <Plus className="w-3 h-3" />
                    </span>
                  )}

                  {/* Duty status indicator dot */}
                  {duty && (
                    <span className={`w-2 h-2 rounded-full ${
                      duty.status === 'Present' ? 'bg-emerald-400' :
                      duty.status === 'Half Day' ? 'bg-amber-400' :
                      duty.status === 'Absent' ? 'bg-rose-400' :
                      duty.status === 'Pending' ? 'bg-cyan-400 animate-pulse' :
                      'bg-purple-400'
                    }`} />
                  )}
                </div>

                {/* Duty Card Content inside Day Cell */}
                {duty ? (
                  <div className="mt-1 space-y-1 overflow-hidden">
                    {/* Shift / Type Badge */}
                    <div className="flex items-center gap-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border truncate ${getStatusBadge(duty.status)}`}>
                        {isAcademic ? 'LEC' : duty.shiftCode}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium truncate hidden sm:inline">
                        {duty.status}
                      </span>
                    </div>

                    {/* Ward or Topic Details */}
                    {isClinical && (duty.specificWard || duty.wardCategory) && (
                      <div className="text-[10px] text-cyan-300/90 font-medium truncate flex items-center gap-0.5">
                        <Building2 className="w-2.5 h-2.5 flex-shrink-0 text-cyan-400" />
                        <span className="truncate">W:{duty.specificWard || duty.wardCategory}</span>
                      </div>
                    )}

                    {isAcademic && duty.lectureTopic && (
                      <div className="text-[10px] text-teal-300 font-medium truncate flex items-center gap-0.5">
                        <BookOpen className="w-2.5 h-2.5 flex-shrink-0 text-teal-400" />
                        <span className="truncate">{duty.lectureTopic}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1" />
                )}

                {/* Bottom subtle indicator */}
                <div className="text-[9px] text-zinc-400 font-mono self-end">
                  {cell.isToday && <span className="text-cyan-400 font-bold">TODAY</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-white/5 text-xs text-zinc-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" /> Present (100%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]" /> Half Day (50%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.5)]" /> Absent (0%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.5)]" /> Medical / Holiday
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)]" /> Pending Review
            </span>
          </div>

          <div className="text-[11px] text-zinc-400 flex items-center gap-1 italic">
            <Info className="w-3 h-3 text-cyan-400" />
            <span>Click any day to log, modify, or delete duties</span>
          </div>
        </div>

      </div>

      {/* Duty Modal Sheet */}
      {isDutyModalOpen && selectedDateForModal && (
        <DutyModal
          isOpen={isDutyModalOpen}
          onClose={() => {
            setIsDutyModalOpen(false);
            setSelectedDateForModal(null);
          }}
          selectedDate={selectedDateForModal}
          existingDuty={selectedDuty}
        />
      )}

    </div>
  );
};
