
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

const PlayerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getPlayerById, 
    getPlayerRounds, 
    getCourseById, 
    updatePlayer, 
    deletePlayer,
    calculateHandicap,
    deleteRound
  } = useGolfData();

  const player = getPlayerById(id || '');
  
  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-4">Player Not Found</h2>
        <p className="text-muted-foreground mb-6">The player you're looking for doesn't exist or has been deleted.</p>
        <Button asChild>
          <Link to="/players">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Players
          </Link>
        </Button>
      </div>
    );
  }

  const playerRounds = getPlayerRounds(player.id).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handicap = calculateHandicap(player.id);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedPlayer, setEditedPlayer] = useState({
    name: player.name,
    email: player.email || '',
  });

  const handleUpdatePlayer = () => {
    if (editedPlayer.name.trim()) {
      updatePlayer(player.id, {
        name: editedPlayer.name.trim(),
        email: editedPlayer.email.trim() || undefined,
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeletePlayer = () => {
    deletePlayer(player.id);
    navigate('/players');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="outline" size="sm" asChild className="mr-4">
          <Link to="/players">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{player.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Player Details</CardTitle>
            <CardDescription>View and manage player information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p>{player.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{player.email || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Handicap</h3>
                  <p>{handicap > 0 ? handicap : 'Not enough rounds'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Rounds</h3>
                  <p>{playerRounds.length}</p>
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
                      <DialogTitle>Edit Player</DialogTitle>
                      <DialogDescription>
                        Update player information.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                          id="edit-name"
                          value={editedPlayer.name}
                          onChange={(e) => setEditedPlayer({ ...editedPlayer, name: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-email">Email (optional)</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={editedPlayer.email}
                          onChange={(e) => setEditedPlayer({ ...editedPlayer, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdatePlayer}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Player
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {player.name} and all their associated rounds.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeletePlayer} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
              <CardDescription>Recent golf rounds played</CardDescription>
            </div>
            <Button asChild size="sm">
              <Link to="/rounds/add" state={{ playerId: player.id }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Round
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {playerRounds.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No rounds recorded yet.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playerRounds.slice(0, 5).map((round) => {
                      const course = getCourseById(round.courseId);
                      return (
                        <TableRow key={round.id}>
                          <TableCell>{new Date(round.date).toLocaleDateString()}</TableCell>
                          <TableCell>{course?.name || 'Unknown Course'}</TableCell>
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
            {playerRounds.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="outline" asChild size="sm">
                  <Link to="/rounds" state={{ playerId: player.id }}>
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

export default PlayerDetail;