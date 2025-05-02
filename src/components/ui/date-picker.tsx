
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  selected?: Date
  onSelect: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  allowManualEntry?: boolean
}

export function DatePicker({
  selected,
  onSelect,
  disabled,
  placeholder = "Pick a date",
  className,
  allowManualEntry = false,
}: DatePickerProps) {
  const [inputDate, setInputDate] = React.useState<string>(selected ? format(selected, 'yyyy-MM-dd') : '');
  const [isOpen, setIsOpen] = React.useState(false);

  // Update inputDate when selected date changes externally
  React.useEffect(() => {
    if (selected) {
      setInputDate(format(selected, 'yyyy-MM-dd'));
    } else {
      setInputDate('');
    }
  }, [selected]);

  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputDate(e.target.value);
    
    // Try to parse the input date
    if (e.target.value) {
      try {
        const date = new Date(e.target.value);
        if (!isNaN(date.getTime())) {
          onSelect(date);
        }
      } catch (error) {
        // Invalid date format, do nothing
      }
    } else {
      // Clear the date if input is empty
      onSelect(undefined);
    }
  };

  if (allowManualEntry) {
    return (
      <div className="relative">
        <div className="flex">
          <input
            type="date"
            value={inputDate}
            onChange={handleManualDateChange}
            disabled={disabled}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onSelect(date);
            setIsOpen(false);
          }}
          initialFocus
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  )
}
