"use client";

import { Calendar, MapPin, Type } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { useEffect } from "react";
import { z } from "zod";
import { tripSchema } from "@/lib/validation";

interface AddTripFormProps {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  errors: { [k: string]: string | undefined };
  onChange: {
    setTitle: (v: string) => void;
    setDestination: (v: string) => void;
    setStartDate: (v: string) => void;
    setEndDate: (v: string) => void;
    setErrors: (errors: { [k: string]: string | undefined }) => void;
  };
  onFieldBlur: (field: string) => void;
  touched: { [k: string]: boolean };
}

export default function AddTripForm({
  title,
  destination,
  startDate,
  endDate,
  errors,
  onChange,
  onFieldBlur,
  touched,
}: AddTripFormProps) {
  // Update min/max dates when start/end dates change
  useEffect(() => {
    if (startDate && (!endDate || new Date(endDate) < new Date(startDate))) {
      onChange.setEndDate('');
    }
  }, [startDate, endDate, onChange.setEndDate]);

  // Only show errors for touched fields
  const getError = (field: string) => {
    return touched[field] ? errors[field] : undefined;
  };

  // Validate field on blur
  const handleBlur = (field: string) => {
    onFieldBlur(field);
    
    // Only validate if the field is touched and has a value
    if (touched[field] && (field === 'title' ? title : field === 'destination' ? destination : field === 'startDate' ? startDate : endDate)) {
      const result = tripSchema.safeParse({
        title,
        destination,
        startDate,
        endDate,
        [field]: field === 'title' ? title : 
                field === 'destination' ? destination : 
                field === 'startDate' ? startDate : endDate
      });

      if (!result.success) {
        const fieldErrors: { [k: string]: string } = {};
        for (const issue of result.error.issues) {
          const path = issue.path[0] as string;
          if (path === field) {
            fieldErrors[field] = issue.message;
          }
        }
        onChange.setErrors({ ...errors, ...fieldErrors });
      } else if (errors[field]) {
        // Clear error if validation passes
        const { [field]: _, ...rest } = errors;
        onChange.setErrors(rest);
      }
    }
  };

  return (
    <div className="p-5 space-y-4">
      <FormField
        label="Title"
        icon={<Type className="size-4" />}
        value={title}
        onChange={onChange.setTitle}
        onBlur={() => handleBlur('title')}
        placeholder="e.g., Tokyo Business Trip"
        error={getError('title')}
      />
      <FormField
        label="Destination"
        icon={<MapPin className="size-4" />}
        value={destination}
        onChange={onChange.setDestination}
        onBlur={() => handleBlur('destination')}
        placeholder="City, Country"
        error={getError('destination')}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Start Date"
          icon={<Calendar className="size-4" />}
          type="date"
          value={startDate}
          onChange={(value) => {
            onChange.setStartDate(value);
            if (endDate && new Date(value) > new Date(endDate)) {
              onChange.setEndDate('');
            }
          }}
          onBlur={() => onFieldBlur('startDate')}
          min={new Date().toISOString().split('T')[0]}
          error={getError('startDate')}
        />
        <FormField
          label="End Date"
          icon={<Calendar className="size-4" />}
          type="date"
          value={endDate}
          onChange={onChange.setEndDate}
          onBlur={() => onFieldBlur('endDate')}
          min={startDate || new Date().toISOString().split('T')[0]}
          error={getError('endDate')}
        />
      </div>
    </div>
  );
}
