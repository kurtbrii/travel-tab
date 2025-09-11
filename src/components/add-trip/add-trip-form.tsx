"use client";

import { Calendar, MapPin, ClipboardList } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { useEffect } from "react";
import { z } from "zod";
import { tripSchema } from "@/lib/validation";
import { toCountryName } from "@/lib/iso-countries";

interface AddTripFormProps {
  purpose: string;
  destinationCountry: string;
  startDate: string;
  endDate: string;
  errors: { [k: string]: string | undefined };
  onChange: {
    setPurpose: (v: string) => void;
    setDestinationCountry: (v: string) => void;
    setStartDate: (v: string) => void;
    setEndDate: (v: string) => void;
    setErrors: (errors: { [k: string]: string | undefined }) => void;
  };
  onFieldBlur: (field: string) => void;
  touched: { [k: string]: boolean };
}

export default function AddTripForm({
  purpose,
  destinationCountry,
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
    if (touched[field] && (field === 'purpose' ? purpose : field === 'destinationCountry' ? destinationCountry : field === 'startDate' ? startDate : endDate)) {
      const result = tripSchema.safeParse({
        purpose,
        destinationCountry,
        startDate,
        endDate,
        [field]: field === 'purpose' ? purpose : 
                field === 'destinationCountry' ? destinationCountry : 
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
        label="Purpose"
        icon={<ClipboardList className="size-4" />}
        value={purpose}
        onChange={onChange.setPurpose}
        onBlur={() => handleBlur('purpose')}
        placeholder="e.g., Business meeting, Tourism"
        error={getError('purpose')}
      />
      <FormField
        label="Destination Country (ISO code)"
        icon={<MapPin className="size-4" />}
        value={destinationCountry}
        onChange={(v) => onChange.setDestinationCountry(v.toUpperCase())}
        onBlur={() => handleBlur('destinationCountry')}
        placeholder="e.g., US, CA, GB, JP"
        error={getError('destinationCountry')}
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
