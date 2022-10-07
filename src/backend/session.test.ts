import PomoSession from './session';

describe('Session', () => {
  it('should be associated with the date when the Session was started', () => {
    const session = new PomoSession(new Date(), 4);
    expect(session.startingDate).toBeDefined();
  });
});
