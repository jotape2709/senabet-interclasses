import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, BookOpen, Users, TrendingUp } from 'lucide-react';
import { db } from '../lib/firebase'; // Assuming you have firebase configured in this path
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

interface Challenge {
  id?: string;
  question: string;
  options: string[];
  correct_answer: string;
  subject: string;
  difficulty: string;
  created_at: any;
}

export default function AdminPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: '',
    subject: 'matematica',
    difficulty: 'medium'
  });

  // NOTE: Replace with your actual authentication logic
  const user = { uid: "placeholder-user-id" }; // Placeholder for user
  const profile = { role: "admin" }; // Placeholder for profile

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchChallenges();
    }
  }, [profile]);

  const fetchChallenges = async () => {
    try {
      const challengesCollection = collection(db, 'challenges');
      const q = query(challengesCollection, orderBy('created_at', 'desc'));
      const challengesSnapshot = await getDocs(q);
      const challengesData = challengesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Challenge[];
      setChallenges(challengesData);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const text = await file.text();
      const challengesData = JSON.parse(text);

      if (!Array.isArray(challengesData)) {
        throw new Error('File must contain an array of challenges');
      }

      for (const challenge of challengesData) {
        await addDoc(collection(db, 'challenges'), {
          ...challenge,
          created_by: user?.uid,
          created_at: serverTimestamp()
        });
      }

      alert(`Successfully uploaded ${challengesData.length} challenges!`);
      fetchChallenges();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please check the format.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleAddChallenge = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'challenges'), {
        question: newChallenge.question,
        options: newChallenge.options.filter(opt => opt.trim() !== ''),
        correct_answer: newChallenge.correct_answer,
        subject: newChallenge.subject,
        difficulty: newChallenge.difficulty,
        created_by: user?.uid,
        created_at: serverTimestamp()
      });

      setNewChallenge({
        question: '',
        options: ['', '', '', ''],
        correct_answer: '',
        subject: 'matematica',
        difficulty: 'medium'
      });

      alert('Challenge added successfully!');
      fetchChallenges();
    } catch (error) {
      console.error('Error adding challenge:', error);
      alert('Error adding challenge');
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;

    try {
      await deleteDoc(doc(db, 'challenges', id));
      fetchChallenges();
      alert('Challenge deleted successfully!');
    } catch (error) {
      console.error('Error deleting challenge:', error);
      alert('Error deleting challenge');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have administrator privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage challenges and monitor system activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Challenges</p>
                <p className="text-2xl font-bold text-gray-900">{challenges.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Daily Bonuses</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Challenges */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Challenge Bank</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Upload a JSON file with multiple challenges
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } cursor-pointer`}
              >
                {uploading ? 'Uploading...' : 'Choose File'}
              </label>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p className="font-medium">JSON Format Example:</p>
              <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`[
  {
    "question": "Qual é 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correct_answer": "4",
    "subject": "matematica",
    "difficulty": "easy"
  }
]`}
              </pre>
            </div>
          </div>

          {/* Add Single Challenge */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Single Challenge</h2>
            <form onSubmit={handleAddChallenge} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <textarea
                  value={newChallenge.question}
                  onChange={(e) => setNewChallenge({...newChallenge, question: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options
                </label>
                {newChallenge.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newChallenge.options];
                      newOptions[index] = e.target.value;
                      setNewChallenge({...newChallenge, options: newOptions});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer
                </label>
                <input
                  type="text"
                  value={newChallenge.correct_answer}
                  onChange={(e) => setNewChallenge({...newChallenge, correct_answer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={newChallenge.subject}
                    onChange={(e) => setNewChallenge({...newChallenge, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="matematica">Matemática</option>
                    <option value="algebra">Álgebra</option>
                    <option value="geometria">Geometria</option>
                    <option value="historia">História</option>
                    <option value="geografia">Geografia</option>
                    <option value="literatura">Literatura</option>
                    <option value="ciencias">Ciências</option>
                    <option value="conhecimentos-gerais">Conhecimentos Gerais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newChallenge.difficulty}
                    onChange={(e) => setNewChallenge({...newChallenge, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Challenge
              </button>
            </form>
          </div>
        </div>

        {/* Challenges List */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Challenge Bank</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center">Loading challenges...</div>
            ) : challenges.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No challenges found</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {challenges.map((challenge) => (
                    <tr key={challenge.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {challenge.question.length > 100 
                          ? `${challenge.question.substring(0, 100)}...` 
                          : challenge.question}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {challenge.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {challenge.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteChallenge(challenge.id!)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
