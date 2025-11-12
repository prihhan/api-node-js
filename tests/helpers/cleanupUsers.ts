import { expect, APIRequestContext } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';

const baseURL = 'http://localhost:3000/users';

export async function cleanupUsers(request: APIRequestContext) {
    //get all users
    const getAllResponse = await request.get(baseURL);
    expect(getAllResponse.status()).toBe(StatusCodes.OK);

    const users = await getAllResponse.json();

    //populate user IDs
    const userIDs: number[] = [];
    for (let i = 0; i < users.length; i++) {
        userIDs.push(users[i].id);
    }
    const numberOfObjects = userIDs.length;

    //Delete all users in a loop using the previously created array
    for (let i = 0; i < numberOfObjects; i++) {
        let response = await request.delete(`${baseURL}/${userIDs[i]}`);
        expect.soft(response.status()).toBe(StatusCodes.OK);
    }
}