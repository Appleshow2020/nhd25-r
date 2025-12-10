window.ProblemManager = {
  async loadProblems() {
    try {
      const result = await trickleListObjects('problem', 100, true);
      return result.items.map(item => ({
        id: item.objectId,
        ...item.objectData
      }));
    } catch (error) {
      console.error('Error loading problems:', error);
      return [];
    }
  },

  async saveProblem(problemData) {
    try {
      await trickleCreateObject('problem', {
        question: problemData.question,
        answer: problemData.answer,
        hint: problemData.hint || '',
        image: problemData.image || '',
        showHint: problemData.showHint !== false,
        timeLimit: problemData.timeLimit || 480
      });
      this.cachedProblems = await this.loadProblems();
    } catch (error) {
      console.error('Error saving problem:', error);
      throw error;
    }
  },

  async updateProblem(problemId, problemData) {
    try {
      await trickleUpdateObject('problem', problemId, {
        question: problemData.question,
        answer: problemData.answer,
        hint: problemData.hint || '',
        image: problemData.image || '',
        showHint: problemData.showHint !== false,
        timeLimit: problemData.timeLimit || 480
      });
      this.cachedProblems = await this.loadProblems();
    } catch (error) {
      console.error('Error updating problem:', error);
      throw error;
    }
  },

  async deleteProblem(problemId) {
    try {
      await trickleDeleteObject('problem', problemId);
      this.cachedProblems = await this.loadProblems();
    } catch (error) {
      console.error('Error deleting problem:', error);
      throw error;
    }
  },

  getRandomProblem(usedIds = []) {
    const problems = this.cachedProblems || [];
    const available = problems.filter(p => !usedIds.includes(p.id));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  },

  cachedProblems: [],

  async loadSettings() {
    try {
      const result = await trickleListObjects('game_settings', 1, true);
      if (result.items.length > 0) {
        return result.items[0].objectData;
      }
      return this.getDefaultSettings();
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.getDefaultSettings();
    }
  },

  getDefaultSettings() {
    return {
      maxProblems: 3,
      defaultTimeLimit: 480,
      hintTimePenalty: 120,
      wrongAnswerPenalty: 120,
      rouletteItems: [
        { name: '1등: 에어팟', probability: 5 },
        { name: '2등: 스타벅스', probability: 15 },
        { name: '3등: 편의점', probability: 30 },
        { name: '꽝', probability: 50 }
      ]
    };
  },

  async saveSettings(settings) {
    try {
      const existing = await trickleListObjects('game_settings', 1, true);
      if (existing.items.length > 0) {
        const merged = { ...existing.items[0].objectData, ...settings };
        await trickleUpdateObject('game_settings', existing.items[0].objectId, merged);
      } else {
        const defaults = this.getDefaultSettings();
        await trickleCreateObject('game_settings', { ...defaults, ...settings });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }
};

(async () => {
  window.ProblemManager.cachedProblems = await window.ProblemManager.loadProblems();
})();
