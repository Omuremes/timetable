'use client';

import { Edit, Trash2, Calendar } from 'lucide-react';
import type { Timetable } from '@/app/page';

interface TimetableListProps {
  timetables: Timetable[];
  selectedTimetable: Timetable | null;
  onSelect: (timetable: Timetable) => void;
  onEdit: (timetable: Timetable) => void;
  onDelete: (id: string) => void;
}

export default function TimetableList({
  timetables,
  selectedTimetable,
  onSelect,
  onEdit,
  onDelete,
}: TimetableListProps) {
  if (timetables.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            Нет расписаний
          </h3>
          <p className="text-gray-400 text-sm">
            Создайте ваше первое расписание
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Расписания</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {timetables.map((timetable) => (
          <div
            key={timetable.id}
            className={`p-4 cursor-pointer transition-colors ${
              selectedTimetable?.id === timetable.id
                ? 'bg-blue-50 border-r-4 border-blue-500'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelect(timetable)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {timetable.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Расписание на неделю
                </p>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(timetable);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Редактировать"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Удалить это расписание?')) {
                      onDelete(timetable.id);
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
