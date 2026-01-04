import { test, expect } from '@playwright/test';
import { ApiClient } from '../../helpers/apiClient';
import {
  mockUsers,
  mockUpdateUser,
  mockDeleteUser,
  mockUnknown,
  mockRegister
} from '../../helpers/apiMocks';

test.describe('API Endpoint Tests (Mocked)', () => {

    test('GET /users/2', async ({ page }) => {
        await mockUsers(page);
        const api = new ApiClient(page);
        const response = await api.get('https://reqres.in/api/users/2');

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(2);
    });

    test('POST /users', async ({ page }) => {
        await mockUsers(page);
        const api = new ApiClient(page);
        const response = await api.post('https://reqres.in/api/users',
            { name: 'morpheus', job: 'leader' }
        );

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('morpheus');
    });

    test('PUT /users/2', async ({ page }) => {
        await mockUpdateUser(page);
        const api = new ApiClient(page);

        const response = await api.put(
        'https://reqres.in/api/users/2',
        { name: 'morpheus', job: 'zion resident' }
        );

        expect(response.status).toBe(200);
        expect(response.body.job).toBe('zion resident');
    });

    test('DELETE /users/2', async ({ page }) => {
        await mockDeleteUser(page);
        const api = new ApiClient(page);

        const response = await api.delete('https://reqres.in/api/users/2');

        expect(response.status).toBe(204);
    });

    test('GET /unknown/2', async ({ page }) => {
        await mockUnknown(page);
        const api = new ApiClient(page);

        const response = await api.get('https://reqres.in/api/unknown/2');

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(2);
    });

    test('POST /register', async ({ page }) => {
        await mockRegister(page);
        const api = new ApiClient(page);

        const response = await api.post(
        'https://reqres.in/api/register',
        { email: 'eve.holt@reqres.in', password: 'pistol' }
        );

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    test('GET /users/999 - not found', async ({ page }) => {
        await mockUsers(page, { status: 404 });
        const api = new ApiClient(page);

        const response = await api.get('https://reqres.in/api/users/999');

        expect(response.status).toBe(404);
        });

    test('GET /users/2 - missing data field', async ({ page }) => {
        await mockUsers(page, {
            body: {}
        });
        const api = new ApiClient(page);

        const response = await api.get('https://reqres.in/api/users/2');

        expect(response.status).toBe(200);
        expect(response.body.data).toBeUndefined();
        });

    test('POST /users - empty payload', async ({ page }) => {
        await mockUsers(page, { status: 400 });
        const api = new ApiClient(page);

        const response = await api.post(
            'https://reqres.in/api/users',
            {}
        );

        expect(response.status).toBe(400);
        });

        test('POST /users - extra fields', async ({ page }) => {
        await mockUsers(page);
        const api = new ApiClient(page);

        const response = await api.post(
            'https://reqres.in/api/users',
            { name: 'neo', job: 'dev', extra: 'x' }
        );

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('neo');
        });

        test('PUT /users/999 - user not found', async ({ page }) => {
        await mockUpdateUser(page, { status: 404 });
        const api = new ApiClient(page);

        const response = await api.put(
            'https://reqres.in/api/users/999',
            { name: 'x' }
        );

        expect(response.status).toBe(404);
        });

        test('PATCH /users/2 - partial update', async ({ page }) => {
        await mockUpdateUser(page);
        const api = new ApiClient(page);

        const response = await api.patch(
            'https://reqres.in/api/users/2',
            { job: 'architect' }
        );

        expect(response.status).toBe(200);
        expect(response.body.job).toBe('architect');
        });

        test('DELETE /users/999 - not found', async ({ page }) => {
        await mockDeleteUser(page, { status: 404 });
        const api = new ApiClient(page);

        const response = await api.delete('https://reqres.in/api/users/999');

        expect(response.status).toBe(404);
        });

        test('POST /register - missing password', async ({ page }) => {
        await mockRegister(page, { status: 400 });
        const api = new ApiClient(page);

        const response = await api.post(
            'https://reqres.in/api/register',
            { email: 'eve.holt@reqres.in' }
        );

        expect(response.status).toBe(400);
        });

        test('POST /register - missing email', async ({ page }) => {
        await mockRegister(page, { status: 400 });
        const api = new ApiClient(page);

        const response = await api.post(
            'https://reqres.in/api/register',
            { password: '123' }
        );

        expect(response.status).toBe(400);
        });

        test('GET /users - server error', async ({ page }) => {
        await mockUsers(page, { status: 500 });
        const api = new ApiClient(page);

        const response = await api.get('https://reqres.in/api/users/2');

        expect(response.status).toBe(500);
        });

        test('GET /users - method not allowed', async ({ page }) => {
        await mockUsers(page, { status: 405 });
        const api = new ApiClient(page);

        const response = await api.put(
            'https://reqres.in/api/users/2',
            {}
        );

        expect(response.status).toBe(405);
    });


});
