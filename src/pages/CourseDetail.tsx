
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGolfData } from '@/context/GolfDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getCourseById, 
    getCourseRounds, 
    getPlayerById, 
    updateCourse, 
    deleteCourse,
    deleteRound,
    loading
  } = useGolfData();

  if (loading) {
    return <LoadingSpinner />;
  }

  const course = getCourseById(id || '');
  
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been deleted.</p>
        <Button asChild>
          <Link to="/courses">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
      </div>
    );
  }

  const courseRounds = getCourseRounds(course.id).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedCourse, setEditedCourse] = useState({
    name: course.name,
    holes: course.holes,
    par: course.par,
    slope: course.slope,
    rating: course.rating,
    tees: course.tees,
    location: course.location || '',
  });

  const handleUpdateCourse = () => {
    if (editedCourse.name.trim()) {
      updateCourse(course.id, {
        name: editedCourse.name.trim(),
        holes: Number(editedCourse.holes),
        par: Number(editedCourse.par),
        slope: Number(editedCourse.slope),
        rating: Number(editedCourse.rating),
        tees: editedCourse.tees.trim(),
        location: editedCourse.location.trim() || undefined,
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteCourse = () => {
    deleteCourse(course.id);
    navigate('/courses');
  };

  // Calculate average score on this course
  const calculateAverageScore = () => {
    if (courseRounds.length === 0) return 'N/A';
    const totalScore = courseRounds.reduce((sum, round) => sum + round.score, 0);
    return (totalScore / courseRounds.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="outline" size="sm" asChild className="mr-4">
          <Link to="/courses">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>View and manage course information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p>{course.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <p>{course.location || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Holes</h3>
                  <p>{course.holes}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Par</h3>
                  <p>{course.par}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Course Rating</h3>
                  <p>{course.rating}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Slope Rating</h3>
                  <p>{course.slope}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tees</h3>
                  <p>{course.tees}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Average Score</h3>
                  <p>{calculateAverageScore()}</p>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Course</DialogTitle>
                      <DialogDescription>
                        Update course information.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-name">Course Name</Label>
                        <Input
                          id="edit-name"
                          value={editedCourse.name}
                          onChange={(e) => setEditedCourse({ ...editedCourse, name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-holes">Holes</Label>
                          <Input
                            id="edit-holes"
                            type="number"
                            value={editedCourse.holes}
                            onChange={(e) => setEditedCourse({ ...editedCourse, holes: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-par">Par</Label>
                          <Input
                            id="edit-par"
                            type="number"
                            value={editedCourse.par}
                            onChange={(e) => setEditedCourse({ ...editedCourse, par: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-slope">Slope Rating</Label>
                          <Input
                            id="edit-slope"
                            type="number"
                            value={editedCourse.slope}
                            onChange={(e) => setEditedCourse({ ...editedCourse, slope: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-rating">Course Rating</Label>
                          <Input
                            id="edit-rating"
                            type="number"
                            step="0.1"
                            value={editedCourse.rating}
                            onChange={(e) => setEditedCourse({ ...editedCourse, rating: parseFloat(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-tees">Tees</Label>
                        <Input
                          id="edit-tees"
                          value={editedCourse.tees}
                          onChange={(e) => setEditedCourse({ ...editedCourse, tees: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-location">Location (optional)</Label>
                        <Input
                          id="edit-location"
                          value={editedCourse.location}
                          onChange={(e) => setEditedCourse({ ...editedCourse, location: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateCourse}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Course
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {course.name} and all {courseRounds.length} associated rounds.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteCourse} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Rounds History</CardTitle>
              <CardDescription>Recent rounds played at this course</CardDescription>
            </div>
            <Button asChild size="sm">
              <Link to="/rounds/add" state={{ courseId: course.id }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Round
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {courseRounds.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No rounds recorded at this course yet.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseRounds.slice(0, 5).map((round) => {
                      const player = getPlayerById(round.playerId);
                      return (
                        <TableRow key={round.id}>
                          <TableCell>{new Date(round.date).toLocaleDateString()}</TableCell>
                          <TableCell>{player?.name || 'Unknown Player'}</TableCell>
                          <TableCell>{round.score}</TableCell>
                          <TableCell>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete this round?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteRound(round.id)} 
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
            {courseRounds.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="outline" asChild size="sm">
                  <Link to="/rounds" state={{ courseId: course.id }}>
                    View All Rounds
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetail;