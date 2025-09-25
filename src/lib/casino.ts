import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

export interface CasinoGame {
  id: string;
  userId: string;
  gameType: string;
  betAmount: number;
  payout: number;
  details: any;
  createdAt: Date;
}

export const playCasinoGame = async (userId: string, gameType: string, betAmount: number, details: any) => {
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const userData = userDoc.data();
  const currentBalance = userData.senacoins_balance || 0;

  if (currentBalance < betAmount) {
    throw new Error('Insufficient balance');
  }

  let payout = 0;
  let result = {};

  if (gameType === 'roulette') {
    const { choice, number, won } = details;
    if (won) {
      payout = betAmount * 2;
    }
    result = { choice, number, won };
  } else if (gameType === 'crash') {
    const { multiplier } = details;
    payout = betAmount * multiplier;
    result = { multiplier };
  }

  const newBalance = currentBalance - betAmount + payout;
  await updateDoc(userDocRef, { senacoins_balance: newBalance });

  const gameLog = {
    userId,
    gameType,
    betAmount,
    payout,
    details: result,
    createdAt: new Date(),
  };

  await addDoc(collection(db, 'casino_games'), gameLog);

  return { success: true, newBalance, payout, ...result };
};

export const getGameHistory = async (userId: string): Promise<CasinoGame[]> => {
  const q = query(
    collection(db, 'casino_games'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(10)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CasinoGame));
};
