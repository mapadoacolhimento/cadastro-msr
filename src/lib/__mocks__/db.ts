import { vi } from "vitest";
import { mockDeep, DeepMockProxy } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { db } from "@/lib";

vi.mock("../../lib/db", () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
}));

const mockedDb = db as unknown as DeepMockProxy<PrismaClient>;
export default mockedDb;
