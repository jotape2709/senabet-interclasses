import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const TournamentsPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        className="card p-8 text-center max-w-xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-warning/20 flex items-center justify-center">
          <Trophy size={28} className="text-warning" />
        </div>
        <h1 className="text-2xl font-heading font-bold mb-2">Campeonato em breve</h1>
        <p className="text-gray-400">
          Estamos preparando tudo! Em breve você poderá acompanhar aqui o interclasses, tabelas e resultados.
        </p>
      </motion.div>
    </div>
  );
};

export default TournamentsPage;