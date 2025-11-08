// tests/api.spec.ts
import { test, expect } from '@playwright/test';
import {StatusCodes} from "http-status-codes";


let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API', () => {
    test('find user: should return a user by ID', async ({ request }) => {
        const response = await request.post(`${baseURL}`);
        const responseBody = await response.json()
        const userId = await responseBody.id;
        const getResponse = await request.get(baseURL + '/' + userId);
        expect(getResponse.status()).toBe(200);
    });

    test('find user: should return 404 if user not found', async ({ request }) => {
        const notFoundUser = 'notFound-id-234';
        const getResponse = await request.get(`${baseURL}/${notFoundUser}`);
        expect(getResponse.status()).toBe(StatusCodes.NOT_FOUND);
    });

    test('create user: should add a new user', async ({ request }) => {
        const response = await request.post(`${baseURL}`);
        expect(response.status()).toBe(201);
        const responseBody = await response.json()
        expect(responseBody.name).toBeDefined();
        console.log(responseBody);
    });

    test('delete user: should delete a user by ID', async ({ request }) => {
        const response = await request.post(`${baseURL}`);
        const responseBody = await response.json();
        expect(response.status()).toBe(StatusCodes.CREATED);
        const userId = responseBody.id;
        console.log('Random user created with id:', userId);
        const deleteResponse = await request.delete(`${baseURL}/${userId}`);
        expect(deleteResponse.status()).toBe(StatusCodes.OK);
        const getResponse = await request.get(`${baseURL}/${userId}`);
        expect(getResponse.status()).toBe(StatusCodes.NOT_FOUND);
    });

    test('delete user: should return 404 if user not found', async ({ request }) => {
        const nonExistentUserId = '9999999';
        const deleteResponse = await request.delete(`${baseURL}/${nonExistentUserId}`);
        expect(deleteResponse.status()).toBe(StatusCodes.NOT_FOUND);
        const responseBody = await deleteResponse.text();
        console.log('Response body:', responseBody);
    });

});
