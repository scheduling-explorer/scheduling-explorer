// configuration for algorithms.
var mlfqConfig = {
  priorityBoost: false,
  priorityBoostInterval: 5,
  rrInterval: 2,
  numQueues: 3,
  maxTimeInQueue: 1,
};
var rrConfig = {
  rrInterval: 2,
};

// Algorithms
const ALGORITHM_FIFO = "fifo";
const ALGORITHM_LIFO = "lifo";
const ALGORITHM_SJF = "sjf";
const ALGORITHM_STCF = "STCF";
const ALGORITHM_RR = "rr";
const ALGORITHM_MLFQ = "mlfq";

var algorithm = ALGORITHM_FIFO;
var tasks = [];
var running;
var interval;

// Workflows
const SYSTEM_PC = "pc";
const SYSTEM_WEBSERVER = "webserver";
const SYSTEM_SUPERCOMPUTER = "supercomputer";
const SYSTEM_PHONE = "phone";
const SYSTEM_MANUAL = "manual";

var system = SYSTEM_PC;

// Catalog for auto add tasks for each system.
const tasksCatalog = {
  pc: [
    {
      name: "Spotify",
      duration: 1,
      color: "green",
    },
    {
      name: "Spotify Download",
      duration: 3,
      color: "pink",
    },
    {
      name: "Windows Defender Auto Update Manager",
      duration: 7,
      color: "red",
    },
    {
      name: "Keyboard Event",
      duration: 1,
      color: "yellow",
    },
    {
      name: "Microsoft Teams Helper",
      duration: 3,
      color: "purple",
    },
    {
      name: "User Python Program",
      duration: 2,
      color: "darkblue",
    },
  ],
  supercomputer: [
    {
      name: "Compute Millionth Billionth Digit of Pi",
      duration: 50,
      color: "green",
    },
  ],
  phone: [
    {
      name: "touch event",
      duration: 1,
      color: "green",
    },
    {
      name: "background email refresh",
      duration: 2,
      color: "brown",
    },
    {
      name: "background whatsapp refresh",
      duration: 2,
      color: "pink",
    },
    {
      name: "secretly upload location to Facebook",
      duration: 2,
      color: "blue",
    },
    {
      name: "index photos",
      duration: 4,
      color: "red",
    },
    {
      name: "pull current time",
      duration: 1,
      color: "yellow",
    },
    {
      name: "background refresh podcasts",
      duration: 3,
      color: "purple",
    },
  ],
  webserver: [
    {
      name: "Web Request",
      duration: 2,
      color: "green",
    },
    {
      name: "Background Processing",
      duration: 5,
      color: "blue",
    },
  ],
  manual: [],
};

var avgResponseTime = 0;
var avgTurnAroundTime = 0;

// ms per cycle, 1000/`cycleDuration` = refresh rate. Default 100Hz
const cycleDuration = 10;

// ms it takes for a slot to complete.
var slotDuration = 2000;

// number of slots on screen.
const numSlots = 10;

var cycle = 0;
var planning;
var currentItem = undefined; // wordt: { taskId: , queue: }

// loop in advance in a copied planning, so that we can visualize
// the future in the UI.
function makePlanning() {
  var planning = [];

  // Create planning, simulate running.
  var tasksCopy = tasks
    .filter((t) => t.durationLeft > 0)
    .map((a) => Object.assign({}, a));

  taskIndex = 0;
  mlfqDict = {};

  var timeSlot = 0;
  while (tasksCopy.length > 0) {
    var task;
    var queue = 0;

    switch (algorithm) {
      case ALGORITHM_FIFO:
        task = fifo(tasksCopy, timeSlot);
        break;
      case ALGORITHM_LIFO:
        task = lifo(tasksCopy, timeSlot);
        break;
      case ALGORITHM_SJF:
        task = shortestJobFirst(tasksCopy, timeSlot);
        break;
      case ALGORITHM_STCF:
        task = shortestJobToCompletionFirst(tasksCopy, timeSlot);
        break;
      case ALGORITHM_RR:
        task = roundRobin(tasksCopy, timeSlot, rrConfig);
        break;
      case ALGORITHM_MLFQ:
        const result = mlfq(tasksCopy, timeSlot, mlfqConfig);
        task = result.task;
        queue = result.queue;
        break;
      default:
        break;
    }

    task.durationLeft--;
    if (task.durationLeft <= 0) {
      // remove task from list if it's done.
      tasksCopy = tasksCopy.filter((t) => t.id !== task.id);
    }

    timeSlot++;

    planning.push({ queue: queue, taskId: task.id });
  }

  return planning;
}

// update algorithm text in ui.
function updateAlgorithmText() {
  const p = document.getElementById("algo-description");
  p.textContent = algorithm;
  switch (algorithm) {
    case ALGORITHM_FIFO:
      p.textContent =
        "The First In First Out (FIFO) algorithm completes every job in order of arrival.";
      break;
    case ALGORITHM_LIFO:
      p.textContent =
        "The Last in First Out (LIFO) algorithm completes every job in inverse order of arrival.";
      break;
    case ALGORITHM_SJF:
      p.textContent =
        "The Shortest Job First (SJF) algorithm completes every job in order of time the job takes from shortest to longest.";
      break;
    case ALGORITHM_STCF:
      p.textContent =
        "The Shortest Job to Completion First (STCF) algorithm checks every time a new job is added which job has the shortest time to completion and finishes that first until there are no more jobs left.";
      break;
    case ALGORITHM_RR:
      p.textContent =
        "The Round Robin (RR) algorithm runs all jobs for a decided time slices and switches between the jobs until they are all finished.";
      break;
    case ALGORITHM_MLFQ:
      p.textContent =
        "The Multi-level Feedback Queue (MLFQ) algorithm runs jobs based on assigned priority levels from high to low. Jobs with the same priority level run according to a Round Robin algorithm. The key to this algorithm is that it “learns” from the historical behaviour of processes to make predictions about the future in order to optimize performance.";
      break;
    default:
      break;
  }
}

// update video for each algorithvideo for each algorithm
function updateAlgorithmVideo() {
  const iFrame = document.getElementById("algo-video");
  switch (algorithm) {
    case ALGORITHM_FIFO:
      iFrame.src = "https://www.youtube.com/embed/OcSy8uVO5yE";
      break;
    case ALGORITHM_LIFO:
      iFrame.src = "https://www.youtube.com/embed/OcSy8uVO5yE";
      break;
    case ALGORITHM_SJF:
      iFrame.src = "https://www.youtube.com/embed/OLgm0T0-XSY";
      break;
    case ALGORITHM_STCF:
      iFrame.src = "https://www.youtube.com/embed/NUscSStRKVk";
      break;
    case ALGORITHM_RR:
      iFrame.src = "https://www.youtube.com/embed/ga2C1stBOPA";
      break;
    case ALGORITHM_MLFQ:
      iFrame.src = "https://www.youtube.com/embed/34iLv_66_Z0";
      break;
    default:
      break;
  }
}

// Redraw number of queues. (usually 1 when algorithm is not mlfq)
function redrawQueues() {
  const numQueues = algorithm === ALGORITHM_MLFQ ? mlfqConfig.numQueues : 1;
  const queuesE = document.getElementById("queues");
  queuesE.innerHTML = "";

  for (var i = 0; i < numQueues; i++) {
    queuesE.innerHTML += `<div class="queue" id="queue-${i + 1}"></div>`;
  }

  document.getElementById("mlfq-num-queues").value = mlfqConfig.numQueues;
}

// redraw all tasks
function redrawTasks() {
  // remove all tasks
  const tasksDOM = document.querySelectorAll(".task");
  for (var i = 0; i < tasksDOM.length; i++) {
    if (!tasksDOM[i].classList.contains("task-active")) {
      tasksDOM[i].remove();
    }
  }

  // add existing tasks
  const slotWidth = 100 / numSlots;
  var widthDrawn = 0;

  if (currentItem !== undefined) {
    const { taskId: currentTaskId, queue: currentQueue } = currentItem;
    const currentTask = tasks.find((t) => t.id === currentTaskId);
    const cyclesPerSlot = slotDuration / cycleDuration;
    var fractionOfSlotCovered = (cycle % cyclesPerSlot) / cyclesPerSlot;
    if (fractionOfSlotCovered == 0 && cycle !== 0) {
      fractionOfSlotCovered = 1;
    }
    width = (1 - fractionOfSlotCovered) * slotWidth;

    var border = false;
    if (planning.length > 0 && currentItem.taskId !== planning[0].taskId) {
      border = true;
    }

    addTask(currentTask, currentQueue, width, false, border);

    widthDrawn += width;
  }

  // add all future tasks
  var i = 0;
  while (i < planning.length && widthDrawn < 100) {
    const task = tasks.find((t) => t.id === planning[i].taskId);

    var border = false;
    if (i > 0 && planning[i - 1].taskId !== planning[i].taskId) {
      border = true;
    }

    addTask(task, planning[i].queue, slotWidth, border, false);

    widthDrawn += 10;
    i++;
  }
}

// redraw timeline.
function redrawTimeline() {
  // - Update time indicator on screen.
  const time = (cycle * cycleDuration) / 1000;
  document.getElementById("t").textContent = time.toFixed(2);

  // - Update timeline.
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  // Get timestamp for first maker on screen.
  const ms = cycle * cycleDuration;
  const firstMarker = Math.floor(ms / slotDuration);

  // Calculate margin for first marker on screen.
  const cyclesPerSlot = slotDuration / cycleDuration;
  const slotWidth = 100 / numSlots;
  const dx = slotWidth / cyclesPerSlot;
  const newMargin =
    ((-(cycle * cycleDuration) % slotDuration) / slotDuration) * slotWidth;

  // Draw timeline in DOM.
  for (var i = 0; i <= numSlots; i++) {
    timeline.innerHTML += `<div class="timeline-item" style="min-width: ${
      100 / numSlots
    }%; margin-left: ${i === 0 ? newMargin : 0}%;">${(
      ((firstMarker + i) * slotDuration) /
      1000
    ).toFixed(1)}</div>`;
  }
}

// add a task to the history.
function addTaskToHistory(task) {
  const history = document.getElementById("history-table");
  history.innerHTML =
    `
    <tr>
      <th scope="row">
        <div class="square square-${task.color}"></div>
        ${task.name}
      </th>
      <td>${task.durationTotal}</td>
      <td>${task.startTime}-${task.endTime}</td>
      <td>${task.startTime - task.insertTime}</td>
      <td>${task.endTime - task.insertTime}</td>
    </tr>
  ` + history.innerHTML;
}

// update the metrics.
function updateStats() {
  var totalResponseTime = 0;
  var totalTurnAroundTime = 0;
  var numCompletedTasks = 0;

  for (var i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task["durationLeft"] === 0) {
      numCompletedTasks++;
      totalResponseTime += task.startTime - task.insertTime;
      totalTurnAroundTime += task.endTime - task.insertTime;
    }
  }

  if (numCompletedTasks > 0) {
    avgTurnAroundTime = totalTurnAroundTime / numCompletedTasks;
    avgResponseTime = totalResponseTime / numCompletedTasks;
  } else {
    avgTurnAroundTime = 0;
    avgResponseTime = 0;
  }

  document.getElementById("response-time").textContent =
    avgResponseTime.toFixed(2);
  document.getElementById("turnaround-time").textContent =
    avgTurnAroundTime.toFixed(2);
}

// Auto add tasks to task list & replan.
var autoAddTasksDuration = {}; // how long we've ran each task on auto mode.

// auto add tasks for a particular system.
function autoAdd() {
  // Find task with shortest duration in auto add.
  var shortestRanTask = tasksCatalog[system][0];
  for (var i = 0; i < tasksCatalog[system].length; i++) {
    const task = tasksCatalog[system][i];
    if (
      autoAddTasksDuration[task.name] <
      autoAddTasksDuration[shortestRanTask.name]
    ) {
      shortestRanTask = task;
    }
  }

  // We run it.
  autoAddTasksDuration[shortestRanTask.name] += shortestRanTask.duration;

  // Add real task to list.
  const id = generateUUID();
  const taskDuration = shortestRanTask.duration;

  const task = {
    name: `${shortestRanTask.name} job ${id}`,
    color: shortestRanTask.color,
    durationLeft: taskDuration,
    durationTotal: taskDuration,
    id: id,
    insertTime: (cycle * cycleDuration) / 1000,
  };

  tasks.push(task);
  planning = makePlanning();
}

// auto fill tasks from scratch.
function autoFillTasks() {
  autoAddTasksDuration = {};

  for (var i = 0; i < tasksCatalog[system].length; i++) {
    const task = tasksCatalog[system][i];
    autoAddTasksDuration[task.name] = 0;
  }

  if (system !== SYSTEM_MANUAL) {
    while (tasks.map((t) => t.durationLeft).reduce((a, b) => a + b, 0) <= 50) {
      autoAdd();
    }
  }
}

// update data, updateFrame will reflect this in UI.
function updateSlot() {
  const currentTime = ((cycle * cycleDuration) / 1000).toFixed(0);

  // Add previous item to history, if it was last item for its task.
  if (currentItem !== undefined) {
    const { taskId: previousTaskId, queue: previousQueue } = currentItem;
    const previousTask = tasks.find((t) => t.id === previousTaskId);
    if (previousTask.durationLeft === 0) {
      previousTask["endTime"] = currentTime;
      addTaskToHistory(previousTask);
    }
  }

  updateStats();

  // Update currentItem.
  currentItem = planning.shift();
  if (currentItem !== undefined) {
    const { taskId: currentTaskId } = currentItem;
    const currentTask = tasks.find((t) => t.id === currentTaskId);
    if (currentTask["startTime"] === undefined) {
      currentTask["startTime"] = currentTime;
    }
    currentTask.durationLeft--;
  }

  if (system !== SYSTEM_MANUAL) {
    // compute total duration left of current tasks
    var duration = 0;
    for (var i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      duration += task.durationLeft;
    }

    // add task from if duration left is less than screen, so we always have a task on screen.
    const screenDuration = (slotDuration * numSlots) / 1000;
    if (duration < screenDuration) {
      autoFillTasks();
    }
  }
}

// Update screen, as often as we can with requestAnimationFrame.
function updateFrame() {
  redrawTasks();
  redrawTimeline();

  if (running) {
    requestAnimationFrame(updateFrame);
  }
}

// Run each cycle. updateFrame will reflect in UI.
function updateCycle() {
  // Time slot is over.
  if ((cycle * cycleDuration) % slotDuration === 0) {
    updateSlot();
  }

  // Pause after 50 slots.
  if ((cycle * cycleDuration) / slotDuration === 50) {
    pause();

    // Show explainer alert.
    if (!localStorage.getItem("50-sec-alert-shown")) {
      var myModal = new bootstrap.Modal(
        document.getElementById("50-sec-modal"),
        {}
      );
      myModal.show();

      localStorage.setItem("50-sec-alert-shown", true);
    }
  }

  cycle++;
}

// start simulation.
function start() {
  document.getElementById("start-btn").disabled = true;
  document.getElementById("pause-btn").disabled = false;

  interval = setInterval(updateCycle, cycleDuration);
  updateCycle();

  running = true;
  requestAnimationFrame(updateFrame);
}

// pause, so the user can continue afterwards.
function pause() {
  document.getElementById("start-btn").disabled = false;
  document.getElementById("pause-btn").disabled = true;

  running = false;
  clearInterval(interval);
}

// reset all properties; the user stars over.
function reset() {
  pause();
  cycle = 0;
  colorIndex = 0;

  // reset algo caches.
  taskIndex = 0;
  mlfqDict = {};

  tasks = [];

  updateAlgorithmText();
  redrawQueues();
  updateAlgorithmVideo();

  autoFillTasks();

  planning = makePlanning();
  currentItem = undefined;

  // reset dom.
  const history = document.getElementById("history-table");
  history.innerHTML = "";
  document.getElementById("response-time").textContent = "0.00";
  document.getElementById("turnaround-time").textContent = "0.00";

  updateFrame();
}

// add task (maybe transparent) to each queue in DOM.
function addTask(task, queue, width, borderLeft, borderRight) {
  const queues = document.querySelectorAll(".queue");
  const numQueues = algorithm === ALGORITHM_MLFQ ? mlfqConfig.numQueues : 1;

  for (var i = 0; i < numQueues; i++) {
    queues[i].innerHTML += `<div class="task ${
      i === queue ? "task-" + task.color : ""
    }" data-task-id=${task.id} style="min-width: ${width}%; border-left: ${
      borderLeft ? 1 : 0
    }px solid black; border-right: ${
      borderRight ? 1 : 0
    }px solid black"></div>`;
  }
}

// read input, add task, replan, continue.
function createTask() {
  // Read and clear fields.
  const name = document.getElementById("task-name").value;
  document.getElementById("task-name").value = "";

  const duration = document.getElementById("task-duration").value;
  document.getElementById("task-duration").value = "";

  const task = {
    name: name,
    color: nextColor(),
    durationLeft: duration,
    durationTotal: duration,
    id: generateUUID(),
    insertTime: (cycle * cycleDuration) / 1000,
  };

  tasks.push(task);
  planning = makePlanning();
  redrawTasks();
}

reset();
