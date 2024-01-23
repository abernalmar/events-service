const Event = require("../../models/event");
const dbConnect = require("../../db");

jest.setTimeout(30000);

describe("Events DB connection", () => {
  beforeAll((done) => {
    if (dbConnect.readyState == 1) {
      done();
    } else {
      dbConnect.on("connected", () => done());
    }
  });

  beforeEach(async () => {
    await Event.deleteMany({});
  });

  it("writes a event in the DB", async () => {
    const event = new Event({
      name: "Boda J&A",
      place: "Hacienda",
      description: "Boda en una hacienda en el campo",
      category: "Boda",
      date: new Date(2025, 3, 31),
    });
    await event.save();
    events = await Event.find();
    expect(events).toBeArrayOfSize(1);
  });

  afterAll(async () => {
    if (dbConnect.readyState == 1) {
      await dbConnect.close();
    }
  });
});
