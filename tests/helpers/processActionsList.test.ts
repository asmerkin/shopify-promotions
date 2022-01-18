import { mocked } from "ts-jest/dist/utils/testing";
import CartApi from "../../helpers/CartApi";
import { processActionsList } from "../../helpers/processActionsList";
import { Cart, CartApiAction } from "../../types";

beforeAll( () => {
    jest.spyOn(CartApi, 'add').mockImplementation( async (payload) => { return {} as Cart }); 
    jest.spyOn(CartApi, 'change').mockImplementation( async (payload) => { return {} as Cart }); 
    jest.spyOn(CartApi, 'update').mockImplementation( async (payload) => { return {} as Cart }); 
}); 

describe('Actions list processor', () => {
    test('Testing that actions are processed', async () => {

        const actions: CartApiAction[] = [
            {action: 'add', payload: {'sample': true} },
            {action: 'change', payload: {'sample': true} },
            {action: 'update', payload: {'sample': true} },
        ];

        const response = await processActionsList(actions); 

        expect(response).toBeTruthy(); 
        expect(CartApi.add).toBeCalledTimes(1);
        expect(CartApi.change).toBeCalledTimes(1);
        expect(CartApi.update).toBeCalledTimes(1);
    }); 

    test('Not running any actions returns null', async () => {

        const actions: CartApiAction[] = [];

        const response = await processActionsList(actions); 

        expect(response).toBeNull(); 
    }); 
}); 