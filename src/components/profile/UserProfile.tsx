
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, UserPreferences } from '@/types';
import { saveUserPreferences } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const subjectOptions = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Literature',
  'Computer Science',
  'Economics',
  'Psychology',
  'Languages',
];

const learningStyleOptions = [
  { value: 'visual', label: 'Visual' },
  { value: 'auditory', label: 'Auditory' },
  { value: 'reading', label: 'Reading/Writing' },
  { value: 'kinesthetic', label: 'Kinesthetic' },
];

const difficultyOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const profileSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  learningStyle: z.enum(['visual', 'auditory', 'reading', 'kinesthetic']),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  subjects: z.array(z.string()).min(1, {
    message: 'Please select at least one subject.',
  }),
});

export function UserProfile() {
  const { toast } = useToast();
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'Student',
    preferences: {
      subjects: ['Mathematics'],
      learningStyle: 'visual',
      difficultyLevel: 'intermediate',
    },
  });

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      learningStyle: user.preferences?.learningStyle || 'visual',
      difficultyLevel: user.preferences?.difficultyLevel || 'intermediate',
      subjects: user.preferences?.subjects || ['Mathematics'],
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    // Update user state
    const updatedUser = {
      ...user,
      name: values.name,
      preferences: {
        subjects: values.subjects,
        learningStyle: values.learningStyle,
        difficultyLevel: values.difficultyLevel,
      },
    };
    
    setUser(updatedUser);
    
    // Save to API (would connect to backend in production)
    const response = await saveUserPreferences(user.id || '1', updatedUser.preferences);
    
    if (response.success) {
      toast({
        title: "Profile updated",
        description: "Your learning preferences have been saved.",
      });
    } else {
      toast({
        title: "Update failed",
        description: response.error || "Something went wrong.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Learning Profile</CardTitle>
        <CardDescription>
          Customize how the AI tutor adapts to your learning style
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how the AI tutor will address you
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="learningStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Learning Style</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select learning style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {learningStyleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How you best absorb and process information
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="difficultyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {difficultyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The complexity level for explanations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Subjects of Interest</FormLabel>
              <div className="flex flex-wrap gap-2">
                {subjectOptions.map((subject) => {
                  const isSelected = form.watch('subjects')?.includes(subject);
                  return (
                    <Button
                      key={subject}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const currentSubjects = form.getValues('subjects') || [];
                        if (isSelected) {
                          form.setValue(
                            'subjects',
                            currentSubjects.filter((s) => s !== subject)
                          );
                        } else {
                          form.setValue('subjects', [...currentSubjects, subject]);
                        }
                      }}
                    >
                      {subject}
                    </Button>
                  );
                })}
              </div>
              {form.formState.errors.subjects && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.subjects.message}
                </p>
              )}
            </div>
            
            <Button type="submit" className="w-full">
              Save Preferences
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default UserProfile;
