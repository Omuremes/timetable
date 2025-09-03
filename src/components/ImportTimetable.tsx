'use client';

import { useRef } from 'react';
import { Upload } from 'lucide-react';
import type { Timetable } from '@/app/page';

interface ImportTimetableProps {
  onImport: (timetable: Timetable) => void;
}

export default function ImportTimetable({ onImport }: ImportTimetableProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const timetable = JSON.parse(content) as Timetable;
        
        // Простая валидация структуры
        if (
          timetable &&
          typeof timetable.name === 'string' &&
          timetable.schedule &&
          typeof timetable.schedule === 'object'
        ) {
          onImport(timetable);
        } else {
          alert('Неверный формат файла. Пожалуйста, выберите корректный файл расписания.');
        }
      } catch (error) {
        alert('Ошибка при чтении файла. Убедитесь, что файл имеет правильный формат.');
      }
    };
    reader.readAsText(file);
    
    // Сброс значения input для возможности повторного выбора того же файла
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <button
        onClick={handleClick}
        className="w-full lg:w-auto inline-flex items-center justify-center px-4 py-2 lg:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Upload className="w-5 h-5 mr-2" />
        Импорт расписания
      </button>
    </>
  );
}
