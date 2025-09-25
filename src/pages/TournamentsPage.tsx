import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, MapPin, Clock, Star } from 'lucide-react';

interface Tournament {
  id: number;
  name: string;
  sport: string;
  status: 'ongoing' | 'upcoming' | 'finished';
  startDate: string;
  endDate: string;
  location: string;
  participants: number;
  prize: string;
  description: string;
  image: string;
}

const mockTournaments: Tournament[] = [
  {
    id: 1,
    name: 'Copa SENABET Futsal 2024',
    sport: 'Futsal',
    status: 'ongoing',
    startDate: '20/11/2024',
    endDate: '18/12/2024',
    location: 'Qatar',
    participants: 32,
    prize: '$ 5,000 SENACOINS',
    description: 'O maior torneio de futsal do mundo está acontecendo agora!',
    image: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 2,
    name: 'Campeonato de Handebol',
    sport: 'Handebol',
    status: 'upcoming',
    startDate: '01/06/2024',
    endDate: '20/06/2024',
    location: 'Estados Unidos',
    participants: 2,
    prize: '$ 3,500 SENACOINS',
    description: 'Competição de handebol entre as melhores equipes.',
    image: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 3,
    name: 'Torneio de Queimada',
    sport: 'Queimada',
    status: 'finished',
    startDate: '01/07/2024',
    endDate: '14/07/2024',
    location: 'Londres, Inglaterra',
    participants: 128,
    prize: '$ 2,000 SENACOINS',
    description: 'Torneio de queimada já finalizado com grandes emoções.',
    image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 4,
    name: 'Liga de Futevôlei',
    sport: 'Futevôlei',
    status: 'ongoing',
    startDate: '17/09/2024',
    endDate: '31/05/2025',
    location: 'Europa',
    participants: 32,
    prize: '$ 4,200 SENACOINS',
    description: 'Liga de futevôlei em andamento na praia artificial.',
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 5,
    name: 'Copa de Vôlei Estudantil',
    sport: 'Vôlei',
    status: 'upcoming',
    startDate: '09/02/2025',
    endDate: '09/02/2025',
    location: 'New Orleans, EUA',
    participants: 2,
    prize: '$ 3,800 SENACOINS',
    description: 'Competição de vôlei entre estudantes.',
    image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

const TournamentsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'upcoming' | 'finished'>('all');

  const filteredTournaments = mockTournaments.filter(tournament => 
    filter === 'all' || tournament.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-success text-white';
      case 'upcoming': return 'bg-warning text-secondary-dark';
      case 'finished': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing': return 'EM ANDAMENTO';
      case 'upcoming': return 'PRÓXIMO';
      case 'finished': return 'FINALIZADO';
      default: return status.toUpperCase();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing': return <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>;
      case 'upcoming': return <Clock size={12} />;
      case 'finished': return <Star size={12} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-heading font-bold mb-4 md:mb-0">Torneios</h1>
        
        <div className="flex items-center space-x-2">
          <Trophy size={20} className="text-primary" />
          <select 
            className="bg-secondary-light rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">Todos</option>
            <option value="ongoing">Em Andamento</option>
            <option value="upcoming">Próximos</option>
            <option value="finished">Finalizados</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="card p-6 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-2 h-2 bg-success rounded-full animate-pulse mx-auto mb-2"></div>
          <h3 className="text-2xl font-bold text-success">
            {mockTournaments.filter(t => t.status === 'ongoing').length}
          </h3>
          <p className="text-gray-400">Em Andamento</p>
        </motion.div>

        <motion.div 
          className="card p-6 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <Clock size={32} className="text-warning mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-warning">
            {mockTournaments.filter(t => t.status === 'upcoming').length}
          </h3>
          <p className="text-gray-400">Próximos</p>
        </motion.div>

        <motion.div 
          className="card p-6 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <Star size={32} className="text-gray-400 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-400">
            {mockTournaments.filter(t => t.status === 'finished').length}
          </h3>
          <p className="text-gray-400">Finalizados</p>
        </motion.div>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTournaments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum torneio encontrado.</p>
          </div>
        ) : (
          filteredTournaments.map((tournament) => (
            <motion.div
              key={tournament.id}
              className="card overflow-hidden card-hover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <img 
                  src={tournament.image} 
                  alt={tournament.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${getStatusColor(tournament.status)}`}>
                    {getStatusIcon(tournament.status)}
                    <span>{getStatusText(tournament.status)}</span>
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{tournament.name}</h3>
                <p className="text-gray-400 mb-4">{tournament.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Trophy size={14} className="mr-2" />
                    <span>{tournament.sport}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-400">
                    <Calendar size={14} className="mr-2" />
                    <span>{tournament.startDate} - {tournament.endDate}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-400">
                    <MapPin size={14} className="mr-2" />
                    <span>{tournament.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-400">
                    <Users size={14} className="mr-2" />
                    <span>{tournament.participants} participantes</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-secondary-light">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Premiação</span>
                    <span className="font-bold text-primary">{tournament.prize}</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 btn btn-primary">
                  VER DETALHES
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default TournamentsPage;