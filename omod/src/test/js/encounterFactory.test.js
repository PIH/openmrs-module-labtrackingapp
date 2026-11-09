describe('Encounter', () => {
  let Encounter;

  beforeEach(() => {
    Encounter = createInjector('encounterFactory').get('Encounter');
  });

  describe('toRestDate', () => {
    it('formats the local calendar date as yyyy-MM-dd', () => {
      // 11:30 pm in New York is already the next day in UTC, so a UTC conversion would give 2026-11-07
      expect(Encounter.toRestDate(new Date(2026, 10, 6, 23, 30))).toBe('2026-11-06');
    });

    it('returns null for no date', () => {
      expect(Encounter.toRestDate(null)).toBeNull();
      expect(Encounter.toRestDate(undefined)).toBeNull();
    });
  });

  describe('fromRestDate', () => {
    it('returns local midnight on the calendar date the server stored, whatever the server offset', () => {
      // server on UTC, 5 hours ahead of the browser: as an instant this is 7 pm on Nov 5 in New York
      expect(Encounter.fromRestDate('2026-11-06T00:00:00.000+0000')).toEqual(new Date(2026, 10, 6));
      // server behind the browser
      expect(Encounter.fromRestDate('2026-11-06T00:00:00.000-0800')).toEqual(new Date(2026, 10, 6));
      // a plain date, as REST gives for the value of a Date obs
      expect(Encounter.fromRestDate('2026-11-06')).toEqual(new Date(2026, 10, 6));
    });

    it('returns null for no value', () => {
      expect(Encounter.fromRestDate(null)).toBeNull();
      expect(Encounter.fromRestDate(undefined)).toBeNull();
    });
  });

  describe('toRestDatetime', () => {
    it('formats a datetime as ISO 8601 with the local offset', () => {
      expect(Encounter.toRestDatetime(new Date(2026, 10, 6, 17, 56))).toBe('2026-11-06T17:56:00.000-0500');
    });
  });
});
