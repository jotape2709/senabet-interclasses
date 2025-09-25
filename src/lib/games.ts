import { collection, query, where, getDocs, orderBy, limit, QueryConstraint } from 'firebase/firestore';
import { db } from './firebase';

export interface Game {
  id: string;
  home_team: string;
  away_team: string;
  home_team_logo: string;
  away_team_logo: string;
  league_name: string;
  match_date: string;
  match_time: string;
  home_odds: number;
  away_odds: number;
  draw_odds: number;
  is_live: boolean;
  sport: string;
  createdAt: Date;
}

export const getGames = async (options: {
  sport?: string;
  date?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limitCount?: number;
} = {}): Promise<Game[]> => {
  const { sport, date, sortBy = 'match_date', sortOrder = 'asc', limitCount } = options;

  const constraints: QueryConstraint[] = [];

  if (sport && sport !== 'all') {
    constraints.push(where('sport', '==', sport));
  }
  if (date) {
    constraints.push(where('match_date', '==', date));
  }

  constraints.push(orderBy(sortBy, sortOrder));

  if (limitCount) {
    constraints.push(limit(limitCount));
  }

  const finalQuery = query(collection(db, 'games'), ...constraints);
  const querySnapshot = await getDocs(finalQuery);
  
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
};
