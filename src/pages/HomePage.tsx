import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PromotionCard from '../components/PromotionCard';
import GameCard from '../components/GameCard';
import SportFilter from '../components/SportFilter';
import BonusIcon from '../components/BonusIcon';
import CalendarIcon from '../components/CalendarIcon';
import { Game, getGames } from '../lib/games';
import { Trophy, Search } from 'lucide-react';

const sports = [
  { id: 'futsal', name: 'Futsal', icon: <Trophy size={16} /> },
  { id: 'handebol', name: 'Handebol', icon: <Trophy size={16} /> },
  { id: 'queimada', name: 'Queimada', icon: <Trophy size={16} /> },
  { id: 'futevolei', name: 'Futevôlei', icon: <Trophy size={16} /> },
  { id: 'volei', name: 'Vôlei', icon: <Trophy size={16} /> },
];


const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState('futsal');
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, [selectedSport]);

  const fetchGames = async () => {
    setLoading(true);
    const games = await getGames({ sport: selectedSport, limitCount: 8 });
    setGames(games);
    setLoading(false);
  };

  const handleRedeemBonus = () => {
    navigate('/bonus');
  };

  const handleAccessSchedule = () => {
    navigate('/agenda');
  };

  const filteredGames = games.filter(game => 
    game.home_team.toLowerCase().includes(searchTerm.toLowerCase()) || 
    game.away_team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <PromotionCard
          title="Resgate o"
          highlightText="seu bônus"
          buttonText="RESGATAR"
          onClick={handleRedeemBonus}
          icon={<BonusIcon />}
        />
        <PromotionCard
          title="Agenda de jogos"
          highlightText="do dia"
          buttonText="ACESSAR"
          onClick={handleAccessSchedule}
          icon={<CalendarIcon />}
        />
      </div>

      <div className="mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
          <h2 className="text-2xl font-heading font-bold">Jogos em Destaque</h2>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar jogos..."
              className="w-full bg-secondary-light rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <SportFilter 
          sports={sports} 
          selectedSport={selectedSport} 
          onSelectSport={setSelectedSport} 
        />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando jogos...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {filteredGames.map((game) => (
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

            {filteredGames.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">Nenhum jogo encontrado.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
