import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Clock, Filter, Target } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';

const MyBetsPage: React.FC = () => {
  const { profile } = useAuthContext();
  const [filter, setFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');

  // No bets for now - empty state
  const filteredBets: any[] = [];
  const totalStaked = 0; // Since there are no bets yet

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-heading font-bold mb-4 md:mb-0">Minhas Apostas</h1>
        
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-primary" />
          <select 
            className="bg-secondary-light rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">Todas</option>
            <option value="pending">Pendentes</option>
            <option value="won">Ganhas</option>
            <option value="lost">Perdidas</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="card p-6 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <DollarSign size={32} className="text-primary mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-primary">$ {totalStaked.toFixed(2)}</h3>
          <p className="text-gray-400">Total Apostado (SENACOINS)</p>
        </motion.div>

        <motion.div 
          className="card p-6 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <TrendingUp size={32} className="text-success mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-success">$ 0.00</h3>
          <p className="text-gray-400">Total Ganho (SENACOINS)</p>
        </motion.div>

        <motion.div 
          className="card p-6 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <Clock size={32} className="text-warning mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-warning">0</h3>
          <p className="text-gray-400">Apostas Pendentes</p>
        </motion.div>
      </div>

      {/* Bets List */}
      <div className="space-y-4">
        {filteredBets.length === 0 ? (
          <div className="text-center py-12">
            <Target size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Nenhuma aposta ainda</h2>
            <p className="text-gray-400 mb-6">
              Você ainda não fez nenhuma aposta. Comece apostando nos jogos disponíveis!
            </p>
            <div className="bg-secondary-light rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-bold mb-2 text-primary">Seu Saldo Atual</h3>
              <p className="text-3xl font-bold text-primary">$ {profile?.senacoins_balance?.toFixed(2) || '0.00'}</p>
              <p className="text-sm text-gray-400 mt-2">SENACOINS disponíveis para apostar</p>
            </div>
          </div>
        ) : (
          filteredBets.map((bet) => (
            <motion.div
              key={bet.id}
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1 mb-4 md:mb-0">
                  <h3 className="text-lg font-bold mb-2">{bet.match_info}</h3>
                  <p className="text-gray-400 mb-1">Tipo: {bet.bet_type}</p>
                  <p className="text-gray-400 mb-1">Data: {new Date(bet.match_date).toLocaleDateString('pt-BR')}</p>
                  <p className="text-gray-400">Horário: {bet.match_time}</p>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Aposta</p>
                    <p className="font-bold text-primary">$ {bet.stake.toFixed(2)}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Odd</p>
                    <p className="font-bold">{bet.odds.toFixed(2)}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Ganho Potencial</p>
                    <p className="font-bold text-success">$ {bet.potential_win.toFixed(2)}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Status</p>
                    <span className={`font-bold ${
                      bet.status === 'won' ? 'text-success' : 
                      bet.status === 'lost' ? 'text-error' : 
                      'text-warning'
                    }`}>
                      {bet.status === 'won' ? 'GANHOU' : 
                       bet.status === 'lost' ? 'PERDEU' : 
                       'PENDENTE'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBetsPage;