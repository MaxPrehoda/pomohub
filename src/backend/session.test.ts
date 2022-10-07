import PomoSession from './session';

describe('Session', () => {
  it('should be associated with the date when the Session was started', () => {
    const session = new PomoSession(new Date());
    expect(session.startingDate).toBeDefined();
  });

  it('should be able to be started and stopped', () => {
    const session = new PomoSession(new Date());
    session.start();
    expect(session.isRunning).toBe(true);
    session.stop();
    expect(session.isRunning).toBe(false);
  });
});
