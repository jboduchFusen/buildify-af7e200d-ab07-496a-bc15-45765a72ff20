
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGolfData, Course } from '@/context/GolfDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { PlusCircle, MoreHorizontal, Search, Flag } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const Courses = () => {
  const { courses, addCourse, deleteCourse, loading } = useGolfData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    holes: 18,
    par: 72,
    slope: 113,
    rating: 72.0,
    tees: 'White',
    location: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleAddCourse = () => {
    if (newCourse.name.trim()) {
      addCourse({
        name: newCourse.name.trim(),
        holes: Number(newCourse.holes),
        par: Number(newCourse.par),
        slope: Number(newCourse.slope),
        rating: Number(newCourse.rating),
        tees: newCourse.tees.trim(),
        location: newCourse.location.trim() || undefined,
      });
      setNewCourse({
        name: '',
        holes: 18,
        par: 72,
        slope: 113,
        rating: 72.0,
        tees: 'White',
        location: '',
      });
      setIsAddDialogOpen(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.location && course.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Enter the details for the new golf course.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  placeholder="Augusta National"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="holes">Holes</Label>
                  <Input
                    id="holes"
                    type="number"
                    value={newCourse.holes}
                    onChange={(e) => setNewCourse({ ...newCourse, holes: parseInt(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="par">Par</Label>
                  <Input
                    id="par"
                    type="number"
                    value={newCourse.par}
                    onChange={(e) => setNewCourse({ ...newCourse, par: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="slope">Slope Rating</Label>
                  <Input
                    id="slope"
                    type="number"
                    value={newCourse.slope}
                    onChange={(e) => setNewCourse({ ...newCourse, slope: parseInt(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rating">Course Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    value={newCourse.rating}
                    onChange={(e) => setNewCourse({ ...newCourse, rating: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tees">Tees</Label>
                <Input
                  id="tees"
                  value={newCourse.tees}
                  onChange={(e) => setNewCourse({ ...newCourse, tees: e.target.value })}
                  placeholder="White, Blue, Red, etc."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location (optional)</Label>
                <Input
                  id="location"
                  value={newCourse.location}
                  onChange={(e) => setNewCourse({ ...newCourse, location: e.target.value })}
                  placeholder="Augusta, GA"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCourse}>Add Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Flag className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">No courses yet</h2>
          <p className="mb-8 mt-2 text-center text-sm text-muted-foreground max-w-sm">
            You haven't added any golf courses yet. Add your first course to start tracking rounds.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Par</TableHead>
                <TableHead>Rating/Slope</TableHead>
                <TableHead>Tees</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No courses found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <CourseRow 
                    key={course.id} 
                    course={course} 
                    onDelete={deleteCourse} 
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

interface CourseRowProps {
  course: Course;
  onDelete: (id: string) => Promise<void>;
}

const CourseRow = ({ course, onDelete }: CourseRowProps) => {
  const { getCourseRounds } = useGolfData();
  const courseRounds = getCourseRounds(course.id);

  return (
    <TableRow>
      <TableCell>
        <Link to={`/courses/${course.id}`} className="font-medium hover:underline">
          {course.name}
        </Link>
      </TableCell>
      <TableCell>{course.par}</TableCell>
      <TableCell>{course.rating} / {course.slope}</TableCell>
      <TableCell>{course.tees}</TableCell>
      <TableCell>{course.location || '-'}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/courses/${course.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/rounds/add" state={{ courseId: course.id }}>Add round</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => {
                if (courseRounds.length > 0) {
                  if (window.confirm(`This will delete ${course.name} and ${courseRounds.length} associated rounds. Continue?`)) {
                    onDelete(course.id);
                  }
                } else {
                  onDelete(course.id);
                }
              }}
            >
              Delete course
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default Courses;