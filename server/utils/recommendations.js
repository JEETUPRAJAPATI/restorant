/**
 * Get platter recommendations based on budget, party size, and preferences
 * @param {Array} platters - List of all platters
 * @param {number} budget - Per-person budget
 * @param {number} partySize - Number of people
 * @param {Array} preferences - List of dietary preferences
 * @returns {Array} List of recommended platters
 */
const getPlatterRecommendations = (platters, budget, partySize, preferences = []) => {
  try {
    if (!platters || platters.length === 0) {
      return [];
    }

    const totalBudget = budget * partySize;
    
    // Calculate cost per person for each platter
    const plattersWithCost = platters.map(platter => {
      const servingCapacity = platter.servingSize;
      const plattersNeeded = Math.ceil(partySize / servingCapacity);
      const totalCost = platter.price * plattersNeeded;
      const costPerPerson = totalCost / partySize;
      
      return {
        ...platter.toObject ? platter.toObject() : platter,
        plattersNeeded,
        totalCost,
        costPerPerson,
        isWithinBudget: costPerPerson <= budget
      };
    });

    // Filter platters that are within budget
    let eligiblePlatters = plattersWithCost.filter(platter => platter.isWithinBudget);
    
    // If no platters are within budget, return the cheapest options
    if (eligiblePlatters.length === 0) {
      const sortedByCost = [...plattersWithCost].sort((a, b) => a.costPerPerson - b.costPerPerson);
      return sortedByCost.slice(0, 3);
    }
    
    // Apply preference filters if any
    if (preferences && preferences.length > 0) {
      // Filter platters that match at least one preference
      const preferencePlatters = eligiblePlatters.filter(platter => 
        preferences.some(pref => 
          platter.tags && platter.tags.includes(pref)
        )
      );
      
      // If we have preference matches, use those
      if (preferencePlatters.length > 0) {
        eligiblePlatters = preferencePlatters;
      }
    }
    
    // Sort eligible platters by a score based on:
    // 1. How close they are to the budget (higher is better but not over)
    // 2. Serving size efficiency (closer to party size is better)
    // 3. Rating (higher is better)
    const scoredPlatters = eligiblePlatters.map(platter => {
      // Budget utilization score (0-1)
      const budgetScore = platter.costPerPerson / budget;
      
      // Serving efficiency score (0-1)
      const servingEfficiency = 1 - Math.abs(platter.servingSize - partySize) / partySize;
      const servingScore = servingEfficiency > 0 ? servingEfficiency : 0.1;
      
      // Rating score (0-1)
      const ratingScore = platter.rating / 5;
      
      // Combined score (weighted)
      const score = (budgetScore * 0.5) + (servingScore * 0.3) + (ratingScore * 0.2);
      
      return {
        ...platter,
        score
      };
    });
    
    // Sort by score (descending)
    scoredPlatters.sort((a, b) => b.score - a.score);
    
    // Return top 3 recommendations
    return scoredPlatters.slice(0, 3);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
};

module.exports = {
  getPlatterRecommendations
};
