/* interfaces.js: event listeners and input handler

*/

// start/stop/reset buttons
document.getElementById("start-btn").addEventListener("click", function () {
  start();
});
document.getElementById("pause-btn").addEventListener("click", function () {
  pause();
});
document.getElementById("reset-btn").addEventListener("click", function () {
  reset();
});

// create task button
document
  .getElementById("create-task-btn")
  .addEventListener("click", function () {
    createTask();
  });

// select algorithm
document
  .getElementById("algorithm-selector")
  .addEventListener("change", function (event) {
    // Set algorithm.
    switch (event.target.value) {
      case ALGORITHM_STCF:
        algorithm = ALGORITHM_STCF;
        break;
      case ALGORITHM_FIFO:
        algorithm = ALGORITHM_FIFO;
        break;
      case ALGORITHM_SJF:
        algorithm = ALGORITHM_SJF;
        break;
      case ALGORITHM_RR:
        algorithm = ALGORITHM_RR;
        break;
      case ALGORITHM_MLFQ:
        algorithm = ALGORITHM_MLFQ;
        break;
      case ALGORITHM_LIFO:
        algorithm = ALGORITHM_LIFO;
        break;
      default:
        algorithm = ALGORITHM_FIFO;
        break;
    }

    // Replan.
    planning = makePlanning();

    // Redraw UI.
    redrawQueues();
    updateFrame();
    updateAlgorithmText();
    updateAlgorithmVideo();

    // Show/hide config.
    document.getElementById("rr-config").style.display =
      algorithm === ALGORITHM_RR ? "block" : "none";
    document.getElementById("mlfq-config").style.display =
      algorithm === ALGORITHM_MLFQ ? "block" : "none";
  });

// select system
document
  .getElementById("system-selector")
  .addEventListener("change", function (event) {
    switch (event.target.value) {
      case SYSTEM_PC:
        system = SYSTEM_PC;
        break;
      case SYSTEM_PHONE:
        system = SYSTEM_PHONE;
        break;
      case SYSTEM_SUPERCOMPUTER:
        system = SYSTEM_SUPERCOMPUTER;
        break;
      case SYSTEM_WEBSERVER:
        system = SYSTEM_WEBSERVER;
        break;
      case SYSTEM_MANUAL:
        system = SYSTEM_MANUAL;
        break;
      default:
        system = SYSTEM_PC;
        break;
    }

    document.getElementById("add-task-card").style.display =
      system === SYSTEM_MANUAL ? "block" : "none";

    reset();
    updateFrame();
  });

// change the slot duration.
document
  .getElementById("slot-duration")
  .addEventListener("change", function (event) {
    if (event.target.value !== "") {
      var newSlotDuration = parseInt(event.target.value);
      if (newSlotDuration < 1) {
        newSlotDuration = 1;
        document.getElementById("slot-duration").value = newSlotDuration;
      }
      slotDuration = newSlotDuration * 1000;

      planning = makePlanning();
      updateFrame();
    }
  });

// ----------------------------------------------------------------------------
//                                   RR Config
// ----------------------------------------------------------------------------
document
  .getElementById("rr-interval")
  .addEventListener("change", function (event) {
    rrConfig.rrInterval = event.target.value;
    planning = makePlanning();
    updateFrame();
  });

// ----------------------------------------------------------------------------
//                                  MLFQ Config
// ----------------------------------------------------------------------------
document
  .getElementById("mlfq-priority-boost")
  .addEventListener("change", function (event) {
    mlfqConfig.priorityBoost = event.target.checked;
    planning = makePlanning();
    updateFrame();
  });

document
  .getElementById("mlfq-rr-interval")
  .addEventListener("change", function (event) {
    if (event.target.value !== "") {
      var newRRInterval = parseInt(event.target.value);
      if (newRRInterval < 1) {
        newRRInterval = 1;
        document.getElementById("mlfq-rr-interval").value = newRRInterval;
      }
      mlfqConfig.rrInterval = newRRInterval;

      planning = makePlanning();
      updateFrame();
    }
  });

document
  .getElementById("mlfq-num-queues")
  .addEventListener("change", function (event) {
    if (event.target.value !== "") {
      var newNumQueues = parseInt(event.target.value);
      if (newNumQueues < 1) {
        newNumQueues = 1;
        document.getElementById("mlfq-num-queues").value = newNumQueues;
      }
      mlfqConfig.numQueues = newNumQueues;

      redrawQueues();

      planning = makePlanning();
      updateFrame();
    }
  });

document
  .getElementById("mlfq-priority-boost-interval")
  .addEventListener("change", function (event) {
    if (event.target.value !== "") {
      var newPriorityBoostInterval = parseInt(event.target.value);
      if (newPriorityBoostInterval < 1) {
        newPriorityBoostInterval = 1;
        document.getElementById("mlfq-priority-boost-interval").value =
          newPriorityBoostInterval;
      }
      mlfqConfig.numQueues = newPriorityBoostInterval;

      planning = makePlanning();
      updateFrame();
    }
  });

// new user modal
if (!localStorage.getItem("shown")) {
  localStorage.setItem("shown", true);

  var myModal = new bootstrap.Modal(document.getElementById("noob-modal"), {});
  myModal.show();
}
