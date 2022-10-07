import PomoSession from './session';

describe('Session', () => {
  it('should be associated with the date when the Session was started', () => {
    const session = new PomoSession(new Date(), 4);
    expect(session.startingDate).toBeDefined();
  });

  it('should be associated with the number of cycles that the Session will have', () => {
    const session = new PomoSession(new Date(), 4);
    expect(session.numberOfCycles).toBe(4);
  });

  it('should be able to be started and stopped', () => {
    const session = new PomoSession(new Date(), 4);
    session.start();
    expect(session.isRunning).toBe(true);
    session.stop();
    expect(session.isRunning).toBe(false);
  });
});
