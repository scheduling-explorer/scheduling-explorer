// STCF
function shortestJobToCompletionFirst(tasks, _) {
  var task = { durationLeft: 9999 };
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].durationLeft < task.durationLeft) {
      task = tasks[i];
    }
  }
  return task;
}
