// mocks


// Mock for database connection
const mockQuery = jest.fn();
jest.mock("../app/dbs/db", () => ({
  connectionPool: {
    query: mockQuery,
  },
}));

// cookie mock
const mockCookieSet = jest.fn();
const mockCookieGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() =>
    Promise.resolve({
      set: mockCookieSet,
      get: mockCookieGet,
    })
  ),
}));

// import functions to test

import {
  saveFormData,
  insertListIntoSymptomsNoCertainCount,
  getDBData,
  getUserDataFromDB,
  getAiDataFromDB,
} from "../app/actions";



// dummy function for all inputs
function buildFormData(overrides: Record<string, string> = {}): FormData {
  const defaults: Record<string, string> = {
    age: "30",
    gender: "weiblich",
    pregnancy: "nein",
    weight: "65",
    height: "170",
    medication: "Ibuprofen, Aspirin",
    conditions: "Asthma",
    allergies: "Pollen",
    temperature: "37,5",
    duration: "3",
    worsening: "ja",
    breastfeeding: "nein",
    extraInfo: "Kein weiterer Hinweis",
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

// testing saveFormData

describe("saveFormData", () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockCookieSet.mockReset();

    // INSERT INTO cases returns case_id, access_code
    mockQuery.mockResolvedValueOnce({
      rows: [{ case_id: "42", access_code: "ABC123" }],
    });
    // INSERT INTO additional_information
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // more queries for insertListIntoSymptomsNoCertainCount
    mockQuery.mockResolvedValue({ rows: [] });
  });

  it("write case-Basisdaten into DB and set Cookie", async () => {
    const formData = buildFormData();

    await saveFormData(formData);

    // first db call has to be INSERT INTO cases
    const firstCall = mockQuery.mock.calls[0];
    expect(firstCall[0]).toMatch(/Insert into cases/i);
    // check age
    expect(firstCall[1]).toContain(30);
    // gender correctly converted
    expect(firstCall[1]).toContain("w");

    // cookie set
    expect(mockCookieSet).toHaveBeenCalledWith(
      expect.objectContaining({ name: "caseId", value: "42" })
    );
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

  it("sets pregnancy=true when 'ja' is provided", async () => {
    const formData = buildFormData({ gender: "weiblich", pregnancy: "ja" });

    await saveFormData(formData);

    const firstCall = mockQuery.mock.calls[0];
    expect(firstCall[1]).toContain(true);
  });

  it("parses the comma-separated list of medications correctly (trims whitespace)", async () => {
    const formData = buildFormData({
      medication: " Ibuprofen , Aspirin , Paracetamol ",
    });

    await saveFormData(formData);

    const medicationCalls = mockQuery.mock.calls.filter(
      (call) =>
        Array.isArray(call[1]) && call[1].includes("medication")
    );
    expect(medicationCalls).toHaveLength(3);
  });

  it("processes empty selectedSymptoms and symptomText without errors", async () => {
    const formData = buildFormData({ selectedSymptoms: "", symptomText: "" });

    await expect(saveFormData(formData)).resolves.not.toThrow();
  });

  it("write prewritten symptoms correctly in case_symptoms", async () => {
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
      BigInt(1) as unknown as BigInteger
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
      BigInt(1) as unknown as BigInteger
    );

    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("passes the correct category to the DB", async () => {
    await insertListIntoSymptomsNoCertainCount(
      ["Ibuprofen"],
      "medication",
      BigInt(99) as unknown as BigInteger
    );

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining(["medication", "Ibuprofen"])
    );
  });
});







describe("getDBData", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it("returns the first row when the case exists", async () => {
    const fakeRow = { case_id: "7", age: 45, sex: "m" };
    mockQuery.mockResolvedValueOnce({ rows: [fakeRow] });

    const result = await getDBData("7");

    expect(result).toEqual(fakeRow);
  });

  it("returns null when no case is found", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await getDBData("999");

    expect(result).toBeNull();
  });

  it("includes the access_code in the query", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await getDBData("123");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("$accessCode"),
      ["123"]
    );
  });
});







describe("getUserDataFromDB", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it("returns an object with all expected fields", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ sex: "w", age: 25, pregnancy: false }] }) // cases
      .mockResolvedValueOnce({ rows: [{ name_de: "Kopfschmerz", painscale: 3, bodyregion: "Kopf" }] }) // case_symptoms
      .mockResolvedValueOnce({ rows: [] })                                        // raw_text_symptoms JOIN
      .mockResolvedValueOnce({ rows: [{ weight: 60, height: 165 }] })             // additional_information
      .mockResolvedValueOnce({ rows: [{ detail: "Pollen" }] })                    // allergies
      .mockResolvedValueOnce({ rows: [] })                                        // medication
      .mockResolvedValueOnce({ rows: [] });                                       // conditions

    const result = await getUserDataFromDB("1");

    expect(result).toHaveProperty("caseData");
    expect(result).toHaveProperty("symptomData");
    expect(result).toHaveProperty("textSymptomData");
    expect(result).toHaveProperty("additionalInfoData");
    expect(result).toHaveProperty("allergyData");
    expect(result).toHaveProperty("medicationData");
    expect(result).toHaveProperty("conditionsData");
  });

  it("returns allergies correctly as an array in the format { allergies: [...] }", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ detail: "Pollen" }, { detail: "Nüsse" }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

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

    await getAiDataFromDB("caseId-99");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("FROM recommendations"),
      ["caseId-99"]
    );
  });
});