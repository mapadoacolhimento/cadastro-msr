import resetDb from "./reset-db";
import { server } from "./nodejs";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(async () => {
	await resetDb();
});
