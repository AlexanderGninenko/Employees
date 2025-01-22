const { PrismaClient, Prisma } = require('@prisma/client');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const prisma = new PrismaClient();

const getAllEmployees = async (req, res, next) => {
	await prisma.employee
		.findMany()
		.then(employee => res.json({ employee }))
		.catch(e => next(e));
};

const getEmployeeById = async (req, res, next) => {
	const { id } = req.params;

	await prisma.employee
		.findUniqueOrThrow({
			where: {
				id: id,
			},
		})
		.then(employee => res.json({ employee }))
		.catch(e => {
			if (e.code === 'P2025') {
				next(new NotFoundError('Сотрудник не найден'));
			}
			next(e);
		});
};

const addEmployee = async (req, res, next) => {
	const { firstName, lastName, address, age } = req.body;

	await prisma.employee
		.create({
			data: {
				firstName,
				lastName,
				address,
				age,
				userId: req.user.id,
			},
		})
		.then(employee => res.status(201).json({ employee }))
		.catch(e => {
			if (e instanceof Prisma.PrismaClientValidationError) {
				next(new BadRequestError(e.message));
			}
			next(e);
		});
};

const editEmployee = async (req, res, next) => {
	const { id } = req.params;
	const data = req.body;

	await prisma.employee
		.update({
			where: {
				id,
			},
			data: {
				...data,
			},
		})
		.then(employee => res.json(employee))
		.catch(e => {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				next(new BadRequestError(e.message));
			}
			next(e);
		});
};

const removeEmployee = async (req, res, next) => {
	const { id } = req.params;

	await prisma.employee
		.delete({
			where: {
				id,
			},
		})
		.then(employee => res.json(employee))
		.catch(e => {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				next(new BadRequestError(e.message));
			}
			next(e);
		});
};

module.exports = {
	getAllEmployees,
	addEmployee,
	getEmployeeById,
	removeEmployee,
	editEmployee,
};
