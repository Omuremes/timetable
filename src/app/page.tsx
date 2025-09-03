'use client';

import { useState } from 'react';
import TimetableEditor from '@/components/TimetableEditor';
import TimetableList from '@/components/TimetableList';
import ImportTimetable from '@/components/ImportTimetable';
import LoadingState from '@/components/LoadingState';
import ConnectionStatus from '@/components/ConnectionStatus';
import NotificationContainer from '@/components/NotificationContainer';
import { useFirestoreTimetables } from '@/hooks/useFirestoreTimetables';
import { useNotifications } from '@/hooks/useNotifications';
import { Plus, Menu, ArrowLeft } from 'lucide-react';

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  isBreak?: boolean;
  label?: string;
}

export interface DaySchedule {
  [timeSlotId: string]: string; // предмет или активность
}

export interface Timetable {
  id: string;
  name: string;
  schedule: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  };
}

const defaultTimeSlots: TimeSlot[] = [
  { id: '1', start: '08:30', end: '09:50' },
  { id: '2', start: '10:00', end: '11:20' },
  { id: '3', start: '11:30', end: '12:50' },
  { id: '4', start: '12:50', end: '13:30', isBreak: true, label: 'Обед' },
  { id: '5', start: '13:30', end: '14:50' },
  { id: '6', start: '15:00', end: '16:20' },
  { id: '7', start: '16:30', end: '17:50' },
];

export default function Home() {
  const {
    timetables,
    isLoaded,
    isLoading,
    error,
    addTimetable,
    updateTimetable,
    deleteTimetable,
    importTimetable,
  } = useFirestoreTimetables();
  
  const {
    notifications,
    removeNotification,
    showSuccess,
    showError,
  } = useNotifications();
  
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);

  const createNewTimetable = async () => {
    const newTimetableData = {
      name: `Расписание ${timetables.length + 1}`,
      schedule: {
        monday: {},
        tuesday: {},
        wednesday: {},
        thursday: {},
        friday: {},
        saturday: {},
        sunday: {},
      },
    };
    
    try {
      const newTimetable = await addTimetable(newTimetableData);
      setSelectedTimetable(newTimetable);
      setIsEditing(true);
      showSuccess('Расписание создано', 'Новое расписание успешно создано');
    } catch (error) {
      console.error('Ошибка при создании расписания:', error);
      showError('Ошибка создания', 'Не удалось создать новое расписание');
    }
  };

  const handleUpdateTimetable = async (updatedTimetable: Timetable) => {
    try {
      await updateTimetable(updatedTimetable);
      setSelectedTimetable(updatedTimetable);
      showSuccess('Расписание сохранено', 'Изменения успешно сохранены');
    } catch (error) {
      console.error('Ошибка при обновлении расписания:', error);
      showError('Ошибка сохранения', 'Не удалось сохранить изменения');
    }
  };

  const handleDeleteTimetable = async (id: string) => {
    try {
      await deleteTimetable(id);
      if (selectedTimetable?.id === id) {
        setSelectedTimetable(null);
        setIsEditing(false);
      }
      showSuccess('Расписание удалено', 'Расписание успешно удалено');
    } catch (error) {
      console.error('Ошибка при удалении расписания:', error);
      showError('Ошибка удаления', 'Не удалось удалить расписание');
    }
  };

  const handleImportTimetable = async (timetable: Timetable) => {
    try {
      const newTimetable = await importTimetable(timetable);
      setSelectedTimetable(newTimetable);
      setIsEditing(false);
      showSuccess('Расписание импортировано', 'Расписание успешно добавлено');
    } catch (error) {
      console.error('Ошибка при импорте расписания:', error);
      showError('Ошибка импорта', 'Не удалось импортировать расписание');
    }
  };

  return (
    <LoadingState isLoading={!isLoaded} error={error}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          {/* Мобильная шапка */}
          <div className="lg:hidden mb-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">
                Расписания
              </h1>
              <button
                onClick={() => setShowMobileList(!showMobileList)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
            
            {/* Кнопки действий для мобильного */}
            <div className="flex flex-col gap-2 mb-4">
              <button
                onClick={createNewTimetable}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5 mr-2" />
                Создать новое расписание
              </button>
              <ImportTimetable onImport={handleImportTimetable} />
            </div>
          </div>

          {/* Десктопная шапка */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Управление расписаниями
            </h1>
            <div className="flex gap-4">
              <button
                onClick={createNewTimetable}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5 mr-2" />
                Создать новое расписание
              </button>
              <ImportTimetable onImport={handleImportTimetable} />
            </div>
          </div>

          {/* Мобильное модальное окно со списком расписаний */}
          {showMobileList && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
              <div className="bg-white h-full max-w-sm w-full">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Расписания</h2>
                    <button
                      onClick={() => setShowMobileList(false)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto h-full pb-20">
                  <TimetableList
                    timetables={timetables}
                    selectedTimetable={selectedTimetable}
                    onSelect={(timetable: Timetable) => {
                      setSelectedTimetable(timetable);
                      setIsEditing(false);
                      setShowMobileList(false);
                    }}
                    onEdit={(timetable: Timetable) => {
                      setSelectedTimetable(timetable);
                      setIsEditing(true);
                      setShowMobileList(false);
                    }}
                    onDelete={handleDeleteTimetable}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Основной контент */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Десктопный список расписаний */}
            <div className="hidden lg:block lg:col-span-1">
              <TimetableList
                timetables={timetables}
                selectedTimetable={selectedTimetable}
                onSelect={(timetable: Timetable) => {
                  setSelectedTimetable(timetable);
                  setIsEditing(false);
                }}
                onEdit={(timetable: Timetable) => {
                  setSelectedTimetable(timetable);
                  setIsEditing(true);
                }}
                onDelete={handleDeleteTimetable}
              />
            </div>

            {/* Редактор расписания */}
            <div className="lg:col-span-3">
              {selectedTimetable && (
                <TimetableEditor
                  timetable={selectedTimetable}
                  timeSlots={defaultTimeSlots}
                  isEditing={isEditing}
                  onUpdate={handleUpdateTimetable}
                  onStartEdit={() => setIsEditing(true)}
                  onStopEdit={() => setIsEditing(false)}
                />
              )}
              {!selectedTimetable && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    Выберите расписание
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {timetables.length === 0 
                      ? 'Создайте ваше первое расписание' 
                      : 'Выберите расписание из списка или создайте новое'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <ConnectionStatus />
        <NotificationContainer 
          notifications={notifications} 
          onClose={removeNotification} 
        />
      </div>
    </LoadingState>
  );
}
