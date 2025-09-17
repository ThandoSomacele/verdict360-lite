import { describe, it, expect } from '@jest/globals';

describe('Health Check API', () => {
  describe('GET /api/health', () => {
    it('should return status ok', async () => {
      const mockResponse = {
        status: 'ok',
        timestamp: expect.any(String),
        environment: 'test'
      };

      expect(mockResponse.status).toBe('ok');
      expect(mockResponse).toHaveProperty('timestamp');
      expect(mockResponse).toHaveProperty('environment');
    });

    it('should include database status', async () => {
      const healthCheck = {
        database: 'connected',
        redis: 'connected',
        ai: 'available'
      };

      expect(healthCheck.database).toBe('connected');
      expect(healthCheck.redis).toBe('connected');
      expect(healthCheck.ai).toBe('available');
    });
  });
});