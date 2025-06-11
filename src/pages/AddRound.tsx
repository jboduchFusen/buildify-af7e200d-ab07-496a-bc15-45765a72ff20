
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useGolfData } from '@/context/GolfDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const AddRound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPlayerId = location.state?.playerId || '';
  const initialCourseId = location.state?.courseId || '';
  
  const { players, courses, addRound, loading } = useGolfData();
  
  const [formData, setFormData] = useState({
    playerId: initialPlayerId,
    courseId: initialCourseId,
    date: new Date().toISOString().split('T')[0],
    score: '',
    notes: '',
  });

  const [errors, setErrors] = useState({
    playerId: false,
    courseId: false,
    score: false,
  });

  // If there are no players or courses, redirect to the appropriate page
  useEffect(() => {
    if (!loading) {
      if (players.length === 0) {
        navigate('/players', { replace: true });
      } else if (courses.length === 0) {
        navigate('/courses', { replace: true });
      }
    }
  }, [players, courses, navigate, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear error for this field
    if (errors[field as keyof typeof errors]) {
      setErrors({
        ...errors,
        [field]: false,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {
      playerId: !formData.playerId,
      courseId: !formData.courseId,
      score: !formData.score || isNaN(Number(formData.score)) || Number(formData.score) <= 0,
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(Boolean)) {
      return;
    }
    
    // Add the round
    addRound({
      playerId: formData.playerId,
      courseId: formData.courseId,
      date: formData.date,
      score: Number(formData.score),
      notes: formData.notes.trim() || undefined,
    });
    
    // Navigate back to rounds page
    navigate('/rounds');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" asChild className="mr-4">
          <Link to="/rounds">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Round</h1>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Round Details</CardTitle>
            <CardDescription>
              Record a new golf round with player, course, and score information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player">Player</Label>
              <Select 
                value={formData.playerId} 
                onValueChange={(value) => handleChange('playerId', value)}
              >
                <SelectTrigger id="player" className={errors.playerId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a player" />
                </SelectTrigger>
                <SelectContent>
                  {players.map(player => (
                    <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.playerId && (
                <p className="text-sm text-destructive">Please select a player</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select 
                value={formData.courseId} 
                onValueChange={(value) => handleChange('courseId', value)}
              >
                <SelectTrigger id="course" className={errors.courseId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} ({course.tees})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.courseId && (
                <p className="text-sm text-destructive">Please select a course</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date Played</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="score">Total Score</Label>
              <Input
                id="score"
                type="number"
                placeholder="Enter total score"
                value={formData.score}
                onChange={(e) => handleChange('score', e.target.value)}
                className={errors.score ? 'border-destructive' : ''}
              />
              {errors.score && (
                <p className="text-sm text-destructive">Please enter a valid score</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this round..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/rounds')}>
              Cancel
            </Button>
            <Button type="submit">Save Round</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddRound;