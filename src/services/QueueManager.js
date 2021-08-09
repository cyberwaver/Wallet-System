const queue = require("queue");

class QueueManager {
  constructor() {
    this.q = queue({ results: [], autostart: true, concurrency: 1 });
    this.q.start();
  }

  add(task) {
    this.q.push(task);
  }
}

module.exports = QueueManager;
