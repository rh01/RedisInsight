import { EncryptionStrategy } from 'src/modules/encryption/models';

export const mockDataToEncrypt = 'stringtoencrypt';
export const mockKeytarPassword = 'somepassword';

export const mockEncryptionStrategy = EncryptionStrategy.KEYTAR;

export const mockEncryptResult = {
  data: '4a558dfef5c1abbdf745232614194ee9',
  encryption: mockEncryptionStrategy,
};

export const mockEncryptionService = jest.fn(() => ({
  getAvailableEncryptionStrategies: jest.fn(),
  encrypt: jest.fn(),
  decrypt: jest.fn(),
}));

export const mockEncryptionStrategyInstance = jest.fn(() => ({
  isAvailable: jest.fn(),
  encrypt: jest.fn(),
  decrypt: jest.fn(),
}));

export const mockKeytarModule = {
  getPassword: jest.fn(),
  setPassword: jest.fn(),
};
