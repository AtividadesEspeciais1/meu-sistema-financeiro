const { useState, useEffect } = React;
const { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, Trash2, Calendar } = lucide;

function SistemaFinanceiro() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  };

  const saveData = (newTransactions) => {
    localStorage.setItem('transactions', JSON.stringify(newTransactions));
  };

  const addTransaction = () => {
    if (!description || !amount || !category) {
      alert('Preencha todos os campos!');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString()
    };

    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    saveData(updated);

    setDescription('');
    setAmount('');
    setCategory('');
  };

  const deleteTransaction = (id) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    saveData(updated);
  };

  const clearAll = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados?')) {
      setTransactions([]);
      localStorage.removeItem('transactions');
    }
  };

  const totals = transactions.reduce((acc, t) => {
    if (t.type === 'income') {
      acc.income += t.amount;
    } else {
      acc.expense += t.amount;
    }
    return acc;
  }, { income: 0, expense: 0 });

  const balance = totals.income - totals.expense;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Wallet className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Controle Financeiro</h1>
          </div>
          <p className="text-purple-200">Gerencie suas finanças de forma simples e eficiente</p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100 text-sm font-medium">Receitas</span>
              <TrendingUp className="w-5 h-5 text-green-100" />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(totals.income)}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-100 text-sm font-medium">Despesas</span>
              <TrendingDown className="w-5 h-5 text-red-100" />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(totals.expense)}</p>
          </div>

          <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-xl p-6 shadow-xl`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-medium">Saldo</span>
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(balance)}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Nova Transação</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setType('income')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  type === 'income'
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Receita
              </button>
              <button
                onClick={() => setType('expense')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  type === 'expense'
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Despesa
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-purple-400"
            />
            
            <input
              type="number"
              placeholder="Valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-purple-400"
            />
            
            <input
              type="text"
              placeholder="Categoria"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-purple-400"
            />
          </div>

          <button
            onClick={addTransaction}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Transação
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Histórico</h2>
            {transactions.length > 0 && (
              <button
                onClick={clearAll}
                className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Limpar tudo
              </button>
            )}
          </div>

          {transactions.length === 0 ? (
            <p className="text-center text-white/60 py-8">Nenhuma transação registrada</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white/5 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{transaction.description}</span>
                      <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/70">
                        {transaction.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Calendar className="w-3 h-3" />
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-bold ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </span>
                    
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="text-center mt-8 pb-8">
          <p className="text-white/50 text-sm">Seus dados são salvos localmente no navegador</p>
        </footer>
      </div>
    </div>
  );
}

ReactDOM.render(<SistemaFinanceiro />, document.getElementById('root'));
