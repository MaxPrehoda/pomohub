import PomoSessionHandler from './session';

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
    const mockTasks = [
      {
        taskName: 'mock task 1',
        taskId: 1,
        taskState: 'incomplete',
        dateChanged: new Date()
      }
    ];
    const cycleData = newSession.cycleStart(mockTasks);
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
    expect(sessionData.cycleArray[sessionData.cycleArray.length - 1].cycleSecDur).toBe(mockNumberOfSeconds);
  });

  it('should reflect all tasks that have been added during the cycle', () => {
    const newSession = new PomoSessionHandler();
    newSession.startSession();
    const mockTasks = [
      {
        taskName: 'mock task 1',
        taskId: 1,
        taskState: 'incomplete',
        dateChanged: new Date()
      },
      {
        taskName: 'mock task 2',
        taskId: 2,
        taskState: 'incomplete',
        dateChanged: new Date()
      }
    ];
    newSession.cycleStart(mockTasks);
    const mockTasks2 = [
      {
        taskName: 'mock task 1',
        taskId: 1,
        taskState: 'incomplete',
        dateChanged: new Date()
      },
      {
        taskName: 'mock task 2',
        taskId: 2,
        taskState: 'incomplete',
        dateChanged: new Date()
      }
    ];
    const sessionData = newSession.updateExistingCycle({
      tasks: mockTasks2,
      cycleStart: new Date(),
      cycleEnd: null,
      cycleSecDur: null
    });
    expect(sessionData.cycleArray.length === 1);
    expect(sessionData.cycleArray[sessionData.cycleArray.length - 1].tasks.length).toBe(2);
  });
});
