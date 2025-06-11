
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase, Player as SupaPlayer, Course as SupaCourse, Round as SupaRound } from '@/lib/supabase';

// Types with camelCase for frontend use
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

// Helper functions to convert between snake_case (DB) and camelCase (frontend)
const playerFromDB = (player: SupaPlayer): Player => ({
  id: player.id,
  name: player.name,
  email: player.email,
  createdAt: player.created_at,
});

const courseFromDB = (course: SupaCourse): Course => ({
  id: course.id,
  name: course.name,
  holes: course.holes,
  par: course.par,
  slope: course.slope,
  rating: course.rating,
  tees: course.tees,
  location: course.location,
  createdAt: course.created_at,
});

const roundFromDB = (round: SupaRound): Round => ({
  id: round.id,
  playerId: round.player_id,
  courseId: round.course_id,
  date: round.date,
  score: round.score,
  notes: round.notes,
  createdAt: round.created_at,
});

interface GolfDataContextType {
  players: Player[];
  courses: Course[];
  rounds: Round[];
  loading: boolean;
  addPlayer: (player: Omit<Player, 'id' | 'createdAt'>) => Promise<void>;
  updatePlayer: (id: string, player: Partial<Player>) => Promise<void>;
  deletePlayer: (id: string) => Promise<void>;
  addCourse: (course: Omit<Course, 'id' | 'createdAt'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addRound: (round: Omit<Round, 'id' | 'createdAt'>) => Promise<void>;
  updateRound: (id: string, round: Partial<Round>) => Promise<void>;
  deleteRound: (id: string) => Promise<void>;
  getPlayerById: (id: string) => Player | undefined;
  getCourseById: (id: string) => Course | undefined;
  getRoundById: (id: string) => Round | undefined;
  getPlayerRounds: (playerId: string) => Round[];
  getCourseRounds: (courseId: string) => Round[];
  calculateHandicap: (playerId: string) => number;
  refreshData: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on initial render
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      // Fetch players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .order('name');
      
      if (playersError) throw playersError;
      setPlayers(playersData.map(playerFromDB));

      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('name');
      
      if (coursesError) throw coursesError;
      setCourses(coursesData.map(courseFromDB));

      // Fetch rounds
      const { data: roundsData, error: roundsError } = await supabase
        .from('rounds')
        .select('*')
        .order('date', { ascending: false });
      
      if (roundsError) throw roundsError;
      setRounds(roundsData.map(roundFromDB));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data from the server');
    } finally {
      setLoading(false);
    }
  };

  // Player CRUD operations
  const addPlayer = async (player: Omit<Player, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([{ 
          name: player.name,
          email: player.email || null
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setPlayers([...players, playerFromDB(data)]);
      toast.success(`Player ${player.name} added successfully`);
    } catch (error) {
      console.error('Error adding player:', error);
      toast.error('Failed to add player');
    }
  };

  const updatePlayer = async (id: string, player: Partial<Player>) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({ 
          name: player.name,
          email: player.email || null
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setPlayers(players.map(p => p.id === id ? { ...p, ...player } : p));
      toast.success('Player updated successfully');
    } catch (error) {
      console.error('Error updating player:', error);
      toast.error('Failed to update player');
    }
  };

  const deletePlayer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPlayers(players.filter(p => p.id !== id));
      // Rounds will be automatically deleted due to cascade delete in DB
      setRounds(rounds.filter(r => r.playerId !== id));
      toast.success('Player deleted successfully');
    } catch (error) {
      console.error('Error deleting player:', error);
      toast.error('Failed to delete player');
    }
  };

  // Course CRUD operations
  const addCourse = async (course: Omit<Course, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([{ 
          name: course.name,
          holes: course.holes,
          par: course.par,
          slope: course.slope,
          rating: course.rating,
          tees: course.tees,
          location: course.location || null
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setCourses([...courses, courseFromDB(data)]);
      toast.success(`Course ${course.name} added successfully`);
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Failed to add course');
    }
  };

  const updateCourse = async (id: string, course: Partial<Course>) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ 
          name: course.name,
          holes: course.holes,
          par: course.par,
          slope: course.slope,
          rating: course.rating,
          tees: course.tees,
          location: course.location || null
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setCourses(courses.map(c => c.id === id ? { ...c, ...course } : c));
      toast.success('Course updated successfully');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCourses(courses.filter(c => c.id !== id));
      // Rounds will be automatically deleted due to cascade delete in DB
      setRounds(rounds.filter(r => r.courseId !== id));
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  // Round CRUD operations
  const addRound = async (round: Omit<Round, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('rounds')
        .insert([{ 
          player_id: round.playerId,
          course_id: round.courseId,
          date: round.date,
          score: round.score,
          notes: round.notes || null
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setRounds([roundFromDB(data), ...rounds]);
      toast.success('Round added successfully');
    } catch (error) {
      console.error('Error adding round:', error);
      toast.error('Failed to add round');
    }
  };

  const updateRound = async (id: string, round: Partial<Round>) => {
    try {
      const updateData: any = {};
      if (round.playerId) updateData.player_id = round.playerId;
      if (round.courseId) updateData.course_id = round.courseId;
      if (round.date) updateData.date = round.date;
      if (round.score !== undefined) updateData.score = round.score;
      if (round.notes !== undefined) updateData.notes = round.notes || null;

      const { error } = await supabase
        .from('rounds')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      setRounds(rounds.map(r => r.id === id ? { ...r, ...round } : r));
      toast.success('Round updated successfully');
    } catch (error) {
      console.error('Error updating round:', error);
      toast.error('Failed to update round');
    }
  };

  const deleteRound = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rounds')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setRounds(rounds.filter(r => r.id !== id));
      toast.success('Round deleted successfully');
    } catch (error) {
      console.error('Error deleting round:', error);
      toast.error('Failed to delete round');
    }
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
    loading,
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
    refreshData,
  };

  return <GolfDataContext.Provider value={value}>{children}</GolfDataContext.Provider>;
};