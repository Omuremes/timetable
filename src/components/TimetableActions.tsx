'use client';

import { Download } from 'lucide-react';
import type { Timetable, TimeSlot } from '@/app/page';

interface TimetableActionsProps {
  timetable: Timetable;
  timeSlots: TimeSlot[];
}

export default function TimetableActions({ timetable, timeSlots }: TimetableActionsProps) {
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(timetable, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${timetable.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        onClick={handleExportJSON}
        className="inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        title="Экспорт в JSON"
      >
        <Download className="w-4 h-4 mr-2" />
        <span className="sm:inline">Экспорт</span>
      </button>
    </div>
  );
}
