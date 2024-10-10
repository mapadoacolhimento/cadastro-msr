import { mockDeep, DeepMockProxy } from "vitest-mock-extended";
import { PrismaClient } from "@prisma-mongodb/client";
import { mongodb } from "@/lib";

vi.mock("../../lib/mongodb", () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
}));

const mockedMongodb = mongodb as unknown as DeepMockProxy<PrismaClient>;
export default mockedMongodb;
