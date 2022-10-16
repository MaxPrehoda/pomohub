import PomoSessionHandler from './session';

import { mockOneTask, mockTwoTasks, mockTaskId3 } from './session.mocks';

describe('PomoSessionHandler', () => {
  // before each test, create a new instance of PomoSessionHandler
  let pomoSessionHandler: PomoSessionHandler;
  beforeEach(() => {
    pomoSessionHandler = new PomoSessionHandler();

    pomoSessionHandler.sessionData = {
      isRunning: false,
      startingDateTime: new Date(),
      numberOfCyclesCompleted: 0,
      cycleArray: [],
      expectedCycleArray: [],
      endingDateTime: null,
    };

    pomoSessionHandler.lastCycle = pomoSessionHandler.sessionData.cycleArray[
      pomoSessionHandler.sessionData.cycleArray.length - 1
    ];

    jest.resetAllMocks();
  });

  it('should be able to start a new session', () => {
    const sessionData = pomoSessionHandler.startSession();
    expect(sessionData.isRunning).toBeTruthy();
  });

  it('should be able to add a new cycle to a session', () => {
    pomoSessionHandler.startSession();
    const cycleData = pomoSessionHandler.cycleStart(mockOneTask);
    expect(cycleData.cycleArray.length).toBe(1);
  });

  it('should be able to end a cycle, which should calculate the cycle duration in seconds', () => {
    const mockNumberOfSeconds = 60;
    pomoSessionHandler.startSession();
    pomoSessionHandler.cycleStart([]);
    jest.useFakeTimers();
    jest.advanceTimersByTime(mockNumberOfSeconds * 1000);
    const sessionData = pomoSessionHandler.cycleEnd();

    const measuredDuration = sessionData.cycleArray[sessionData.cycleArray.length - 1].cycleSecDur;
    if (measuredDuration === null) {
      throw new Error('cycleSecDur cannot be null.');
    }
    const roundedDuration = Math.round(measuredDuration);
    expect(roundedDuration).toBe(mockNumberOfSeconds);
  });

  it('should reflect all tasks that have been added during the cycle', () => {
    pomoSessionHandler.startSession();
    pomoSessionHandler.cycleStart(mockTwoTasks);
    const sessionData = pomoSessionHandler.updateExistingCycle({
      tasks: mockTwoTasks,
      cycleStart: new Date(),
      cycleEnd: null,
      cycleSecDur: null
    });
    expect(sessionData.cycleArray.length === 1);
    expect(sessionData.cycleArray[sessionData.cycleArray.length - 1].tasks.length).toBe(2);
  });

  it('should be able to mark a task as deleted', () => {
    pomoSessionHandler.startSession();
    pomoSessionHandler.cycleStart(mockOneTask);
    pomoSessionHandler.updateTaskStatusInCurrentCycle(1, 'deleted');
    const sessionData = pomoSessionHandler.cycleEnd();
    expect(sessionData.cycleArray[sessionData.cycleArray.length - 1].tasks[0].taskState).toBe('deleted');
  });

  it('should be able to mark a task as complete', () => {
    pomoSessionHandler.startSession();
    pomoSessionHandler.cycleStart(mockTwoTasks);
    pomoSessionHandler.updateTaskStatusInCurrentCycle(1, 'complete');
    const sessionData = pomoSessionHandler.cycleEnd();
    expect(sessionData.cycleArray[sessionData.cycleArray.length - 1].tasks[0].taskState).toBe('complete');
  });

  it('should be able to add a new task to a running cycle, and have that task be reflected in the cycle tasks when the cycle is completed.' , () => {
    pomoSessionHandler.startSession();
    mockTwoTasks[0].taskState = 'incomplete';
    mockTwoTasks[1].taskState = 'incomplete';
    pomoSessionHandler.cycleStart(mockTwoTasks);
    pomoSessionHandler.updateTaskStatusInCurrentCycle(mockTwoTasks[0].taskId, 'complete');
    pomoSessionHandler.updateTaskStatusInCurrentCycle(mockTwoTasks[1].taskId, 'complete');
    pomoSessionHandler.addTaskToCurrentCycle(mockTaskId3[0]);
    const sessionData = pomoSessionHandler.cycleEnd();
    const currentCycle = sessionData.cycleArray[sessionData.cycleArray.length - 1];
    expect(currentCycle.tasks.length).toBe(3);
    expect(currentCycle.tasks[currentCycle.tasks.length - 1].taskState).toBe('incomplete');
  });

  it('should keep track of the number of cycles that have been completed', () => {
    pomoSessionHandler.startSession();
    pomoSessionHandler.cycleStart(mockOneTask);
    const sessionDataSnapshot1 = pomoSessionHandler.cycleEnd();
    expect (sessionDataSnapshot1.numberOfCyclesCompleted).toBe(1);
    pomoSessionHandler.cycleStart(mockOneTask);
    expect (sessionDataSnapshot1.numberOfCyclesCompleted).toBe(1);
    const sessionDataSnapshot2 = pomoSessionHandler.cycleEnd();
    expect(sessionDataSnapshot2.numberOfCyclesCompleted).toBe(2);
  });
});