
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, Flag, GolfClub } from 'lucide-react';
import { useGolfData } from '@/context/GolfDataContext';

const Dashboard = () => {
  const { players, courses, rounds, calculateHandicap } = useGolfData();

  // Find the player with the lowest handicap (best player)
  const getBestPlayer = () => {
    if (players.length === 0) return null;
    
    let bestPlayer = players[0];
    let lowestHandicap = calculateHandicap(bestPlayer.id);
    
    players.forEach(player => {
      const handicap = calculateHandicap(player.id);
      if (handicap > 0 && handicap < lowestHandicap) {
        lowestHandicap = handicap;
        bestPlayer = player;
      }
    });
    
    return { player: bestPlayer, handicap: lowestHandicap };
  };

  const bestPlayer = getBestPlayer();

  // Get recent rounds
  const recentRounds = [...rounds]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex space-x-2">
          <Button asChild>
            <Link to="/rounds/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Round
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{players.length}</div>
            <p className="text-xs text-muted-foreground">
              {players.length === 0 ? "No players yet" : `${players.length} registered players`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              {courses.length === 0 ? "No courses yet" : `${courses.length} golf courses`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rounds</CardTitle>
            <GolfClub className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rounds.length}</div>
            <p className="text-xs text-muted-foreground">
              {rounds.length === 0 ? "No rounds played yet" : `${rounds.length} rounds played`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Best Player</CardTitle>
            <CardDescription>Player with the lowest handicap</CardDescription>
          </CardHeader>
          <CardContent>
            {bestPlayer && bestPlayer.handicap > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{bestPlayer.player.name}</span>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-md">
                    Handicap: {bestPlayer.handicap}
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to={`/players/${bestPlayer.player.id}`}>View Profile</Link>
                </Button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Not enough rounds to calculate handicaps yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Rounds</CardTitle>
            <CardDescription>Latest golf rounds recorded</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRounds.length > 0 ? (
              <div className="space-y-2">
                {recentRounds.map(round => {
                  const player = players.find(p => p.id === round.playerId);
                  const course = courses.find(c => c.id === round.courseId);
                  
                  return (
                    <div key={round.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">{player?.name}</span>
                        <span className="text-muted-foreground"> at </span>
                        <span>{course?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>{new Date(round.date).toLocaleDateString()}</span>
                        <span className="font-medium">{round.score}</span>
                      </div>
                    </div>
                  );
                })}
                <Button variant="outline" size="sm" asChild className="w-full mt-2">
                  <Link to="/rounds">View All Rounds</Link>
                </Button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No rounds recorded yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;