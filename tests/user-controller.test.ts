// tests/api.spec.ts
import { test, expect } from '@playwright/test';
import {StatusCodes} from "http-status-codes";
import {cleanupUsers} from "./helpers/cleanupUsers";


let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API', () => {
    test.beforeEach(async ({ request }) => {
        await cleanupUsers(request);
    });

    test('find user: should return a user by ID', async ({ request }) => {
        const response = await request.post(`${baseURL}`);
        const responseBody = await response.json()
        const userId = await responseBody.id;
        const getResponse = await request.get(baseURL + '/' + userId);
        expect(getResponse.status()).toBe(StatusCodes.OK);
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

    test('half working test: get user id information', async ({ request }) => {
        const responseCreate1 = await request.post(`${baseURL}`);
        const responseCreate2 = await request.post(`${baseURL}`);
        const responseAllUsers = await request.get(`${baseURL}`);
        const responseUsers = await responseAllUsers.json();

        const numberOfObjects = responseUsers.length;
        console.log('number of objects', numberOfObjects);

        let userIDs: number[] = [];
        for (let i = 0; i < numberOfObjects; i++) {
            // get user ID from the response
            const userID = responseUsers[i].id;
            // push is used to add elements to the end of an array
            userIDs.push(userID);
        }
        console.log('userIDs:', userIDs);
    })
})
