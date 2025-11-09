import {expect, test} from "@playwright/test";
import {StatusCodes} from "http-status-codes";
let baseURL: string = 'http://localhost:3000/users';

test('all users: should return empty array when no users', async ({ request }) => {
    const getResponse = await request.get(`${baseURL}`);
    expect(getResponse.status()).toBe(StatusCodes.OK);
    const responseBody = await getResponse.text()
    expect(responseBody).toBe('[]');
});

