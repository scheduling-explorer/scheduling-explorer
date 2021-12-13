//mlfq

var mlfqDict = {};

function mlfq(tasks, t, config) {
  // If priorityboost is on, clear mlfqDict so the next loop can boost all tasks
  if(t % config.priorityBoostInterval === 0 && config.priorityBoost) {
    mlfqDict = {}
  }
  
  // Every new task is put in the highest queue.
  for (var i = 0; i < tasks.length; i++) {
    if (!(tasks[i].id in mlfqDict)) {
      mlfqDict[tasks[i].id] = { currentQueue: 0, timeSpent: 0 };
    }
  }

  // Find highest queue that currently contains tasks
  var maxQueue = config.numQueues; // number of queues
  for (var i = 0; i < tasks.length; i++) {
    const currentTaskId = tasks[i].id;
    const taskDict = mlfqDict[currentTaskId];
    const queue = taskDict.currentQueue;
    if (queue < maxQueue) {
      maxQueue = queue;
    }
  }

  // Create a list that contains all tasks in the highest queue
  var maxQueueTasks = [];
  for (var i = 0; i < tasks.length; i++) {
    const currentTask = tasks[i];
    const taskDict = mlfqDict[currentTask.id];
    const queue = taskDict["currentQueue"];
    if (queue === maxQueue) {
      maxQueueTasks.push(currentTask);
    }
  }

  // If maxQueueTasks contains only one task, taskIndex = 0;
  // Resets RR for the next queue.
  if (maxQueueTasks.length == 1) {
    taskIndex = 0;
  }

  // Get current task to execute and remember it has spent this in this queue.
  const taskToExecute = roundRobin(maxQueueTasks, t, config);
  const taskDict = mlfqDict[taskToExecute.id];
  taskDict["timeSpent"]++;

  // Check if the task is exceeding its time in this queue. If it is, bump its queue.
  var queue = taskDict["currentQueue"];
  var timeSpent = taskDict["timeSpent"];
  if (timeSpent > config.maxTimeInQueue) {
    if (queue < config.numQueues - 1) {
      taskDict["currentQueue"] += 1;
    }
  }

  return {
    task: taskToExecute,
    queue: taskDict["currentQueue"],
  };
}
