import { AdditionalData, BasisData, MedicationEntry } from "@/app/types/assessment";



// mocks


// Mock for database connection
const mockQuery = jest.fn();
jest.mock("../app/dbs/db", () => ({
  connectionPool: {
    query: mockQuery,
  },
}));

// mock for SymptomLists
jest.mock("../app/assessment/medicalLogic/SymptomLists", () => ({
  getSymptomList: jest.fn(() => [
    {
      step: "Augen",
      symptoms: [
        {
          symptomName: "Verzerrtsehen",
          schmerzen: false,
          symptomValue: "Verzerrtsehen: Gerade Linien erscheinen verbogen.",
          snomedCode: "1023001",
        },
      ],
    },
    {
      step: "Hand",
      symptoms: [
        {
          symptomName: "Parästhesien",
          schmerzen: false,
          symptomValue: "Parästhesien: Brennen, Kribbeln oder Ameisenlaufen.",
          snomedCode: "43214002",
        },
      ],
    },
  ]),
}));

// Mock for ai fetch (Ollama/MedGemma API)
const mockFetch = jest.fn();
global.fetch = mockFetch;

// mock for medication data from db
const mockMedicationRows = [
  { medication: "Ibuprofen", dose: 400, unit: "mg", frequency: 2, frequency_unit: "Tag", taken_since: "3 Tage" },
];

// mock for getting user data from db return
function mockGetUserDataFromDB({
  caseRows = [{ sex: "w", age: 28, pregnancy: false, date: "2023-01-01" }],
  symptomRows = [{ name_de: "Kopfschmerz", painscale: 4, bodyregion: "Kopf" }],
  textSymptomRows = [],
  additionalInfoRows = [{ weight: 60, height: 165, temperature: 38.5, duration: 2, worsening: true, breastfeeding: false, extraInfo: "" }],
  medicationRows = mockMedicationRows,
  allergyRows = [{ detail: "Pollen" }],
  conditionRows = [{ detail: "Asthma" }],
} = {}) {
  mockQuery
    .mockResolvedValueOnce({ rows: caseRows })
    .mockResolvedValueOnce({ rows: symptomRows })
    .mockResolvedValueOnce({ rows: textSymptomRows })
    .mockResolvedValueOnce({ rows: additionalInfoRows })
    .mockResolvedValueOnce({ rows: medicationRows })
    .mockResolvedValueOnce({ rows: allergyRows })
    .mockResolvedValueOnce({ rows: conditionRows });
}

// import functions to test
import {
  saveFormData,
  insertListIntoSymptomsNoCertainCount,
  getUserDataFromDB,
  getAiDataFromDB,
  deleteCaseData,
  deleteDataOnAccessCode,
  accessDataWithAccessCode,
  accessAiDataWithAccessCode,
  deleteOldCases,
  getDetailsNoCertainCount,
  getAccessCode,
} from "../app/actions/dbActions";

// import functions to test
import {
  sendDataToAi,
  buildUnifiedData,
  buildAiPrompt,
} from "../app/actions/aiActions";

// import functions to test
import {
  mapNameToSnomed,
} from "../app/actions/fhirActions";



// dummy function for all inputs
function buildFormData(overrides: Record<string, string> = {}): FormData {
  const defaults: Record<string, string> = {
    age: "30",
    gender: "weiblich",
    pregnancy: "nein",
    weight: "65",
    height: "170",
    // medication ist jetzt JSON-Array von MedicationEntry-Objekten
    medication: JSON.stringify([
      { name: "Ibuprofen", dose: "400", unit: "mg", 
        frequency: "2", frequencyUnit: "Tag", since: "3 Tage" },
    ]),
    conditions: "Asthma",
    allergies: "Pollen",
    temperature: "37,5",
    duration: "3",
    worsening: "ja",
    breastfeeding: "nein",
    extraInfo: "Kein weiterer Hinweis",
    alcoholPerWeek: "2",
    cigarettesPerDay: "0",
    selectedSymptoms: "",
    symptomText: "",
    ...overrides,
  };

  const fd = new FormData();
  for (const [key, value] of Object.entries(defaults)) {
    fd.append(key, value);
  }
  return fd;
}

// dummy fixtures for sendDataToAi tests
function buildBasisData(overrides: Partial<BasisData> = {}): BasisData {
  return {
    age: "28",
    gender: "weiblich",
    pregnancy: "nein",
    ...overrides,
  };
}

function buildAdditionalData(overrides: Partial<AdditionalData> = {}): AdditionalData {
  return {
    hasMedication: true,
    medication: [
      { name: "Ibuprofen", dose: "400", unit: "mg", frequency: "2", frequencyUnit: "Tag", since: "3 Tage" },
    ],
    hasConditions: true,
    conditions: ["Asthma"],
    smokescigarettes: false,
    cigarettesPerDay: "",
    drinksAlcohol: false,
    alcoholPerWeek: "",
    allergies: ["Pollen"],
    hasAllergies: true,
    temperature: "38.5",
    duration: "2",
    worsening: "ja",
    weight: "60",
    height: "165",
    breastfeeding: "nein",
    extraInfo: "",
    ...overrides,
  };
}


const sampleSelectedSymptoms = [
  JSON.stringify({ name: "Kopfschmerz", bodyRegion: "Kopf", painscale: 4 }),
];
const sampleSymptomText: string[] = [`{ name: "Ich blute", bodyRegion: "Kopf", painscale: 2 }`];

// testing saveFormData

describe("saveFormData", () => {
  beforeEach(() => {
    mockQuery.mockReset();

    // INSERT INTO cases returns case_id, access_code
    mockQuery.mockResolvedValueOnce({
      rows: [{ case_id: "42", access_code: "ABC123" }],
    });
    // INSERT INTO additional_information
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // more queries for insertListIntoSymptomsNoCertainCount
    mockQuery.mockResolvedValue({ rows: [] });
  });

  it("writes case-Basisdata into DB", async () => {
    const formData = buildFormData();

    await saveFormData(formData);

    // first db call has to be INSERT INTO cases
    const firstCall = mockQuery.mock.calls[0];
    expect(firstCall[0]).toMatch(/Insert into cases/i);
    // check age
    expect(firstCall[1]).toContain(30);
    // gender correctly converted
    expect(firstCall[1]).toContain("w");
    // pregnancy correctly converted
    expect(firstCall[1]).toContain(false);

  });

  it("converts 'männlich' correctly to 'm'", async () => {
    const formData = buildFormData({ gender: "männlich" });

    await saveFormData(formData);

    const firstCall = mockQuery.mock.calls[0];
    expect(firstCall[1]).toContain("m");
  });

  it("converts 'divers' correctly to 'd'", async () => {
    const formData = buildFormData({ gender: "divers" });

    await saveFormData(formData);

    const firstCall = mockQuery.mock.calls[0];
    expect(firstCall[1]).toContain("d");
  });

  it("inserts medication entries as individual rows in the medication table", async () => {
    const formData = buildFormData({
      medication: JSON.stringify([
        { name: "Ibuprofen", dose: "400", unit: "mg", frequency: "2", frequencyUnit: "Tag", since: "3 Tage" },
      ]),
    });

    await saveFormData(formData);

    const medInsert = mockQuery.mock.calls.find(
      (call) => typeof call[0] === "string" && call[0].includes("Insert into medication")
    );
    expect(medInsert).toBeDefined();
    expect(medInsert![1]).toContain("Ibuprofen");
    expect(medInsert![1]).toContain("400");
    expect(medInsert![1]).toContain("mg");
    expect(medInsert![1]).toContain("2");
    expect(medInsert![1]).toContain("Tag");
    expect(medInsert![1]).toContain("3 Tage");
  });

  it("sets pregnancy=true when 'ja' is provided", async () => {
    const formData = buildFormData({ gender: "weiblich", pregnancy: "ja" });

    await saveFormData(formData);

    const firstCall = mockQuery.mock.calls[0];
    expect(firstCall[1]).toContain(true);
  });


  it("processes empty selectedSymptoms and symptomText without errors", async () => {
    const formData = buildFormData({ selectedSymptoms: "", symptomText: "" });

    await expect(saveFormData(formData)).resolves.not.toThrow();
  });

  it("writes prewritten symptoms correctly in case_symptoms", async () => {
    const symptom = JSON.stringify({
      name: "Kopfschmerz",
      bodyRegion: "Kopf",
      painscale: 5,
    });
    const formData = buildFormData({ selectedSymptoms: symptom });

    await saveFormData(formData);

    const symptomInsert = mockQuery.mock.calls.find(
      (call) =>
        typeof call[0] === "string" &&
        call[0].includes("INSERT INTO case_symptoms")
    );
    expect(symptomInsert).toBeDefined();
    expect(symptomInsert![1]).toContain("Kopfschmerz");
  });

  it("writes text symptoms in raw_text_symptoms and case_symptoms", async () => {

  mockQuery.mockReset();
  mockQuery.mockImplementation((sql: string) => {
    if (sql.includes("Insert into cases")) return Promise.resolve({ rows: [{ case_id: "42", access_code: "ABC" }] });
    if (sql.includes("insert into raw_text_symptoms")) return Promise.resolve({ rows: [{ raw_id: "77" }] });
    return Promise.resolve({ rows: [] });
  });

  const textSymptom = JSON.stringify({
    text_symptom: "Starke Kopfschmerzen",
    painscale: 7,
    bodyregion: "Kopf",
  });
  const formData = buildFormData({ symptomText: textSymptom });

  await saveFormData(formData);

  // INSERT INTO raw_text_symptoms
  const rawInsert = mockQuery.mock.calls.find(
    (call) =>
      typeof call[0] === "string" &&
      call[0].includes("insert into raw_text_symptoms")
  );
  expect(rawInsert).toBeDefined();
  expect(rawInsert![1]).toContain("Starke Kopfschmerzen");

  // INSERT INTO case_symptoms with raw_id
  const caseSymptomInsert = mockQuery.mock.calls.find(
    (call) =>
      typeof call[0] === "string" &&
      call[0].includes("insert into case_symptoms")
  );
  expect(caseSymptomInsert).toBeDefined();
  expect(caseSymptomInsert![1]).toContain(7); // painscale
  expect(caseSymptomInsert![1]).toContain("Kopf"); // bodyregion
});

it("connects raw_id correctly between raw_text_symptoms and case_symptoms", async () => {

  mockQuery.mockReset();

  mockQuery.mockImplementation((sql: string) => {
    if (sql.includes("insert into raw_text_symptoms")) {
      return Promise.resolve({ rows: [{ raw_id: "99" }] });
    }
    if (sql.includes("Insert into cases")) {
      return Promise.resolve({ rows: [{ case_id: "42", access_code: "ABC" }] });
    }
    return Promise.resolve({ rows: [] });
  });

  const textSymptom = JSON.stringify({
    text_symptom: "Bauchschmerzen",
    painscale: 5,
    bodyregion: "Bauch",
  });
  const formData = buildFormData({ symptomText: textSymptom });

  await saveFormData(formData);

  const caseSymptomInsert = mockQuery.mock.calls.find(
    (call) =>
      typeof call[0] === "string" &&
      call[0].includes("insert into case_symptoms")
  );
  expect(caseSymptomInsert![1][0]).toBe("99"); // raw_id korrekt weitergegeben
});

it("processes multiple text symptoms correctly", async () => {

 mockQuery.mockReset();
  let rawIdCounter = 0;
  mockQuery.mockImplementation((sql: string) => {
    if (sql.includes("Insert into cases")) return Promise.resolve({ rows: [{ case_id: "42", access_code: "ABC" }] });
    if (sql.includes("insert into raw_text_symptoms")) return Promise.resolve({ rows: [{ raw_id: String(++rawIdCounter) }] });
    return Promise.resolve({ rows: [] });
  });

  const symptom1 = JSON.stringify({ text_symptom: "Husten", painscale: 3, bodyregion: "Brust" });
  const symptom2 = JSON.stringify({ text_symptom: "Fieber", painscale: 6, bodyregion: null });
  const formData = buildFormData({
    symptomText: `${symptom1}|||${symptom2}`,
  });

  await saveFormData(formData);

  const rawInserts = mockQuery.mock.calls.filter(
    (call) =>
      typeof call[0] === "string" &&
      call[0].includes("insert into raw_text_symptoms")
  );
  // ein INSERT pro Symptom
  expect(rawInserts).toHaveLength(2);
  expect(rawInserts[0][1]).toContain("Husten");
  expect(rawInserts[1][1]).toContain("Fieber");
});

it("sets bodyregion to null when not specified", async () => {

  mockQuery.mockReset();
  mockQuery.mockImplementation((sql: string) => {
    if (sql.includes("Insert into cases")) return Promise.resolve({ rows: [{ case_id: "42", access_code: "ABC" }] });
    if (sql.includes("insert into raw_text_symptoms")) return Promise.resolve({ rows: [{ raw_id: "77" }] });
    return Promise.resolve({ rows: [] });
  });

  const textSymptom = JSON.stringify({
    text_symptom: "Schwindel",
    painscale: 4,
    bodyregion: null,
  });
  const formData = buildFormData({ symptomText: textSymptom });

  await saveFormData(formData);

  const caseSymptomInsert = mockQuery.mock.calls.find(
    (call) =>
      typeof call[0] === "string" &&
      call[0].includes("insert into case_symptoms")
  );
  expect(caseSymptomInsert).toBeDefined();
  // bodyregion is null (Index 3 in parameters)
  expect(caseSymptomInsert![1][3]).toBeNull();
});

it("sets worseningBool to false when 'nein' is provided", async () => {
  const formData = buildFormData({ worsening: "nein" });

  await saveFormData(formData);

  const additionalInfoInsert = mockQuery.mock.calls.find(
    (call) =>
      typeof call[0] === "string" &&
      call[0].includes("Insert into additional_information")
  );
  // worsening is 6. parameter (Index 5)
  expect(additionalInfoInsert![1][5]).toBe(false);
});

it("sets breastfeedingBool to true when 'ja' is provided", async () => {
  const formData = buildFormData({ breastfeeding: "ja" });

  await saveFormData(formData);

  const additionalInfoInsert = mockQuery.mock.calls.find(
    (call) =>
      typeof call[0] === "string" &&
      call[0].includes("Insert into additional_information")
  );
  // breastfeeding is the 7. parameter (Index 6)
  expect(additionalInfoInsert![1][6]).toBe(true);
  });

  it("saves null when optional fields are empty", async () => {
    const formData = buildFormData({
      weight: "",
      height: "",
      temperature: "",
      duration: "",
      extraInfo: "",
    });

    await saveFormData(formData);

    const additionalInfoInsert = mockQuery.mock.calls.find(
      (call) =>
        typeof call[0] === "string" &&
        call[0].includes("Insert into additional_information")
    );

    expect(additionalInfoInsert![1][1]).toBeNull(); // weight
    expect(additionalInfoInsert![1][2]).toBeNull(); // height
    expect(additionalInfoInsert![1][3]).toBeNull(); // temperature
    expect(additionalInfoInsert![1][4]).toBeNull(); // duration
    expect(additionalInfoInsert![1][7]).toBeNull(); // extraInfo
  });
});






describe("insertListIntoSymptomsNoCertainCount", () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockQuery.mockResolvedValue({ rows: [] });
  });

  it("performs a DB insert for each list element", async () => {
    const list = ["Pollen", "Nüsse", "Latex"];

    await insertListIntoSymptomsNoCertainCount(
      list,
      "allergy",
      1 as unknown as BigInteger
    );

    expect(mockQuery).toHaveBeenCalledTimes(3);
    for (const item of list) {
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("Insert into details_no_certain_count"),
        expect.arrayContaining([item, "allergy"])
      );
    }
  });

  it("does nothing for an empty list", async () => {
    await insertListIntoSymptomsNoCertainCount(
      [],
      "allergy",
      1 as unknown as BigInteger
    );

    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("passes the correct category to the DB", async () => {
    await insertListIntoSymptomsNoCertainCount(
      ["Ibuprofen"],
      "medication",
      99 as unknown as BigInteger
    );

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining(["medication", "Ibuprofen"])
    );
  });

  it("saves null when a list element is empty", async () => {
  mockQuery.mockResolvedValue({ rows: [] });

  await insertListIntoSymptomsNoCertainCount([""], "allergy", 1 as unknown as BigInteger);

  expect(mockQuery).toHaveBeenCalledWith(
    expect.any(String),
    expect.arrayContaining([null])
  );
  });
});








describe("getUserDataFromDB", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it("returns an object with all expected fields", async () => {
  mockQuery
  .mockResolvedValueOnce({ rows: [{ sex: "w", age: 25, pregnancy: false, date: "2023-01-01" }] })
  .mockResolvedValueOnce({ rows: [{ name_de: "Kopfschmerz", painscale: 3, bodyregion: "Kopf" }] })
  .mockResolvedValueOnce({ rows: [{ raw_symptoms: "Bauchschmerzen", painscale: 5, bodyregion: "Bauch" }] })
  .mockResolvedValueOnce({ rows: [{ weight: 60, height: 165, temperature: 38.5, duration: 2, worsening: true, breastfeeding: false, extraInfo: "" }] })
  .mockResolvedValueOnce({ rows: [{ medication: "Ibuprofen", frequency_per_day: "2", taken_since: "3 Tage" }] }) // medication
  .mockResolvedValueOnce({ rows: [{ detail: "Pollen" }] })   // allergies
  .mockResolvedValueOnce({ rows: [{ detail: "Asthma" }] });  // conditions

  const result = await getUserDataFromDB("1");

  expect(result.caseData).toEqual([{ sex: "w", age: 25, pregnancy: false, date: "2023-01-01" }]);
  expect(result.symptomData).toEqual([{ name_de: "Kopfschmerz", painscale: 3, bodyregion: "Kopf" }]);
  expect(result.textSymptomData).toEqual([{ raw_symptoms: "Bauchschmerzen", painscale: 5, bodyregion: "Bauch" }]);
  expect(result.additionalInfoData).toEqual([{ weight: 60, height: 165, temperature: 38.5, duration: 2, worsening: true, breastfeeding: false, extraInfo: "" }]);
  expect(result.allergyData).toEqual({ allergies: ["Pollen"] });
expect(result.medicationData).toEqual([{ medication: "Ibuprofen", frequency_per_day: "2", taken_since: "3 Tage" }]);
expect(result.conditionsData).toEqual({ conditions: ["Asthma"] });
});

  it("returns allergies correctly as an array in the format { allergies: [...] }", async () => {
    mockQuery
    .mockResolvedValueOnce({ rows: [] }) // cases
    .mockResolvedValueOnce({ rows: [] }) // case_symptoms
    .mockResolvedValueOnce({ rows: [] }) // raw_text_symptoms
    .mockResolvedValueOnce({ rows: [] }) // additional_information
    .mockResolvedValueOnce({ rows: [] }) // medication
    .mockResolvedValueOnce({ rows: [{ detail: "Pollen" }, { detail: "Nüsse" }] }) // allergies
    .mockResolvedValueOnce({ rows: [] }); // conditions

    const result = await getUserDataFromDB("1");

    expect(result.allergyData).toEqual({ allergies: ["Pollen", "Nüsse"] });
  });

  it("calls the DB with the provided caseId", async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    await getUserDataFromDB("caseId-42");

    expect(mockQuery).toHaveBeenCalledWith(expect.any(String), ["caseId-42"]);
  });
});






describe("getAiDataFromDB", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it("returns the AI recommendation rows", async () => {
    const fakeRows = [
      {
        urgency_level: 3,
        advice_text: "Arzt aufsuchen",
        suspicion1: "Grippe",
        probability1: 70,
      },
    ];
    mockQuery.mockResolvedValueOnce({ rows: fakeRows });

    const result = await getAiDataFromDB("5");

    expect(result).toEqual(fakeRows);
  });

  it("returns an empty array when no AI data is available", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await getAiDataFromDB("5");

    expect(result).toEqual([]);
  });

  it("queries the recommendations table with the caseId", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await getAiDataFromDB("99");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("FROM recommendations"),
      ["99"]
    );
  });







describe("deleteCaseData", () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockQuery.mockResolvedValue({ rows: [] });
  });

  it("executes exactly 7 DELETE-Queries", async () => {
    await deleteCaseData("42");

    expect(mockQuery).toHaveBeenCalledTimes(7);
    const allSql = mockQuery.mock.calls.map((call) => call[0] as string);
      expect(allSql.some((sql) => sql.includes("DELETE FROM"))).toBe(true);
    });

  it("deletes from all relevant tables", async () => {
    await deleteCaseData("42");

    const deletedTables = mockQuery.mock.calls.map((call) =>
      (call[0] as string).match(/DELETE FROM (\w+)/)?.[1]
    );

    expect(deletedTables).toContain("cases");
    expect(deletedTables).toContain("raw_text_symptoms");
    expect(deletedTables).toContain("case_symptoms");
    expect(deletedTables).toContain("details_no_certain_count");
    expect(deletedTables).toContain("additional_information");
    expect(deletedTables).toContain("recommendations");
    expect(deletedTables).toContain("medication");
  });

  it("passes the caseId to all queries", async () => {
    await deleteCaseData("99");

    for (const call of mockQuery.mock.calls) {
      expect(call[1]).toContain("99");
    }
  });
});







describe("deleteDataOnAccessCode", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it("returns true and deletes the case when the access code exists", async () => {
    // SELECT case_id FROM cases
    mockQuery.mockResolvedValueOnce({ rows: [{ case_id: "5" }] });
    // 6x DELETE (deleteCaseData intern)
    mockQuery.mockResolvedValue({ rows: [] });

    const result = await deleteDataOnAccessCode("edd3b000-85fb-4ef3-a319-01b0adf21704");

    expect(result).toBe(true);
    // mindestens 7 Calls: 1 SELECT + 6 DELETE
    expect(mockQuery.mock.calls.length).toBeGreaterThanOrEqual(7);
  });

  it("returns false when the access code does not exist", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await deleteDataOnAccessCode("UNGÜLTIG");

    expect(result).toBe(false);
    // only 1 call to check for access code, no deletes
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("searches in the cases table for the access_code", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await deleteDataOnAccessCode("XYZ");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("access_code"),
      ["XYZ"]
    );
  });
});







describe("accessDataWithAccessCode", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it("returns null when no case with the access code exists", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await accessDataWithAccessCode("this-code-does-not-exist");

    expect(result).toBeNull();
  });

  it("returns the case data when the access code exists", async () => {
    // SELECT case_id
    mockQuery.mockResolvedValueOnce({ rows: [{ case_id: "7" }] });
    // getUserDataFromDB intern: 7 Queries
    mockQuery
      .mockResolvedValueOnce({ rows: [{ sex: "w", age: 30, pregnancy: false }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await accessDataWithAccessCode("0509d8f0-bd4b-4273-895b-cf961f08aafa");

    expect(result).not.toBeNull();
    expect(result).toHaveProperty("caseData");
  });

  it("searches in the cases table for the access_code", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await accessDataWithAccessCode("04db0194-1b52-4d21-84fb-f39bbe26860d");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("access_code"),
      ["04db0194-1b52-4d21-84fb-f39bbe26860d"]
    );
  });
});







describe("accessAiDataWithAccessCode", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it("returns null when no case with the access code exists", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await accessAiDataWithAccessCode("FALSCH");

    expect(result).toBeNull();
  });

  it("returns AI data when the access code exists", async () => {
    const fakeAiRows = [{ urgency_level: 2, advice_text: "Ruhe", suspicion1: "Erkältung" }];
    // SELECT case_id
    mockQuery.mockResolvedValueOnce({ rows: [{ case_id: "3" }] });
    // getAiDataFromDB intern
    mockQuery.mockResolvedValueOnce({ rows: fakeAiRows });

    const result = await accessAiDataWithAccessCode("04db0194-1b52-4d21-84fb-f39bbe26860d");

    expect(result).toEqual(fakeAiRows);
  });

  it("searches in the cases table for the access_code", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await accessAiDataWithAccessCode("04db0194-1b52-4d21-84fb-f39bbe26860d");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("access_code"),
      ["04db0194-1b52-4d21-84fb-f39bbe26860d"]
    );
  });
});







describe("deleteOldCases", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it("deletes all returned old cases", async () => {
    // SELECT old case_ids
    mockQuery.mockResolvedValueOnce({
      rows: [{ case_id: "1" }, { case_id: "2" }],
    });
    // 6 DELETEs per case = 12 total
    mockQuery.mockResolvedValue({ rows: [] });

    await deleteOldCases();

    // 1 SELECT + 7 DELETE * 2 cases = 15
    expect(mockQuery.mock.calls.length).toBe(15);
  });

  it("does not perform any DELETEs when no old cases exist", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await deleteOldCases();

    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("searches for cases older than 7 days", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await deleteOldCases();

    const selectCall = mockQuery.mock.calls[0];
    expect(selectCall[0]).toMatch(/date < \$1/i);
  });
});







describe("getDetailsNoCertainCount", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it("returns an object with the listName as key and an array as value", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ detail: "Pollen" }, { detail: "Nüsse" }],
    });

    const result = await getDetailsNoCertainCount("allergy", "allergies", "1");

    expect(result).toEqual({ allergies: ["Pollen", "Nüsse"] });
  });

  it("returns an empty array when no entries are found", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await getDetailsNoCertainCount("medication", "medication", "1");

    expect(result).toEqual({ medication: [] });
  });

  it("filters correctly by category and case_id", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await getDetailsNoCertainCount("condition", "conditions", "55");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("details_no_certain_count"),
      ["55", "condition"]
    );
  });

});






describe("getAccessCode", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it("returns the access_code", async () => {

    mockQuery.mockResolvedValueOnce({ rows: [{ access_code: "666864ea-a64e-4ddd-8597-93e53160a296" }] });

    const result = await getAccessCode("4");

    expect(result).toBe("666864ea-a64e-4ddd-8597-93e53160a296");
  });

  it("searches the cases table for the case_id", async () => {

    mockQuery.mockResolvedValueOnce({ rows: [{ access_code: "666864ea-a64e-4ddd-8597-93e53160a296" }] });

    await getAccessCode("4");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("access_code"),
      ["4"]
    );
  });
});





describe("buildUnifiedData", () => {
  it("returns a unified object when all parameters are provided", async () => {
    const basisData = buildBasisData();
    const additionalData = buildAdditionalData();

    const result = await buildUnifiedData(
      basisData,
      additionalData,
      sampleSymptomText,
      sampleSelectedSymptoms
    );

expect(result).not.toBeNull();


expect(result!.caseData.age).toBe(basisData.age);
expect(result!.caseData.gender).toBe(basisData.gender);
expect(result!.caseData.pregnancy).toBe(basisData.pregnancy);

expect(result!.additionalInfoData.breastfeeding).toBe(additionalData.breastfeeding);
expect(result!.additionalInfoData.duration).toBe(additionalData.duration);
expect(result!.additionalInfoData.weight).toBe(additionalData.weight);
expect(result!.additionalInfoData.height).toBe(additionalData.height);
expect(result!.additionalInfoData.worsening).toBe(additionalData.worsening);
expect(result!.additionalInfoData.extraInfo).toBe(additionalData.extraInfo);
expect(result!.additionalInfoData.temperature).toBe(additionalData.temperature);


expect(result!.symptomData.some((s: string) => s.includes("Kopfschmerz"))).toBe(true);
expect(result!.textSymptomData.some((s: string) => s.includes("Ich blute"))).toBe(true)

expect(result!.allergyData.allergies).toContain("Pollen");
expect(result!.medicationData?.medication?.some((m: { name: string }) => m.name === "Ibuprofen")).toBe(true);
expect(result!.conditionsData.conditions).toContain("Asthma");
  });

  it("returns null when basisData is missing", async() => {
    const result = await buildUnifiedData(
      undefined,
      buildAdditionalData(),
      sampleSymptomText,
      sampleSelectedSymptoms
    );

    expect(result).toBeNull();
  });

  it("returns null when additionalData is missing", async () => {
    const result = await buildUnifiedData(
      buildBasisData(),
      undefined,
      sampleSymptomText,
      sampleSelectedSymptoms
    );

    expect(result).toBeNull();
  });

  it("returns null when symptomText is missing", async () => {
    const result = await buildUnifiedData(
      buildBasisData(),
      buildAdditionalData(),
      undefined,
      sampleSelectedSymptoms
    );

    expect(result).toBeNull();
  });

  it("returns null when selectedymptoms is missing", async () => {
    const result = await buildUnifiedData(
      buildBasisData(),
      buildAdditionalData(),
      sampleSymptomText,
      undefined
    );

    expect(result).toBeNull();
  });
});


describe("buildAiPrompt", () => {
  it("includes data from caseData, additionalInfoData and symptoms in the prompt", async () => {
    const data = await buildUnifiedData(
      buildBasisData({ age: "28" }),
      buildAdditionalData({
        allergies: ["Pollen"],
        medication: [{ name: "Ibuprofen", dose: "2", unit: "mg", frequency: "3", frequencyUnit: "day",since: "3 Tage" }],
        conditions: ["Asthma"],
      }),
      sampleSymptomText,
      sampleSelectedSymptoms
    )!;

    if (data != null) {
      const prompt = await buildAiPrompt(data);

      expect(prompt).toContain("28");
      expect(prompt).toContain("Pollen");
      expect(prompt).toContain("Ibuprofen");
      expect(prompt).toContain("Asthma");
      expect(prompt).toContain("Kopfschmerz");
    }
  });

  it("works with data coming from getUserDataFromDB shape", async () => {
    mockQuery.mockReset();
    mockQuery
      .mockResolvedValueOnce({ rows: [{ sex: "w", age: 28, pregnancy: false }] })
      .mockResolvedValueOnce({ rows: [{ name_de: "Kopfschmerz", painscale: 4, bodyregion: "Kopf" }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ weight: 60, height: 165, temperature: 38.5, duration: 2, worsening: true, breastfeeding: false, extraInfo: "" }] })
      .mockResolvedValueOnce({ rows: [{ detail: "Pollen" }] })
      .mockResolvedValueOnce({ rows: [{ detail: "Ibuprofen" }] })
      .mockResolvedValueOnce({ rows: [{ detail: "Asthma" }] });

    const dbData = await getUserDataFromDB("1");
    const prompt = await buildAiPrompt(dbData);

    expect(prompt).toContain("Kopfschmerz");
    expect(prompt).toContain("Pollen");
    expect(prompt).toContain("Ibuprofen");
    expect(prompt).toContain("Asthma");
  });
});


describe("sendDataToAi", () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockFetch.mockReset();

    // INSERT INTO recommendations (and any other query during cache-path)
    mockQuery.mockResolvedValue({ rows: [] });

    // fetch mock: valid AI-Answer
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                assessment: {
                  urgency: "3",
                  urgencyText: "Zeitnahe Abklärung empfohlen",
                  suspicions: {
                    suspicion1: { reasonForSuspicion1: "Grippe", probability1: "0.7" },
                    suspicion2: { reasonForSuspicion2: "Erkältung", probability2: "0.15" },
                    suspicion3: { reasonForSuspicion3: "COVID-19", probability3: "0.1" },
                    suspicion4: { reasonForSuspicion4: "Sinusitis", probability4: "0.03" },
                    suspicion5: { reasonForSuspicion5: "Allergie", probability5: "0.02" },
                  },
                  nextSteps: "Bitte einen Arzt aufsuchen.",
                },
              }),
            },
          },
        ],
      }),
    });

    process.env.MEDGEMMA_API_URL = "http://fake-ai-url/api";
    process.env.MEDGEMMA_API_KEY = "fake-key";
    process.env.MEDGEMMA_API_MODEL = "fake-model";
  });

describe("with cache data (basisData, additionalData, symptomText, selectedymptoms)", () => {
  const basisData = buildBasisData();
  const additionalData = buildAdditionalData();

  it("returns the parsed AI result", async () => {
    const result = await sendDataToAi(
      basisData,
      additionalData,
      sampleSymptomText,
      sampleSelectedSymptoms,
      "19"
    );

    expect(result).toHaveProperty("assessment");
    expect(result.assessment).toHaveProperty("urgency", "3");
    expect(result.assessment.suspicions.suspicion1.reasonForSuspicion1).toBe("Grippe");
  });

  it("does not query getUserDataFromDB when cache data is provided", async () => {
    await sendDataToAi(
      basisData,
      additionalData,
      sampleSymptomText,
      sampleSelectedSymptoms,
      "19"
    );

    const dbDataQueries = mockQuery.mock.calls.filter(
      (call) =>
        typeof call[0] === "string" &&
        (call[0].includes("FROM cases") || call[0].includes("FROM case_symptoms"))
    );
    expect(dbDataQueries).toHaveLength(0);
  });

  it("writes the result to the recommendations table with the given caseId", async () => {
    await sendDataToAi(
      basisData,
      additionalData,
      sampleSymptomText,
      sampleSelectedSymptoms,
      "19"
    );

    const insertCall = mockQuery.mock.calls.find(
      (call) => typeof call[0] === "string" && call[0].includes("INSERT INTO recommendations")
    );
    expect(insertCall).toBeDefined();
    expect(insertCall![1][0]).toBe("19"); // caseId
    expect(insertCall![1][1]).toBe("3"); // urgency_level
    expect(insertCall![1][2]).toBe("Bitte einen Arzt aufsuchen."); // advice_text
    expect(insertCall![1][8]).toBe(70); // probability1 * 100
  });

  it("sends the fetch request to the configured MEDGEMMA_API_URL", async () => {
    await sendDataToAi(
      basisData,
      additionalData,
      sampleSymptomText,
      sampleSelectedSymptoms,
      "19"
    );

    expect(mockFetch).toHaveBeenCalledWith(
      "http://fake-ai-url/api",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("passes the Authorization header with the API key", async () => {
    await sendDataToAi(
      basisData,
      additionalData,
      sampleSymptomText,
      sampleSelectedSymptoms,
      "19"
    );

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer fake-key",
        }),
      })
    );
  });

  it("rejects with the error if the AI-API throws an Error object", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network Error"));

    await expect(
      sendDataToAi(
        basisData,
        additionalData,
        sampleSymptomText,
        sampleSelectedSymptoms,
        "19"
      )
    ).rejects.toThrow("Network Error");
  });

  it("rejects with the string error if the AI-API returns a string error", async () => {
    mockFetch.mockRejectedValueOnce("einfacher string fehler");

    await expect(
      sendDataToAi(
        basisData,
        additionalData,
        sampleSymptomText,
        sampleSelectedSymptoms,
        "19"
      )
    ).rejects.toBe("einfacher string fehler");
  });
});

describe("with only caseId (DB fallback)", () => {
  beforeEach(() => {
    // getUserDataFromDB: 7 Queries
    mockQuery
      .mockResolvedValueOnce({ rows: [{ sex: "w", age: 28, pregnancy: false }] })
      .mockResolvedValueOnce({ rows: [{ name_de: "Kopfschmerz", painscale: 4, bodyregion: "Kopf" }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ weight: 60, height: 165, temperature: 38.5, duration: 2, worsening: true, breastfeeding: false, extraInfo: "" }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    // INSERT INTO recommendations
    mockQuery.mockResolvedValue({ rows: [] });
  });

  it("falls back to DB data when no cache data is provided", async () => {
    const result = await sendDataToAi(undefined, undefined, undefined, undefined, "19");

    expect(result).toHaveProperty("assessment");
    expect(result.assessment).toHaveProperty("urgency", "3");
  });

  it("queries getUserDataFromDB when no cache data is provided", async () => {
    await sendDataToAi(undefined, undefined, undefined, undefined, "19");

    const dbDataQuery = mockQuery.mock.calls.find(
      (call) => typeof call[0] === "string" && call[0].includes("FROM cases")
    );
    expect(dbDataQuery).toBeDefined();
    expect(dbDataQuery![1]).toEqual(["19"]);
  });

  it("writes the result to the recommendations table", async () => {
    await sendDataToAi(undefined, undefined, undefined, undefined, "19");

    const insertCall = mockQuery.mock.calls.find(
      (call) => typeof call[0] === "string" && call[0].includes("INSERT INTO recommendations")
    );
    expect(insertCall).toBeDefined();
    expect(insertCall![1][0]).toBe("19");
    expect(insertCall![1][1]).toBe("3");
  });
});

describe("with neither cache data nor caseId", () => {
  it("returns undefined and logs an error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await sendDataToAi(undefined, undefined, undefined, undefined, undefined);

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Keine Daten verfügbar")
    );
    expect(mockFetch).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
});
});



describe("mapNameToSnomed", () => {
  it("returns the correct snomedCode for an existing symptomValue", async () => {
    const result = await mapNameToSnomed(
      "Verzerrtsehen: Gerade Linien erscheinen verbogen."
    );

    expect(result).toBe("1023001");
  });

  it("finds matches across different categories", async () => {
    const result = await mapNameToSnomed(
      "Parästhesien: Brennen, Kribbeln oder Ameisenlaufen."
    );

    expect(result).toBe("43214002");
  });

  it("returns null when no matching symptomValue exists", async () => {
    const result = await mapNameToSnomed("Nicht existierendes Symptom");

    expect(result).toBeNull();
  });
});