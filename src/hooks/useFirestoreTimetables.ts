'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  onSnapshot,
  serverTimestamp,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Timetable } from '@/app/page';

const COLLECTION_NAME = 'timetables';

export function useFirestoreTimetables() {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Подписка на изменения в реальном времени
  useEffect(() => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const timetablesData: Timetable[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          timetablesData.push({
            id: doc.id,
            name: data.name,
            schedule: data.schedule,
          });
        });
        setTimetables(timetablesData);
        setIsLoaded(true);
        setError(null);
      },
      (error) => {
        console.error('Ошибка при получении расписаний:', error);
        setError('Ошибка при загрузке данных');
        setIsLoaded(true);
      }
    );

    return () => unsubscribe();
  }, []);

  const addTimetable = async (timetable: Omit<Timetable, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        name: timetable.name,
        schedule: timetable.schedule,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return {
        id: docRef.id,
        ...timetable,
      };
    } catch (error) {
      console.error('Ошибка при добавлении расписания:', error);
      setError('Ошибка при создании расписания');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTimetable = async (timetable: Timetable) => {
    setIsLoading(true);
    setError(null);
    try {
      const timetableRef = doc(db, COLLECTION_NAME, timetable.id);
      await updateDoc(timetableRef, {
        name: timetable.name,
        schedule: timetable.schedule,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Ошибка при обновлении расписания:', error);
      setError('Ошибка при обновлении расписания');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTimetable = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Ошибка при удалении расписания:', error);
      setError('Ошибка при удалении расписания');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const importTimetable = async (timetableData: Timetable) => {
    const newTimetable = {
      name: `${timetableData.name} (копия)`,
      schedule: timetableData.schedule,
    };
    return await addTimetable(newTimetable);
  };

  return {
    timetables,
    isLoaded,
    isLoading,
    error,
    addTimetable,
    updateTimetable,
    deleteTimetable,
    importTimetable,
  };
}
