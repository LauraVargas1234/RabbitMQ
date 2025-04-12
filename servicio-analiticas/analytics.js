const stats = {
    totalMessages: 0,
    clients: {},
    lastUpdated: null
  };
  
  function processData(message) {
    stats.totalMessages++;
    
    if (!stats.clients[message.clientId]) {
      stats.clients[message.clientId] = 0;
    }
    
    stats.clients[message.clientId]++;
    stats.lastUpdated = new Date().toISOString();
    
    console.log('Estadísticas actualizadas:', stats);
  }
  
  function getStats() {
    return stats;
  }
  
  module.exports = {
    processData,
    getStats
  };