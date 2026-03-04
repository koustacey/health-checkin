import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Droplets, 
  Scale, 
  Activity,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CheckinType = 'gut' | 'period' | 'weight' | 'sport';

interface CheckinRecord {
  id: string;
  date: string;
  type: CheckinType;
  weightValue?: number;
  exerciseType?: string;
  exerciseDuration?: string;
}

const CHECKIN_COLORS: Record<CheckinType, string> = {
  gut: 'bg-[hsl(142,76%,36%)]',
  period: 'bg-[hsl(340,82%,52%)]',
  weight: 'bg-[hsl(217,91%,60%)]',
  sport: 'bg-[hsl(28,85%,54%)]',
};

const CHECKIN_LABELS: Record<CheckinType, string> = {
  gut: '上厕所',
  period: '大姨妈',
  weight: '体重',
  sport: '运动',
};

export function CheckinPage() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [records, setRecords] = useState<CheckinRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<CheckinType | null>(null);
  const [weightValue, setWeightValue] = useState('');
  const [exerciseType, setExerciseType] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState('');

  // Load records from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('health-checkin-records');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  // Save records to localStorage
  useEffect(() => {
    localStorage.setItem('health-checkin-records', JSON.stringify(records));
  }, [records]);

  const getDaysInMonth = () => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = currentMonth.daysInMonth();
    
    const days: (number | null)[] = [];
    
    // Empty slots for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const getRecordsForDate = (day: number): CheckinRecord[] => {
    const dateStr = currentMonth.date(day).format('YYYY-MM-DD');
    return records.filter(r => r.date === dateStr);
  };

  const handleQuickCheckin = (type: CheckinType) => {
    const today = dayjs().format('YYYY-MM-DD');
    
    if (type === 'weight' || type === 'sport') {
      setSelectedDate(today);
      setDialogType(type);
      setDialogOpen(true);
      return;
    }
    
    // Simple checkin for gut and period
    const existing = records.find(r => r.date === today && r.type === type);
    if (existing) {
      // Remove if already exists (toggle)
      setRecords(records.filter(r => r.id !== existing.id));
    } else {
      const newRecord: CheckinRecord = {
        id: Date.now().toString(),
        date: today,
        type,
      };
      setRecords([...records, newRecord]);
    }
  };

  const handleDetailedCheckin = () => {
    if (!selectedDate || !dialogType) return;
    
    const newRecord: CheckinRecord = {
      id: Date.now().toString(),
      date: selectedDate,
      type: dialogType,
      weightValue: dialogType === 'weight' ? parseFloat(weightValue) : undefined,
      exerciseType: dialogType === 'sport' ? exerciseType : undefined,
      exerciseDuration: dialogType === 'sport' ? exerciseDuration : undefined,
    };
    
    setRecords([...records, newRecord]);
    setDialogOpen(false);
    setWeightValue('');
    setExerciseType('');
    setExerciseDuration('');
  };

  const deleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentMonth(currentMonth.subtract(1, 'month'));
    } else {
      setCurrentMonth(currentMonth.add(1, 'month'));
    }
  };

  const days = getDaysInMonth();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-accent rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">
          {currentMonth.format('YYYY年M月')}
        </h1>
        <button 
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-accent rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-4 mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-20" />;
            }
            
            const dateRecords = getRecordsForDate(day);
            const isToday = dayjs().format('YYYY-MM-DD') === currentMonth.date(day).format('YYYY-MM-DD');
            
            return (
              <motion.div
                key={day}
                className={`h-20 p-1 rounded-lg border ${
                  isToday ? 'bg-accent border-primary' : 'border-transparent hover:border-border'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-sm font-medium text-center mb-1">{day}</div>
                <div className="flex flex-col gap-0.5">
                  <AnimatePresence>
                    {dateRecords.map((record) => (
                      <motion.div
                        key={record.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={`h-1.5 rounded-full ${CHECKIN_COLORS[record.type]}`}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleQuickCheckin('gut')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-[hsl(142,76%,95%)] hover:bg-[hsl(142,76%,90%)] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[hsl(142,76%,36%)] flex items-center justify-center">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium text-foreground">上厕所</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleQuickCheckin('period')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-[hsl(340,82%,95%)] hover:bg-[hsl(340,82%,90%)] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[hsl(340,82%,52%)] flex items-center justify-center">
            <span className="text-white text-lg">🌸</span>
          </div>
          <span className="font-medium text-foreground">大姨妈</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleQuickCheckin('weight')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-[hsl(217,91%,95%)] hover:bg-[hsl(217,91%,90%)] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[hsl(217,91%,60%)] flex items-center justify-center">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium text-foreground">体重</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleQuickCheckin('sport')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-[hsl(28,85%,95%)] hover:bg-[hsl(28,85%,90%)] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[hsl(28,85%,54%)] flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium text-foreground">运动</span>
        </motion.button>
      </div>

      {/* Recent Records */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-4">
        <h2 className="text-lg font-semibold mb-4">今日记录</h2>
        <div className="space-y-2">
          {records
            .filter(r => r.date === dayjs().format('YYYY-MM-DD'))
            .map(record => (
              <div 
                key={record.id}
                className="flex items-center justify-between p-3 rounded-xl bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${CHECKIN_COLORS[record.type]}`} />
                  <span className="font-medium">{CHECKIN_LABELS[record.type]}</span>
                  {record.weightValue && (
                    <span className="text-sm text-muted-foreground">{record.weightValue} kg</span>
                  )}
                  {record.exerciseType && (
                    <span className="text-sm text-muted-foreground">
                      {record.exerciseType} {record.exerciseDuration}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => deleteRecord(record.id)}
                  className="p-2 hover:bg-destructive/10 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          {records.filter(r => r.date === dayjs().format('YYYY-MM-DD')).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              今天还没有记录哦，快去打卡吧！
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'weight' ? '记录体重' : '记录运动'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {dialogType === 'weight' && (
              <div className="space-y-2">
                <Label>体重 (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="例如：55.5"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                />
              </div>
            )}
            {dialogType === 'sport' && (
              <>
                <div className="space-y-2">
                  <Label>运动类型</Label>
                  <Select value={exerciseType} onValueChange={setExerciseType}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择运动类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="跑步">跑步</SelectItem>
                      <SelectItem value="瑜伽">瑜伽</SelectItem>
                      <SelectItem value="游泳">游泳</SelectItem>
                      <SelectItem value="健身">健身</SelectItem>
                      <SelectItem value="骑行">骑行</SelectItem>
                      <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>运动时长</Label>
                  <Select value={exerciseDuration} onValueChange={setExerciseDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择时长" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15分钟">15分钟</SelectItem>
                      <SelectItem value="30分钟">30分钟</SelectItem>
                      <SelectItem value="45分钟">45分钟</SelectItem>
                      <SelectItem value="1小时">1小时</SelectItem>
                      <SelectItem value="1.5小时">1.5小时</SelectItem>
                      <SelectItem value="2小时+">2小时+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <Button 
              className="w-full" 
              onClick={handleDetailedCheckin}
              disabled={dialogType === 'weight' ? !weightValue : !exerciseType}
            >
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
