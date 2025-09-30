import { faker } from '@faker-js/faker';

/**
 * Test data factories for generating realistic test data
 */

export interface TestUser {
  email: string;
  password: string;
  displayName: string;
  zipCode: string;
  phoneNumber?: string;
  bio?: string;
}

export interface TestPost {
  content: string;
  authorId: string;
  groupId?: string;
}

export interface TestGroup {
  name: string;
  description: string;
  zipCode: string;
  createdBy: string;
  isPublic: boolean;
}

export interface TestEvent {
  title: string;
  description: string;
  location: string;
  zipCode: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  maxAttendees?: number;
}

export const createTestUser = (overrides: Partial<TestUser> = {}): TestUser => {
  return {
    email: faker.internet.email(),
    password: 'TestPassword123!',
    displayName: faker.person.fullName(),
    zipCode: faker.location.zipCode('#####'),
    phoneNumber: faker.phone.number(),
    bio: faker.lorem.paragraph(),
    ...overrides,
  };
};

export const createTestPost = (overrides: Partial<TestPost> = {}): TestPost => {
  return {
    content: faker.lorem.paragraph(),
    authorId: faker.string.uuid(),
    ...overrides,
  };
};

export const createTestGroup = (overrides: Partial<TestGroup> = {}): TestGroup => {
  return {
    name: `${faker.word.adjective()} ${faker.word.noun()} Parents`,
    description: faker.lorem.paragraph(),
    zipCode: faker.location.zipCode('#####'),
    createdBy: faker.string.uuid(),
    isPublic: faker.datatype.boolean(),
    ...overrides,
  };
};

export const createTestEvent = (overrides: Partial<TestEvent> = {}): TestEvent => {
  const startDate = faker.date.future();
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 2);

  return {
    title: faker.company.catchPhrase(),
    description: faker.lorem.paragraphs(2),
    location: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}`,
    zipCode: faker.location.zipCode('#####'),
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    createdBy: faker.string.uuid(),
    maxAttendees: faker.number.int({ min: 10, max: 100 }),
    ...overrides,
  };
};

export const createMultipleUsers = (count: number): TestUser[] => {
  return Array.from({ length: count }, () => createTestUser());
};

export const createMultiplePosts = (count: number, authorId: string): TestPost[] => {
  return Array.from({ length: count }, () => createTestPost({ authorId }));
};

export const createMultipleGroups = (count: number, createdBy: string): TestGroup[] => {
  return Array.from({ length: count }, () => createTestGroup({ createdBy }));
};
