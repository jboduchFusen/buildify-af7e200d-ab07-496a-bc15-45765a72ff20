
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Types
export interface Player {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  holes: number;
  par: number;
  slope: number;
  rating: number;
  tees: string;
  location?: string;
  createdAt: string;
}

export interface Round {
  id: string;
  playerId: string;
  courseId: string;
  date: string;
  score: number;
  notes?: string;
  createdAt: string;
}

interface GolfDataContextType {
  players: Player[];
  courses: Course[];
  rounds: Round[];
  addPlayer: (player: Omit<Player, 'id' | 'createdAt'>) => void;
  updatePlayer: (id: string, player: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  addCourse: (course: Omit<Course, 'id' | 'createdAt'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addRound: (round: Omit<Round, 'id' | 'createdAt'>) => void;
  updateRound: (id: string, round: Partial<Round>) => void;
  deleteRound: (id: string) => void;
  getPlayerById: (id: string) => Player | undefined;
  getCourseById: (id: string) => Course | undefined;
  getRoundById: (id: string) => Round | undefined;
  getPlayerRounds: (playerId: string) => Round[];
  getCourseRounds: (courseId: string) => Round[];
  calculateHandicap: (playerId: string) => number;
}

const GolfDataContext = createContext<GolfDataContextType | undefined>(undefined);

export const useGolfData = () => {
  const context = useContext(GolfDataContext);
  if (context === undefined) {
    throw new Error('useGolfData must be used within a GolfDataProvider');
  }
  return context;
};

export const GolfDataProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedPlayers = localStorage.getItem('golf-players');
    const storedCourses = localStorage.getItem('golf-courses');
    const storedRounds = localStorage.getItem('golf-rounds');

    if (storedPlayers) setPlayers(JSON.parse(storedPlayers));
    if (storedCourses) setCourses(JSON.parse(storedCourses));
    if (storedRounds) setRounds(JSON.parse(storedRounds));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('golf-players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('golf-courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('golf-rounds', JSON.stringify(rounds));
  }, [rounds]);

  // Player CRUD operations
  const addPlayer = (player: Omit<Player, 'id' | 'createdAt'>) => {
    const newPlayer: Player = {
      ...player,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setPlayers([...players, newPlayer]);
    toast.success(`Player ${player.name} added successfully`);
  };

  const updatePlayer = (id: string, player: Partial<Player>) => {
    setPlayers(
      players.map((p) => (p.id === id ? { ...p, ...player } : p))
    );
    toast.success('Player updated successfully');
  };

  const deletePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
    // Also delete all rounds associated with this player
    setRounds(rounds.filter((r) => r.playerId !== id));
    toast.success('Player deleted successfully');
  };

  // Course CRUD operations
  const addCourse = (course: Omit<Course, 'id' | 'createdAt'>) => {
    const newCourse: Course = {
      ...course,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setCourses([...courses, newCourse]);
    toast.success(`Course ${course.name} added successfully`);
  };

  const updateCourse = (id: string, course: Partial<Course>) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, ...course } : c))
    );
    toast.success('Course updated successfully');
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
    // Also delete all rounds associated with this course
    setRounds(rounds.filter((r) => r.courseId !== id));
    toast.success('Course deleted successfully');
  };

  // Round CRUD operations
  const addRound = (round: Omit<Round, 'id' | 'createdAt'>) => {
    const newRound: Round = {
      ...round,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setRounds([...rounds, newRound]);
    toast.success('Round added successfully');
  };

  const updateRound = (id: string, round: Partial<Round>) => {
    setRounds(
      rounds.map((r) => (r.id === id ? { ...r, ...round } : r))
    );
    toast.success('Round updated successfully');
  };

  const deleteRound = (id: string) => {
    setRounds(rounds.filter((r) => r.id !== id));
    toast.success('Round deleted successfully');
  };

  // Helper functions
  const getPlayerById = (id: string) => players.find((p) => p.id === id);
  const getCourseById = (id: string) => courses.find((c) => c.id === id);
  const getRoundById = (id: string) => rounds.find((r) => r.id === id);
  const getPlayerRounds = (playerId: string) => rounds.filter((r) => r.playerId === playerId);
  const getCourseRounds = (courseId: string) => rounds.filter((r) => r.courseId === courseId);

  // Calculate handicap (simplified GHIN-like calculation)
  const calculateHandicap = (playerId: string) => {
    const playerRounds = getPlayerRounds(playerId);
    
    if (playerRounds.length < 5) {
      return 0; // Need at least 5 rounds to calculate handicap
    }

    // Sort rounds by score differential (lower is better)
    const roundsWithDifferential = playerRounds.map(round => {
      const course = getCourseById(round.courseId);
      if (!course) return { round, differential: 0 };
      
      // Score differential formula: (Score - Course Rating) * 113 / Slope Rating
      const differential = ((round.score - course.rating) * 113) / course.slope;
      return { round, differential };
    }).sort((a, b) => a.differential - b.differential);

    // Take the best 8 out of last 20 rounds (or fewer if less than 20 rounds available)
    const lastRounds = roundsWithDifferential.slice(0, 20);
    const numberOfRoundsToUse = Math.min(8, Math.floor(lastRounds.length * 0.4));
    const bestRounds = lastRounds.slice(0, numberOfRoundsToUse);

    // Calculate average differential of best rounds
    const sumDifferential = bestRounds.reduce((sum, r) => sum + r.differential, 0);
    const averageDifferential = sumDifferential / bestRounds.length;
    
    // Multiply by 0.96 and truncate to one decimal place
    return Math.floor(averageDifferential * 0.96 * 10) / 10;
  };

  const value = {
    players,
    courses,
    rounds,
    addPlayer,
    updatePlayer,
    deletePlayer,
    addCourse,
    updateCourse,
    deleteCourse,
    addRound,
    updateRound,
    deleteRound,
    getPlayerById,
    getCourseById,
    getRoundById,
    getPlayerRounds,
    getCourseRounds,
    calculateHandicap,
  };

  return <GolfDataContext.Provider value={value}>{children}</GolfDataContext.Provider>;
};