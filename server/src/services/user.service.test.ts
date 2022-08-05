import { encryptPassword } from './../utils/bcrypt.util';
let util = require('../utils/bcrypt.util');
const service = require('./user.service');
import UserModel from '../models/user.model';
const mockingoose = require('mockingoose'); // for model related mocking

const user = { uuid: 'a@a.com', name: 'John Doe', password: 'password123' };

beforeEach(() => {
	mockingoose.resetAll();
	jest.resetAllMocks();
	util.encryptPassword = jest.fn();
});

describe('create', () => {
	describe('password is provided', () => {
		test('calls encryptPassword', async () => {
			await service.create(user);
			expect(util.encryptPassword).toHaveBeenCalled();
			expect(util.encryptPassword).toHaveBeenCalledWith(user.password);
		});
	});
	test('return user', async () => {
		const res = await service.create(user);
		mockingoose(UserModel).toReturn(user, 'save');

		expect(res).toMatchObject(user);
	});
});
describe('find', () => {
	test('return user', async () => {
		UserModel.findOne = jest.fn().mockResolvedValue(user);
		const res = await service.find(user);

		expect(res).toMatchObject(user);
	});
});

describe('findOrCreate', () => {
	describe('when new user', () => {
		it('should call create function', async () => {
			service.create = jest.fn().mockResolvedValue(user);
			const res = await service.findOrCreate(user);

			expect(service.create).toHaveBeenCalledWith(user);
			expect(res).toMatchObject(user);
		});
	});

	describe('when existing user', () => {
		it('should not call create function', async () => {
			service.create = jest.fn();
			service.find = jest.fn().mockResolvedValue(user);

			const res = await service.findOrCreate(user);

			expect(service.create).not.toHaveBeenCalled();
			expect(res).toMatchObject(user);
		});
	});
});