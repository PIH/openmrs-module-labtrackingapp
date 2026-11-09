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
