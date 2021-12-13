// rr
var taskIndex = 0;

function roundRobin(tasks, t, config) {
  var timeslice = config.rrInterval;
  var taskToExecute = tasks[taskIndex];
  
  // Every time a timeslice passes, go to next task.
  if ((t+1) % timeslice === 0) {
    taskIndex++;
  }

  // Start from 0 when we've had all tasks.
  if (taskIndex >= tasks.length) {
    taskIndex = 0;
  }

  // Go to 'next' task when this task is done after this run (the array shifts to
  // the left after the task is removed, so keep taskIndex the same. Compensate
  // for task += 1 above.).
  if (taskToExecute.durationLeft <= timeslice) {//timeslice) {
    taskIndex = Math.max(0, taskIndex - 1);
  }

  return taskToExecute;
}
