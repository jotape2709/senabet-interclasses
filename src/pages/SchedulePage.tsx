import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Trophy, Filter } from 'lucide-react';
import GameCard from '../components/GameCard';
import { Game, getGames } from '../lib/games';

const SchedulePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSport, setSelectedSport] = useState('all');

  const sports = [
    { id: 'all', name: 'Todos os Esportes' },
    { id: 'futsal', name: 'Futsal' },
    { id: 'handebol', name: 'Handebol' },
    { id: 'queimada', name: 'Queimada' },
    { id: 'futevolei', name: 'Futevôlei' },
    { id: 'volei', name: 'Vôlei' },
  ];

  useEffect(() => {
    fetchGames();
  }, [selectedDate, selectedSport]);

  const fetchGames = async () => {
    setLoading(true);
    const games = await getGames({
      sport: selectedSport,
      date: selectedDate,
      sortBy: 'match_time',
      sortOrder: 'asc',
    });
    setGames(games);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getNextDays = (days: number) => {
    const dates = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const quickDates = getNextDays(7);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold mb-4">Agenda de Jogos</h1>
        <p className="text-gray-400">Confira todos os jogos programados e não perca nenhuma aposta!</p>
      </div>

      {/* Date Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center">
          <Calendar size={24} className="text-primary mr-2" />
          Selecionar Data
        </h2>
        
        {/* Quick Date Buttons */}
        <div className="flex flex-wrap gap-2">
          {quickDates.map((date, index) => {
            const dateObj = new Date(date);
            const isToday = index === 0;
            const isTomorrow = index === 1;
            
            let label = dateObj.toLocaleDateString('pt-BR', { 
              weekday: 'short', 
              day: 'numeric', 
              month: 'short' 
            });
            
            if (isToday) label = 'Hoje';
            if (isTomorrow) label = 'Amanhã';
            
            return (
              <motion.button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedDate === date
                    ? 'bg-primary text-secondary-dark'
                    : 'bg-secondary-light hover:bg-secondary text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {label}
              </motion.button>
            );
          })}
        </div>

        {/* Custom Date Picker */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium">Ou escolha uma data específica:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-secondary-light rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Sport Filter */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center">
          <Filter size={24} className="text-primary mr-2" />
          Filtrar por Esporte
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {sports.map((sport) => (
            <motion.button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedSport === sport.id
                  ? 'bg-primary text-secondary-dark'
                  : 'bg-secondary-light hover:bg-secondary text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sport.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Date Display */}
      <div className="card p-6 text-center">
        <h3 className="text-2xl font-bold text-primary mb-2">
          {formatDate(selectedDate)}
        </h3>
        <p className="text-gray-400">
          {games.length} {games.length === 1 ? 'jogo encontrado' : 'jogos encontrados'}
        </p>
      </div>

      {/* Games List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando jogos...</p>
            </div>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Nenhum jogo encontrado</h2>
            <p className="text-gray-400">
              Não há jogos programados para {formatDate(selectedDate)}
              {selectedSport !== 'all' && ` na modalidade ${sports.find(s => s.id === selectedSport)?.name}`}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard
                key={game.id}
                homeTeam={{
                  name: game.home_team,
                  logo: game.home_team_logo || 'https://images.pexels.com/photos/9586/sports-football-helmet.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                  odds: game.home_odds
                }}
                awayTeam={{
                  name: game.away_team,
                  logo: game.away_team_logo || 'https://images.pexels.com/photos/9585876/pexels-photo-9585876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                  odds: game.away_odds
                }}
                leagueName={game.league_name}
                matchTime={game.match_time}
                matchDate={new Date(game.match_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                isLive={game.is_live}
              />
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      {games.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="card p-6 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <Clock size={32} className="text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-primary">
              {games.filter(g => g.is_live).length}
            </h3>
            <p className="text-gray-400">Jogos ao Vivo</p>
          </motion.div>

          <motion.div 
            className="card p-6 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <Trophy size={32} className="text-success mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-success">
              {new Set(games.map(g => g.sport)).size}
            </h3>
            <p className="text-gray-400">Esportes Diferentes</p>
          </motion.div>

          <motion.div 
            className="card p-6 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <MapPin size={32} className="text-warning mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-warning">
              {new Set(games.map(g => g.league_name)).size}
            </h3>
            <p className="text-gray-400">Ligas/Campeonatos</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;