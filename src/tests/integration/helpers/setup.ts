import { server } from "./nodejs";

vi.stubEnv(
	"DATABASE_URL",
	"postgresql://postgres:changeme@localhost:5432/mapa-org?connection_limit=1"
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
