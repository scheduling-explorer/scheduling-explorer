// sjf
function shortestJobFirst(tasks, _) {
  var task = { durationTotal: 9999 };
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].durationTotal < task.durationTotal) {
      task = tasks[i];
    }
  }
  return task;
}
