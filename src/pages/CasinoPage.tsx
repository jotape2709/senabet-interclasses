import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dice1, TrendingUp, DollarSign, AlertTriangle, RotateCcw } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { CasinoGame, playCasinoGame, getGameHistory } from '../lib/casino';

const CasinoPage: React.FC = () => {
  const { user, profile, updateProfile } = useAuthContext();
  const [betAmount, setBetAmount] = useState(10);
  const [gameHistory, setGameHistory] = useState<CasinoGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);

  // Roulette state
  const [rouletteChoice, setRouletteChoice] = useState<'red' | 'black' | 'even' | 'odd'>('red');
  const [rouletteSpinning, setRouletteSpinning] = useState(false);

  // Crash state
  const [crashMultiplier, setCrashMultiplier] = useState(1.00);
  const [crashRunning, setCrashRunning] = useState(false);
  const [crashCashedOut, setCrashCashedOut] = useState(false);

  useEffect(() => {
    if (user) {
      fetchGameHistory();
    }
  }, [user]);

  const fetchGameHistory = async () => {
    if (!user) return;
    const history = await getGameHistory(user.uid);
    setGameHistory(history);
  };

  const playRoulette = async () => {
    if (!user || betAmount <= 0 || (profile?.senacoins_balance || 0) < betAmount) return;

    setLoading(true);
    setRouletteSpinning(true);
    setGameResult(null);

    try {
      // Simulate roulette spin
      const randomNumber = Math.floor(Math.random() * 37); // 0-36
      const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(randomNumber);
      const isBlack = randomNumber !== 0 && !isRed;
      const isEven = randomNumber !== 0 && randomNumber % 2 === 0;
      const isOdd = randomNumber !== 0 && randomNumber % 2 === 1;

      let won = false;
      if (rouletteChoice === 'red' && isRed) won = true;
      if (rouletteChoice === 'black' && isBlack) won = true;
      if (rouletteChoice === 'even' && isEven) won = true;
      if (rouletteChoice === 'odd' && isOdd) won = true;

      // Simulate spinning delay
      setTimeout(async () => {
        const result = await playCasinoGame(user.uid, 'roulette', betAmount, {
          choice: rouletteChoice,
          number: randomNumber,
          won
        });

        setGameResult({
          ...result,
          number: randomNumber,
          choice: rouletteChoice,
          won
        });

        setRouletteSpinning(false);
        await fetchGameHistory();
        await updateProfile({}); // Refresh profile to get new balance
      }, 3000);
    } catch (error) {
      console.error('Error playing roulette:', error);
      setRouletteSpinning(false);
    } finally {
      setLoading(false);
    }
  };

  const startCrash = () => {
    if (!user || betAmount <= 0 || (profile?.senacoins_balance || 0) < betAmount) return;

    setCrashRunning(true);
    setCrashCashedOut(false);
    setCrashMultiplier(1.00);
    setGameResult(null);

    const interval = setInterval(() => {
      setCrashMultiplier(prev => {
        const newMultiplier = prev + 0.01;
        const crashPoint = 1.1 + Math.random() * 8.9;
        
        if (newMultiplier >= crashPoint) {
          clearInterval(interval);
          setCrashRunning(false);
          
          if (!crashCashedOut) {
            setGameResult({
              success: true,
              result: 'lose',
              payout: 0,
              message: `Crashed at ${newMultiplier.toFixed(2)}x!`
            });
            playCasinoGame(user.uid, 'crash', betAmount, { multiplier: 0, cashed_out: false });
          }
          
          return newMultiplier;
        }
        
        return newMultiplier;
      });
    }, 100);
  };

  const cashOut = async () => {
    if (!crashRunning || crashCashedOut || !user) return;

    setCrashCashedOut(true);
    setCrashRunning(false);

    try {
      const result = await playCasinoGame(user.uid, 'crash', betAmount, {
        multiplier: crashMultiplier
      });

      setGameResult({
        ...result,
        multiplier: crashMultiplier,
        message: `Cashed out at ${crashMultiplier.toFixed(2)}x!`
      });

      await fetchGameHistory();
      await updateProfile({}); // Refresh profile to get new balance
    } catch (error) {
      console.error('Error cashing out:', error);
    }
  };

  const totalWagered = gameHistory.reduce((sum, game) => sum + game.betAmount, 0);
  const totalPayout = gameHistory.reduce((sum, game) => sum + game.payout, 0);
  const netProfit = totalPayout - totalWagered;

  if (!user) {
    return (
      <div className="text-center py-12">
        <Dice1 size={64} className="text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
        <p className="text-gray-400">Você precisa estar logado para acessar os jogos de cassino.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold mb-4">Cassino</h1>
        <p className="text-gray-400">Jogue com responsabilidade usando seus SENACOINS!</p>
      </div>

      {/* Warning */}
      <div className="card p-4 bg-warning/20 border border-warning">
        <div className="flex items-center space-x-2">
          <AlertTriangle size={20} className="text-warning" />
          <p className="text-warning text-sm">
            <strong>Aviso:</strong> Jogos de cassino envolvem risco. Jogue com responsabilidade e apenas com o que pode perder.
          </p>
        </div>
      </div>

      {/* Balance and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div className="card p-6 text-center" whileHover={{ scale: 1.02 }}>
          <DollarSign size={32} className="text-primary mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-primary">$ {profile?.senacoins_balance?.toFixed(2) || '0.00'}</h3>
          <p className="text-gray-400">Saldo Atual</p>
        </motion.div>

        <motion.div className="card p-6 text-center" whileHover={{ scale: 1.02 }}>
          <TrendingUp size={32} className="text-warning mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-warning">$ {totalWagered.toFixed(2)}</h3>
          <p className="text-gray-400">Total Apostado</p>
        </motion.div>

        <motion.div className="card p-6 text-center" whileHover={{ scale: 1.02 }}>
          <DollarSign size={32} className="text-success mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-success">$ {totalPayout.toFixed(2)}</h3>
          <p className="text-gray-400">Total Ganho</p>
        </motion.div>

        <motion.div className="card p-6 text-center" whileHover={{ scale: 1.02 }}>
          <TrendingUp size={32} className={`mx-auto mb-2 ${netProfit >= 0 ? 'text-success' : 'text-error'}`} />
          <h3 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-error'}`}>
            $ {netProfit.toFixed(2)}
          </h3>
          <p className="text-gray-400">Lucro/Prejuízo</p>
        </motion.div>
      </div>

      {/* Bet Amount */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4">Valor da Aposta</h3>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            min="1"
            max={profile?.senacoins_balance || 0}
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 1))}
            className="bg-secondary-light rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary w-32"
          />
          <span className="text-gray-400">SENACOINS</span>
          <div className="flex space-x-2">
            {[10, 25, 50, 100].map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className="btn bg-secondary-light hover:bg-secondary text-sm px-3 py-1"
              >
                {amount}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Roulette */}
        <div className="card p-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <RotateCcw size={24} className="text-primary mr-2" />
            Roleta
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'red', label: 'Vermelho', color: 'bg-red-600' },
                { key: 'black', label: 'Preto', color: 'bg-gray-800' },
                { key: 'even', label: 'Par', color: 'bg-blue-600' },
                { key: 'odd', label: 'Ímpar', color: 'bg-green-600' }
              ].map(option => (
                <button
                  key={option.key}
                  onClick={() => setRouletteChoice(option.key as any)}
                  className={`p-3 rounded-md font-bold transition-all ${option.color} ${
                    rouletteChoice === option.key ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              onClick={playRoulette}
              disabled={loading || rouletteSpinning || betAmount > (profile?.senacoins_balance || 0)}
              className="w-full btn btn-primary flex items-center justify-center space-x-2"
            >
              {rouletteSpinning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>GIRANDO...</span>
                </>
              ) : (
                <span>GIRAR ROLETA</span>
              )}
            </button>

            {gameResult && gameResult.number !== undefined && (
              <div className={`p-3 rounded-md ${gameResult.won ? 'bg-success/20 border border-success' : 'bg-error/20 border border-error'}`}>
                <p className={gameResult.won ? 'text-success' : 'text-error'}>
                  Número: {gameResult.number} | Escolha: {gameResult.choice}
                </p>
                <p className={gameResult.won ? 'text-success' : 'text-error'}>
                  {gameResult.won ? `Ganhou $ ${gameResult.payout?.toFixed(2)}!` : 'Perdeu!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Crash */}
        <div className="card p-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <TrendingUp size={24} className="text-warning mr-2" />
            Crash
          </h3>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-4 ${crashRunning ? 'text-warning animate-pulse' : 'text-primary'}`}>
                {crashMultiplier.toFixed(2)}x
              </div>
              <p className="text-gray-400">Multiplicador</p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={startCrash}
                disabled={loading || crashRunning || betAmount > (profile?.senacoins_balance || 0)}
                className="flex-1 btn btn-primary"
              >
                INICIAR
              </button>
              <button
                onClick={cashOut}
                disabled={!crashRunning || crashCashedOut}
                className="flex-1 btn bg-success hover:bg-success-dark"
              >
                CASH OUT
              </button>
            </div>

            {gameResult && gameResult.multiplier && (
              <div className={`p-3 rounded-md ${gameResult.result === 'win' ? 'bg-success/20 border border-success' : 'bg-error/20 border border-error'}`}>
                <p className={gameResult.result === 'win' ? 'text-success' : 'text-error'}>
                  {gameResult.message}
                </p>
                {gameResult.result === 'win' && (
                  <p className="text-success">Ganhou $ {gameResult.payout?.toFixed(2)}!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Game History */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4">Histórico de Jogos</h3>
        {gameHistory.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Nenhum jogo ainda.</p>
        ) : (
          <div className="space-y-2">
            {gameHistory.map((game) => (
              <div key={game.id} className="flex justify-between items-center p-3 bg-secondary-light rounded-md">
                <div>
                  <span className="font-bold">{game.gameType.toUpperCase()}</span>
                  <span className="text-gray-400 ml-2">
                    {new Date(game.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Aposta: $ {game.betAmount.toFixed(2)}</p>
                  <p className={`font-bold ${game.payout > game.betAmount ? 'text-success' : 'text-error'}`}>
                    {game.payout > game.betAmount ? '+' : ''}$ {(game.payout - game.betAmount).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CasinoPage;
