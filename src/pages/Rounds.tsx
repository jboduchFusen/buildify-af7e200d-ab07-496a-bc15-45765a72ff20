
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGolfData, Round } from '@/context/GolfDataContext';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, MoreHorizontal, Search, GolfClub } from 'lucide-react';

const Rounds = () => {
  const location = useLocation();
  const initialPlayerId = location.state?.playerId || '';
  const initialCourseId = location.state?.courseId || '';
  
  const { rounds, players, courses, deleteRound } = useGolfData();
  const [searchQuery, setSearchQuery] = useState('');
  const [playerFilter, setPlayerFilter] = useState(initialPlayerId);
  const [courseFilter, setCourseFilter] = useState(initialCourseId);

  const filteredRounds = rounds.filter(round => {
    const player = players.find(p => p.id === round.playerId);
    const course = courses.find(c => c.id === round.courseId);
    
    // Apply player filter
    if (playerFilter && round.playerId !== playerFilter) {
      return false;
    }
    
    // Apply course filter
    if (courseFilter && round.courseId !== courseFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const playerMatch = player && player.name.toLowerCase().includes(searchLower);
      const courseMatch = course && course.name.toLowerCase().includes(searchLower);
      const dateMatch = new Date(round.date).toLocaleDateString().toLowerCase().includes(searchLower);
      const scoreMatch = round.score.toString().includes(searchLower);
      
      return playerMatch || courseMatch || dateMatch || scoreMatch;
    }
    
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const clearFilters = () => {
    setPlayerFilter('');
    setCourseFilter('');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Rounds</h1>
        <Button asChild>
          <Link to="/rounds/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Round
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rounds..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2 md:w-2/5">
          <Select value={playerFilter} onValueChange={setPlayerFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by player" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Players</SelectItem>
              {players.map(player => (
                <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Courses</SelectItem>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {(playerFilter || courseFilter || searchQuery) && (
          <Button variant="outline" onClick={clearFilters} className="md:w-auto">
            Clear Filters
          </Button>
        )}
      </div>

      {rounds.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <GolfClub className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">No rounds yet</h2>
          <p className="mb-8 mt-2 text-center text-sm text-muted-foreground max-w-sm">
            You haven't recorded any golf rounds yet. Add your first round to start tracking your progress.
          </p>
          <Button asChild>
            <Link to="/rounds/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Round
            </Link>
          </Button>
        </div>
      ) : filteredRounds.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">No matching rounds</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No rounds match your current filters. Try adjusting your search or filters.
          </p>
          <Button variant="outline" onClick={clearFilters} className="mt-4">
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>vs Par</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRounds.map((round) => (
                <RoundRow 
                  key={round.id} 
                  round={round} 
                  onDelete={deleteRound} 
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

interface RoundRowProps {
  round: Round;
  onDelete: (id: string) => void;
}

const RoundRow = ({ round, onDelete }: RoundRowProps) => {
  const { getPlayerById, getCourseById } = useGolfData();
  const player = getPlayerById(round.playerId);
  const course = getCourseById(round.courseId);
  
  const scoreToPar = course ? round.score - course.par : null;
  const scoreToParDisplay = scoreToPar !== null 
    ? (scoreToPar === 0 ? 'E' : (scoreToPar > 0 ? `+${scoreToPar}` : scoreToPar)) 
    : '-';

  return (
    <TableRow>
      <TableCell>{new Date(round.date).toLocaleDateString()}</TableCell>
      <TableCell>
        {player ? (
          <Link to={`/players/${player.id}`} className="hover:underline">
            {player.name}
          </Link>
        ) : (
          'Unknown Player'
        )}
      </TableCell>
      <TableCell>
        {course ? (
          <Link to={`/courses/${course.id}`} className="hover:underline">
            {course.name}
          </Link>
        ) : (
          'Unknown Course'
        )}
      </TableCell>
      <TableCell className="font-medium">{round.score}</TableCell>
      <TableCell>{scoreToParDisplay}</TableCell>
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
            {player && (
              <DropdownMenuItem asChild>
                <Link to={`/players/${player.id}`}>View player</Link>
              </DropdownMenuItem>
            )}
            {course && (
              <DropdownMenuItem asChild>
                <Link to={`/courses/${course.id}`}>View course</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                  Delete round
                </DropdownMenuItem>
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
                    onClick={() => onDelete(round.id)} 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default Rounds;