describe('LabTrackingDataService', () => {
  let LabTrackingDataService;

  beforeEach(() => {
    LabTrackingDataService = createInjector('encounterFactory', 'labTrackingOrderFactory', 'labTrackingDataService',
      'labTrackingTestStubs').get('LabTrackingDataService');
  });

  describe('getProcedureLocations', () => {
    const VISIT_LOCATION_TAG = { uuid: 'visit-location-tag-uuid', name: 'Visit Location' };
    const CONSULT_NOTE_TAG = { uuid: 'dea8febf-0bbe-4111-8152-a9cf7df622b6', name: 'Consult Note Location' };
    const LOGIN_TAG = { uuid: 'login-tag-uuid', name: 'Login Location' };

    function site(uuid, name) {
      return { uuid, name, tags: [VISIT_LOCATION_TAG], visitLocation: null };
    }

    function ward(uuid, name, siteLocation, tags) {
      return { uuid, name, tags, visitLocation: siteLocation };
    }

    // Locations as LabTrackingDataService.loadVisitLocations populates them: each one points to its nearest
    // "Visit Location" ancestor, and a Visit Location itself has visitLocation null.
    const mirebalais = site('mirebalais-uuid', 'Mirebalais');
    const cange = site('cange-uuid', 'Cange');
    const allLocations = [
      mirebalais,
      cange,
      ward('mirebalais-lab-uuid', 'Laboratwa Prensipal', mirebalais, [LOGIN_TAG]),
      ward('mirebalais-oncology-uuid', 'Onkoloji', mirebalais, [LOGIN_TAG, CONSULT_NOTE_TAG]),
      ward('mirebalais-ward-uuid', 'Sal Fanm', mirebalais, [CONSULT_NOTE_TAG]),
      ward('cange-clinic-uuid', 'Klinik Ekstèn | Cange', cange, [LOGIN_TAG, CONSULT_NOTE_TAG]),
      ward('cange-oncology-uuid', 'Onkoloji | Cange', cange, [CONSULT_NOTE_TAG]),
      ward('cange-pharmacy-uuid', 'Famasi | Cange', cange, [LOGIN_TAG]),
    ];

    function values(options) {
      return options.map((o) => o.value).sort();
    }

    it('offers the Consult Note locations of the visit\'s site when the visit is at another site', () => {
      // logged in at Mirebalais, ordering on a Cange visit
      const options = LabTrackingDataService.getProcedureLocations(allLocations, 'cange-uuid', 'mirebalais-lab-uuid');

      expect(values(options)).toEqual(['cange-clinic-uuid', 'cange-oncology-uuid']);
      expect(options).toContainEqual({ label: 'Onkoloji | Cange', value: 'cange-oncology-uuid' });
    });

    it('offers the Consult Note locations of the visit\'s site when the visit is at the login site', () => {
      const options = LabTrackingDataService.getProcedureLocations(allLocations, 'mirebalais-uuid', 'mirebalais-lab-uuid');

      expect(values(options)).toEqual(['mirebalais-oncology-uuid', 'mirebalais-ward-uuid']);
    });

    it('uses the site of a visit whose location is below the Visit Location', () => {
      const options = LabTrackingDataService.getProcedureLocations(allLocations, 'cange-clinic-uuid', 'mirebalais-lab-uuid');

      expect(values(options)).toEqual(['cange-clinic-uuid', 'cange-oncology-uuid']);
    });

    it('offers the Consult Note locations of the login site when there is no visit', () => {
      const options = LabTrackingDataService.getProcedureLocations(allLocations, '', 'mirebalais-lab-uuid');

      expect(values(options)).toEqual(['mirebalais-oncology-uuid', 'mirebalais-ward-uuid']);
    });

    it('falls back to the login site when the visit\'s location is not found', () => {
      const options = LabTrackingDataService.getProcedureLocations(allLocations, 'unknown-uuid', 'mirebalais-lab-uuid');

      expect(values(options)).toEqual(['mirebalais-oncology-uuid', 'mirebalais-ward-uuid']);
    });

    it('offers nothing when neither the visit nor the login location has a site', () => {
      expect(LabTrackingDataService.getProcedureLocations(allLocations, null, null)).toEqual([]);
      expect(LabTrackingDataService.getProcedureLocations([], 'cange-uuid', 'mirebalais-lab-uuid')).toEqual([]);
    });
  });
});
