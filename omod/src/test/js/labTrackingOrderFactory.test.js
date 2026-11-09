describe('LabTrackingOrder', () => {
  let LabTrackingOrder;

  beforeEach(() => {
    LabTrackingOrder = createInjector('encounterFactory', 'labTrackingOrderFactory').get('LabTrackingOrder');
  });

  function newOrder() {
    return new LabTrackingOrder('patient-uuid', 'location-uuid', 'visit-uuid');
  }

  function findObs(obsList, conceptUuid) {
    for (const o of obsList) {
      if (o.concept === conceptUuid) {
        return o;
      }
      if (o.groupMembers) {
        const member = findObs(o.groupMembers, conceptUuid);
        if (member) {
          return member;
        }
      }
    }
    return undefined;
  }

  describe('fromEncounterRestObject', () => {
    // A Date obs is stored at midnight in the server's timezone, and REST returns it with the server's offset.
    // Here the server is on UTC and the browser (the test timezone) is in New York, 5 hours behind, so reading
    // the value as an instant would give 7 pm on the previous day.
    const serverMidnight = (date) => `${date}T00:00:00.000+0000`;

    function encounterWithObs(obs) {
      return {
        uuid: 'encounter-uuid',
        encounterDatetime: '2026-11-06T10:00:00.000+0000',
        patient: { person: { uuid: 'patient-uuid', display: 'Test Patient' }, identifiers: [{ identifier: 'TEST-ID' }] },
        encounterProviders: [],
        obs: obs,
      };
    }

    function dateObs(conceptUuid, date) {
      return { uuid: conceptUuid + '-obs', concept: { uuid: conceptUuid }, valueDatetime: serverMidnight(date) };
    }

    function localDate(date) {
      return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    }

    it('reads the processed date, immuno sent date and result date as the stored calendar date', () => {
      const order = LabTrackingOrder.fromEncounterRestObject(encounterWithObs([
        dateObs(LabTrackingOrder.concepts.processedDate.value, '2026-11-06'),
        dateObs(LabTrackingOrder.concepts.dateImmunoSentToBoston.value, '2026-11-07'),
        dateObs(LabTrackingOrder.concepts.resultDate.value, '2026-11-08'),
      ]));

      expect(localDate(order.processedDate.value)).toEqual([2026, 11, 6]);
      expect(localDate(order.dateImmunoSentToBoston.value)).toEqual([2026, 11, 7]);
      expect(localDate(order.resultDate.value)).toEqual([2026, 11, 8]);
    });

    it('reads the specimen sent and returned dates as the stored calendar date', () => {
      const order = LabTrackingOrder.fromEncounterRestObject(encounterWithObs([{
        uuid: 'construct-uuid',
        concept: { uuid: LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_CONSTRUCT },
        groupMembers: [
          dateObs(LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_DATE, '2026-11-06'),
          dateObs(LabTrackingOrder.CONSTANTS.SPECIMEN_RETURN_DATE, '2026-11-08'),
        ],
      }]));

      expect(localDate(order.specimenSentToPaP.dateSent.value)).toEqual([2026, 11, 6]);
      expect(localDate(order.specimenSentToPaP.dateReturned.value)).toEqual([2026, 11, 8]);
    });

    it('saves back the same date it read', () => {
      const order = LabTrackingOrder.fromEncounterRestObject(encounterWithObs([
        dateObs(LabTrackingOrder.concepts.processedDate.value, '2026-11-06'),
      ]));

      const obs = LabTrackingOrder.toSpecimenCollectionEncounterWebServiceObject(order, 'provider-uuid').encounter.obs;

      expect(findObs(obs, LabTrackingOrder.concepts.processedDate.value).value).toBe('2026-11-06');
    });
  });

  describe('toSpecimenCollectionEncounterWebServiceObject', () => {
    // 11:30 pm in New York, already the next day in UTC
    const lateEvening = new Date(2026, 10, 6, 23, 30);

    // Every date the app saves is a Date (not Datetime) concept, so it must be sent as a plain local date:
    // core rejects "yyyy-MM-dd HH:mm" for Date obs (TRUNK-6848) and keeps the time from an ISO datetime.
    it('sends the processed date, immuno sent date and result date as yyyy-MM-dd', () => {
      const order = newOrder();
      order.processedDate.value = lateEvening;
      order.dateImmunoSentToBoston.value = lateEvening;
      order.resultDate.value = lateEvening;

      const obs = LabTrackingOrder.toSpecimenCollectionEncounterWebServiceObject(order, 'provider-uuid').encounter.obs;

      expect(findObs(obs, LabTrackingOrder.concepts.processedDate.value).value).toBe('2026-11-06');
      expect(findObs(obs, LabTrackingOrder.concepts.dateImmunoSentToBoston.value).value).toBe('2026-11-06');
      expect(findObs(obs, LabTrackingOrder.concepts.resultDate.value).value).toBe('2026-11-06');
    });

    it('sends the specimen sent and returned dates as yyyy-MM-dd', () => {
      const order = newOrder();
      order.specimenSentToPaP.specimenSent.value = LabTrackingOrder.CONSTANTS.YES;
      order.specimenSentToPaP.dateSent.value = lateEvening;
      order.specimenSentToPaP.dateReturned.value = new Date(2026, 10, 8, 23, 30);

      const obs = LabTrackingOrder.toSpecimenCollectionEncounterWebServiceObject(order, 'provider-uuid').encounter.obs;

      expect(findObs(obs, LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_DATE).value).toBe('2026-11-06');
      expect(findObs(obs, LabTrackingOrder.CONSTANTS.SPECIMEN_RETURN_DATE).value).toBe('2026-11-08');
    });

    it('voids the processed date obs when the date is cleared', () => {
      const order = newOrder();
      order.processedDate.value = null;
      order.processedDate.obsUuid = 'existing-obs-uuid';

      const result = LabTrackingOrder.toSpecimenCollectionEncounterWebServiceObject(order, 'provider-uuid');

      expect(findObs(result.encounter.obs, LabTrackingOrder.concepts.processedDate.value)).toBeUndefined();
      expect(result.obsIdsToDelete).toContain('existing-obs-uuid');
    });
  });
});
