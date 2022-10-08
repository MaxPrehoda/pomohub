import PomoSession from './session';
import { Tasks } from '../entities';

describe('Session', () => {
  it('should be associated with the date when the Session was started', () => {
    const session = new PomoSession(new Date());
    expect(session.startingDate).toBeDefined();
  });

  it('should be able to be started and stopped', () => {
    const session = new PomoSession(new Date());
    session.startSession();
    expect(session.isRunning).toBe(true);
    session.stopSession();
    expect(session.isRunning).toBe(false);
  });

  it('should be able to modify an existing task within a cycle', () => {
    const session = new PomoSession(new Date());
    session.startSession();
    const task1: Tasks = { taskName: 'Task1', taskId: 1, taskState: 'incomplete', dateChanged: new Date() };
    session.cycleStart([task1]);
    const modifiedTask1: Tasks = { taskName: 'Task1', taskId: 1, taskState: 'complete', dateChanged: new Date() };
    session.cycleModify(modifiedTask1);
    expect(session.cycleArray[0].tasks.length).toBe(1);
    expect(session.cycleArray[0].tasks[0].taskState).toBe('complete');
  });

  it('should be able to compare Expected tasks to Actual tasks', () => {
    const session = new PomoSession(new Date());
    session.startSession();
    const task1: Tasks = { taskName: 'Task1', taskId: 1, taskState: 'incomplete', dateChanged: new Date() };
    const task2: Tasks = { taskName: 'Task2', taskId: 2, taskState: 'incomplete', dateChanged: new Date() };

    session.cycleStart([task1, task2]);
    const modifiedTask1: Tasks = { taskName: 'Task1', taskId: 1, taskState: 'complete', dateChanged: new Date() };

    session.cycleModify(modifiedTask1);

    expect(session.getPercentageOfCompletedTasksInCycle(0)).toBe(50);
  });
});
