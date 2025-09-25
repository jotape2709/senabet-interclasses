import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

export interface Bonus {
  id: string;
  userId: string;
  type: string;
  amount: number;
  status: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface Challenge {
  id: string;
  question: string;
  options: string[];
  answer: string;
  subject: string;
  difficulty: string;
}

export const getBonuses = async (userId: string): Promise<Bonus[]> => {
  const q = query(collection(db, 'bonuses'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bonus));
};

export const getRandomChallenge = async (): Promise<Challenge | null> => {
  const q = query(collection(db, 'challenges'));
  const querySnapshot = await getDocs(q);
  const challenges = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge));
  if (challenges.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * challenges.length);
  return challenges[randomIndex];
};

export const claimDailyBonusWithChallenge = async (userId: string, challengeId: string, userAnswer: string) => {
  const challengeDocRef = doc(db, 'challenges', challengeId);
  const challengeDoc = await getDoc(challengeDocRef);

  if (!challengeDoc.exists()) {
    throw new Error('Challenge not found');
  }

  const challengeData = challengeDoc.data() as Challenge;
  const correct = challengeData.answer === userAnswer;

  const today = new Date().toISOString().split('T')[0];
  const userChallengeQuery = query(
    collection(db, 'user_challenges'),
    where('userId', '==', userId),
    where('completedAt', '>=', today)
  );
  const userChallengeSnapshot = await getDocs(userChallengeQuery);

  if (!userChallengeSnapshot.empty) {
    return { success: false, message: 'Você já tentou o desafio diário hoje. Volte amanhã!' };
  }

  await addDoc(collection(db, 'user_challenges'), {
    userId,
    challengeId,
    userAnswer,
    correct,
    completedAt: new Date(),
  });

  if (correct) {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    const newBalance = (userData?.senacoins_balance || 0) + 50;
    await updateDoc(userDocRef, { senacoins_balance: newBalance });

    const bonus = {
      userId,
      type: 'daily_challenge',
      amount: 50,
      status: 'claimed',
      createdAt: new Date(),
      expiresAt: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
    await addDoc(collection(db, 'bonuses'), bonus);

    return { success: true, correct: true, message: 'Parabéns! Você ganhou 50 SENACOINS!' };
  } else {
    return { success: true, correct: false, message: `Resposta incorreta. A resposta correta era: ${challengeData.answer}` };
  }
};
