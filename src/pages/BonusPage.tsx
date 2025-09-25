import React, { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";

const BonusPage: React.FC = () => {
  const { addDailyReward } = useAuthContext();
  const [message, setMessage] = useState("");

  const handleReward = async () => {
    const result = await addDailyReward();
    if (result.success) {
      setMessage("🎉 Recompensa diária adicionada com sucesso!");
    } else {
      setMessage("❌ Erro ao adicionar recompensa: " + result.error);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Resgatar Recompensa</h1>
      <button 
        onClick={handleReward} 
        className="btn btn-primary px-6 py-3"
      >
        Receber Recompensa
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default BonusPage;
