"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { cn } from '@/lib/utils';

interface BorderBuddyContext {
  interests: string[];
  regions: string[];
  budget?: string | null;
  style?: string | null;
  constraints: string[];
}

interface ContextFormProps {
  initialContext?: BorderBuddyContext;
  onSubmit: (context: BorderBuddyContext) => Promise<void>;
  onCancel?: () => void;
  className?: string;
  mode?: 'setup' | 'edit';
}

const TRAVEL_STYLES = [
  'Budget-friendly',
  'Luxury',
  'Adventure',
  'Cultural',
  'Relaxation',
  'Family-friendly',
  'Solo travel',
  'Business',
  'Backpacking',
  'Food-focused'
];

const BUDGET_RANGES = [
  'Under $500',
  '$500 - $1,000',
  '$1,000 - $2,500',
  '$2,500 - $5,000',
  '$5,000 - $10,000',
  'Over $10,000'
];

export default function ContextForm({
  initialContext,
  onSubmit,
  onCancel,
  className,
  mode = 'setup'
}: ContextFormProps) {
  const [interests, setInterests] = useState<string>(initialContext?.interests.join(', ') || '');
  const [regions, setRegions] = useState<string>(initialContext?.regions.join(', ') || '');
  const [budget, setBudget] = useState<string>(initialContext?.budget || '');
  const [style, setStyle] = useState<string>(initialContext?.style || '');
  const [constraints, setConstraints] = useState<string>(initialContext?.constraints.join(', ') || '');
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate inputs
    const context: BorderBuddyContext = {
      interests: interests.split(',').map(i => i.trim()).filter(Boolean),
      regions: regions.split(',').map(r => r.trim()).filter(Boolean),
      budget: budget.trim() || null,
      style: style.trim() || null,
      constraints: constraints.split(',').map(c => c.trim()).filter(Boolean),
    };

    try {
      await onSubmit(context);
    } catch (err) {
      setError('Failed to save preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        interests: [],
        regions: [],
        budget: null,
        style: null,
        constraints: [],
      });
    } catch (err) {
      setError('Failed to proceed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel action for edit mode
  const handleCancel = async () => {
    if (mode === 'edit' && onCancel) {
      // Just call onCancel - this will preserve the existing state
      onCancel();
    } else {
      // For setup mode, proceed with empty context
      setIsSubmitting(true);
      try {
        await onSubmit({
          interests: [],
          regions: [],
          budget: null,
          style: null,
          constraints: [],
        });
      } catch (err) {
        setError('Failed to proceed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={cn('card shadow-card p-6', className)}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-1">
              {mode === 'setup' ? 'Tell BorderBuddy About Your Trip' : 'Edit Your Travel Preferences'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === 'setup'
                ? 'Share your preferences to get personalized travel recommendations. You can always update these later.'
                : 'Update your travel preferences to get more tailored recommendations.'
              }
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-3">
          <svg className="w-5 h-5 text-destructive mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-destructive flex-1">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" aria-label="Travel preferences form">
        <div>
          <label htmlFor="interests" className="block text-sm font-medium mb-2">
            What are you interested in? <span className="text-muted-foreground">(comma-separated)</span>
          </label>
          <input
            id="interests"
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., museums, hiking, local food, nightlife, photography"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus:border-primary focus:ring-primary/20 outline-none transition-colors"
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Examples: historical sites, outdoor activities, shopping, art galleries, beaches
          </p>
        </div>

        <div>
          <label htmlFor="regions" className="block text-sm font-medium mb-2">
            Specific regions or cities? <span className="text-muted-foreground">(comma-separated)</span>
          </label>
          <input
            id="regions"
            type="text"
            value={regions}
            onChange={(e) => setRegions(e.target.value)}
            placeholder="e.g., Tokyo, Kyoto, Osaka"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus:border-primary focus:ring-primary/20 outline-none transition-colors"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="style" className="block text-sm font-medium mb-2">What's your travel style?</label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus:border-primary focus:ring-primary/20 outline-none transition-colors"
            disabled={isSubmitting}
          >
            <option value="">Select your style...</option>
            {TRAVEL_STYLES.map((styleOption) => (
              <option key={styleOption} value={styleOption}>
                {styleOption}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium mb-2">What's your budget range?</label>
          <select
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus:border-primary focus:ring-primary/20 outline-none transition-colors"
            disabled={isSubmitting}
          >
            <option value="">Select your budget...</option>
            {BUDGET_RANGES.map((budgetOption) => (
              <option key={budgetOption} value={budgetOption}>
                {budgetOption}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="constraints" className="block text-sm font-medium mb-2">
            Any constraints or restrictions? <span className="text-muted-foreground">(comma-separated)</span>
          </label>
          <input
            id="constraints"
            type="text"
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="e.g., dietary restrictions, mobility limitations, no late nights"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus:border-primary focus:ring-primary/20 outline-none transition-colors"
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Examples: vegetarian, wheelchair accessible, no alcohol, early bedtime
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 min-h-[44px]"
            aria-label={mode === 'setup' ? 'Save preferences' : 'Update preferences'}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                {mode === 'setup' ? 'Saving...' : 'Updating...'}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {mode === 'setup' ? 'Save Preferences' : 'Update Preferences'}
              </div>
            )}
          </Button>
          {mode === 'setup' && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="flex-1 min-h-[44px]"
              aria-label="Skip for now"
            >
              Skip for Now
            </Button>
          )}
          {mode === 'edit' && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 min-h-[44px]"
              aria-label="Cancel"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}