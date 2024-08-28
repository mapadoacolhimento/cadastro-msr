import "@testing-library/jest-dom/vitest";

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

// Mock the useRouter
vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

global.fetch = vi.fn();

vi.mock("jsonwebtoken", () => ({
	sign: vi.fn(),
}));

vi.stubEnv("VOLUNTEER_API", "http://voluntaria.mapa.org.br");
vi.stubEnv("ZENDESK_API_TOKEN", "XXXXXXXXXX");
vi.stubEnv("ZENDESK_API_USER", "user@email.org");
vi.stubEnv("ZENDESK_SUBDOMAIN", "https://subdomain.zendesk.com");
vi.stubEnv("MATCH_LAMBDA_URL", "https://localhost:5000");
