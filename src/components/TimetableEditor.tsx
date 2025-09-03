'use client';

import { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';
import TimetableActions from './TimetableActions';
import type { Timetable, TimeSlot, DaySchedule } from '@/app/page';

interface TimetableEditorProps {
  timetable: Timetable;
  timeSlots: TimeSlot[];
  isEditing: boolean;
  onUpdate: (timetable: Timetable) => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
}

const dayNames = {
  monday: 'Пн',
  tuesday: 'Вт',
  wednesday: 'Ср',
  thursday: 'Чт',
  friday: 'Пт',
  saturday: 'Сб',
  sunday: 'Вс',
};

const dayNamesLong = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье',
};

export default function TimetableEditor({
  timetable,
  timeSlots,
  isEditing,
  onUpdate,
  onStartEdit,
  onStopEdit,
}: TimetableEditorProps) {
  const [editedTimetable, setEditedTimetable] = useState<Timetable>(timetable);

  const handleSave = () => {
    onUpdate(editedTimetable);
    onStopEdit();
  };

  const handleCancel = () => {
    setEditedTimetable(timetable);
    onStopEdit();
  };

  const updateScheduleItem = (
    day: keyof Timetable['schedule'],
    timeSlotId: string,
    value: string
  ) => {
    setEditedTimetable({
      ...editedTimetable,
      schedule: {
        ...editedTimetable.schedule,
        [day]: {
          ...editedTimetable.schedule[day],
          [timeSlotId]: value,
        },
      },
    });
  };

  const updateName = (name: string) => {
    setEditedTimetable({
      ...editedTimetable,
      name,
    });
  };

  const currentTimetable = isEditing ? editedTimetable : timetable;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={currentTimetable.name}
                onChange={(e) => updateName(e.target.value)}
                className="w-full text-lg sm:text-xl font-semibold bg-transparent border-b-2 border-blue-500 outline-none"
                placeholder="Название расписания"
              />
            ) : (
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">
                {currentTimetable.name}
              </h2>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {!isEditing && (
              <TimetableActions timetable={currentTimetable} timeSlots={timeSlots} />
            )}
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </button>
              </>
            ) : (
              <button
                onClick={onStartEdit}
                className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Редактировать
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse timetable-table">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 sm:p-3 bg-gray-50 text-left font-medium text-gray-700 text-sm sm:text-base">
                  Время
                </th>
                {Object.entries(dayNames).map(([key, name]) => (
                  <th
                    key={key}
                    className="border border-gray-300 p-2 sm:p-3 bg-gray-50 text-center font-medium text-gray-700 min-w-[85px] sm:min-w-[120px] text-sm sm:text-base"
                  >
                    <span className="sm:hidden">{name}</span>
                    <span className="hidden sm:inline">{dayNamesLong[key as keyof typeof dayNamesLong]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot.id}>
                  <td
                    className={`border border-gray-300 p-2 sm:p-3 font-medium text-sm sm:text-base ${
                      timeSlot.isBreak
                        ? 'bg-yellow-50 text-yellow-800'
                        : 'bg-white text-gray-700'
                    }`}
                  >
                    <div className="text-xs sm:text-base">
                      <div className="hidden sm:block">
                        {timeSlot.start} - {timeSlot.end}
                      </div>
                      <div className="block sm:hidden text-[9px] leading-tight text-center">
                        <div>{timeSlot.start}</div>
                        <div>-</div>
                        <div>{timeSlot.end}</div>
                      </div>
                    </div>
                    {timeSlot.label && (
                      <div className="text-xs sm:text-sm text-gray-500 mt-1">
                        {timeSlot.label}
                      </div>
                    )}
                  </td>
                  {Object.keys(dayNames).map((day) => (
                    <td
                      key={day}
                      className={`border border-gray-300 p-2 sm:p-3 ${
                        timeSlot.isBreak ? 'bg-yellow-50' : 'bg-white'
                      }`}
                    >
                      {timeSlot.isBreak ? (
                        <div className="text-center text-yellow-600 font-medium text-sm sm:text-base">
                          {timeSlot.label}
                        </div>
                      ) : isEditing ? (
                        <input
                          type="text"
                          value={
                            currentTimetable.schedule[
                              day as keyof Timetable['schedule']
                            ][timeSlot.id] || ''
                          }
                          onChange={(e) =>
                            updateScheduleItem(
                              day as keyof Timetable['schedule'],
                              timeSlot.id,
                              e.target.value
                            )
                          }
                          className="w-full p-2 sm:p-2 text-gray-700 border border-gray-200 rounded focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                          placeholder="Предмет"
                        />
                      ) : (
                        <div className="text-center p-2 sm:p-2 text-sm sm:text-base text-gray-700 break-words">
                          {currentTimetable.schedule[
                            day as keyof Timetable['schedule']
                          ][timeSlot.id] || '-'}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
