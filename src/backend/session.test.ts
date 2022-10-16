import PomoSessionHandler from './session';

import { mockOneTask, mockTwoTasks } from './session.mocks';

describe('PomoSessionHandler', () => {
  it('should be able to create a new session', () => {
    const newSession = new PomoSessionHandler();
    expect(newSession).toBeTruthy();
  });

  it('should be able to start a new session', () => {
    const newSession = new PomoSessionHandler();
    const sessionData = newSession.startSession();
    expect(sessionData.isRunning).toBeTruthy();
  });

  it('should be able to add a new cycle to a session', () => {
    const newSession = new PomoSessionHandler();
    newSession.startSession();
    const cycleData = newSession.cycleStart(mockOneTask);
    expect(cycleData.cycleArray.length).toBe(1);
  });

  it('should be able to end a cycle, which should calculate the cycle duration in seconds', () => {
    const newSession = new PomoSessionHandler();
    const mockNumberOfSeconds = 60;
    newSession.startSession();
    newSession.cycleStart([]);
    jest.useFakeTimers();
    jest.advanceTimersByTime(mockNumberOfSeconds * 1000);
    const sessionData = newSession.cycleEnd();

    const measuredDuration = sessionData.cycleArray[sessionData.cycleArray.length - 1].cycleSecDur;
    if (measuredDuration === null) {
      throw new Error('cycleSecDur cannot be null.');
    }
    const roundedDuration = Math.round(measuredDuration);
    expect(roundedDuration).toBe(mockNumberOfSeconds);
  });

  it('should reflect all tasks that have been added during the cycle', () => {
    const newSession = new PomoSessionHandler();
    newSession.startSession();

    newSession.cycleStart(mockTwoTasks);

    const sessionData = newSession.updateExistingCycle({
      tasks: mockTwoTasks,
      cycleStart: new Date(),
      cycleEnd: null,
      cycleSecDur: null
    });
    expect(sessionData.cycleArray.length === 1);
    expect(sessionData.cycleArray[sessionData.cycleArray.length - 1].tasks.length).toBe(2);
  });

  it('should be able to mark a task as deleted', () => {
    const newSession = new PomoSessionHandler();
    newSession.startSession();
    newSession.cycleStart(mockOneTask);
    newSession.updateTaskStatusInCurrentCycle(1, 'deleted');
    const sessionData = newSession.cycleEnd();
    expect(sessionData.cycleArray[sessionData.cycleArray.length - 1].tasks[0].taskState).toBe('deleted');
  });

  it('should be able to mark a task as complete', () => {
    const newSession = new PomoSessionHandler();
    newSession.startSession();
    newSession.cycleStart(mockTwoTasks);
    newSession.updateTaskStatusInCurrentCycle(1, 'complete');
    const sessionData = newSession.cycleEnd();
    expect(sessionData.cycleArray[sessionData.cycleArray.length - 1].tasks[0].taskState).toBe('complete');
  });
});
