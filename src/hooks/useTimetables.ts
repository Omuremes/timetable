'use client';

import { useState, useEffect } from 'react';
import type { Timetable } from '@/app/page';

const STORAGE_KEY = 'timetables';

export function useTimetables() {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка данных из localStorage при инициализации
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedTimetables = JSON.parse(saved) as Timetable[];
        setTimetables(parsedTimetables);
      }
    } catch (error) {
      console.error('Ошибка при загрузке расписаний:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Сохранение данных в localStorage при изменении
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(timetables));
      } catch (error) {
        console.error('Ошибка при сохранении расписаний:', error);
      }
    }
  }, [timetables, isLoaded]);

  const addTimetable = (timetable: Timetable) => {
    setTimetables(prev => [...prev, timetable]);
  };

  const updateTimetable = (updatedTimetable: Timetable) => {
    setTimetables(prev =>
      prev.map(t => (t.id === updatedTimetable.id ? updatedTimetable : t))
    );
  };

  const deleteTimetable = (id: string) => {
    setTimetables(prev => prev.filter(t => t.id !== id));
  };

  const importTimetable = (timetableData: Timetable) => {
    // Создаем новый ID для импортированного расписания
    const newTimetable = {
      ...timetableData,
      id: Date.now().toString(),
      name: `${timetableData.name} (копия)`,
    };
    addTimetable(newTimetable);
    return newTimetable;
  };

  return {
    timetables,
    isLoaded,
    addTimetable,
    updateTimetable,
    deleteTimetable,
    importTimetable,
  };
}
